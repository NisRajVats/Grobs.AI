import pdfplumber
import re
from typing import Dict, List, Optional, Tuple
from transformers import pipeline
from datetime import datetime
import schemas

# Initialize NER pipeline with error handling
try:
    nlp_pipeline = pipeline("ner", model="dslim/bert-base-NER", aggregation_strategy="simple")
except Exception as e:
    print(f"Warning: NER model not loaded: {e}")
    nlp_pipeline = None

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from a PDF file with improved handling."""
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")
    
    if not text.strip():
        raise ValueError("No text could be extracted from the PDF")
    
    return text

def clean_text(text: str) -> str:
    """Clean and normalize text."""
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[\u200b\u200c\u200d\ufeff]', '', text)
    return text.strip()

def extract_email(text: str) -> Optional[str]:
    """Extract email address with improved pattern matching."""
    email_pattern = r'\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b'
    matches = re.findall(email_pattern, text)
    
    # Filter out common false positives
    valid_emails = [m for m in matches if not any(x in m.lower() for x in ['example.com', 'domain.com', 'email.com'])]
    
    return valid_emails[0] if valid_emails else None

def extract_phone(text: str) -> Optional[str]:
    """Extract phone number with improved pattern matching."""
    phone_patterns = [
        r'\+?1?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})',
        r'\+?\d{1,3}[-.\s]?\d{9,15}',
        r'\b\d{10,15}\b',
    ]
    
    for pattern in phone_patterns:
        matches = re.findall(pattern, text)
        if matches:
            # Get first match and clean it
            if isinstance(matches[0], tuple):
                phone = ''.join(matches[0])
            else:
                phone = re.sub(r'[^\d+]', '', matches[0])
            
            if len(phone) >= 10:
                return phone
    
    return None

def extract_linkedin(text: str) -> Optional[str]:
    """Extract LinkedIn URL with improved pattern matching."""
    linkedin_patterns = [
        r'(?:https?://)?(?:www\.)?linkedin\.com/in/[\w-]+/?',
        r'linkedin\.com/in/[\w-]+',
    ]
    
    for pattern in linkedin_patterns:
        matches = re.search(pattern, text, re.IGNORECASE)
        if matches:
            url = matches.group(0)
            if not url.startswith('http'):
                url = 'https://' + url
            return url.rstrip('/')
    
    return None

def extract_name(text: str) -> str:
    """Extract name using multiple methods."""
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    # Method 1: Use NER if available
    if nlp_pipeline:
        try:
            # Check first 1000 characters for name
            ner_results = nlp_pipeline(text[:1000])
            person_entities = [
                entity['word'] for entity in ner_results 
                if entity['entity_group'] == 'PER' and entity['score'] > 0.85
            ]
            if person_entities:
                # Get the first high-confidence person name
                name = person_entities[0].strip()
                # Clean up subword tokens (##)
                name = re.sub(r'\s*##\s*', '', name)
                if len(name.split()) >= 2:  # At least first and last name
                    return name
        except Exception:
            pass
    
    # Method 2: Assume first non-empty line is the name
    for line in lines[:5]:  # Check first 5 lines
        # Skip lines that look like contact info or common headers
        lower = line.lower()
        if any(pattern in lower for pattern in ['email', '@', 'phone', 'resume', 'cv', 'curriculum', 'http', 'linkedin']):
            continue
        if re.search(r'\d{3,}', line):  # Skip lines with long numbers
            continue
        if re.search(r'[|•]', line):  # Skip lines with bullets or pipes
            continue
        # Check if line looks like a name (2-4 words, mostly capitalized)
        words = [w for w in line.split() if w]
        if 2 <= len(words) <= 4:
            capitalized = sum(1 for w in words if w[0].isupper())
            if capitalized >= len(words) * 0.5:  # At least 50% capitalized
                return line
    
    # Fallback: return first line
    return lines[0] if lines else "Unknown"

def find_section_boundaries(lines: List[str], section_keywords: List[str]) -> Tuple[int, int]:
    """Find start and end of a section."""
    section_headers = ['education', 'experience', 'work', 'employment', 'skills', 'projects', 
                      'certifications', 'awards', 'summary', 'objective']
    
    start_idx = -1
    for i, line in enumerate(lines):
        lower = line.lower().strip()
        if any(keyword in lower for keyword in section_keywords):
            start_idx = i + 1
            break
    
    if start_idx == -1:
        return -1, -1
    
    # Find end (next section or end of document)
    end_idx = len(lines)
    for i in range(start_idx, len(lines)):
        lower = lines[i].lower().strip()
        # Check if this is a new section header
        if any(header in lower for header in section_headers):
            # Make sure it's actually a section header (short line)
            if len(lines[i].split()) <= 5:
                end_idx = i
                break
    
    return start_idx, end_idx

def extract_dates_from_line(text: str) -> Tuple[Optional[str], Optional[str]]:
    """Extract start and end dates from a single line or text block."""
    # Common date patterns
    patterns = [
        # Year - Year format: 2021 - 2025, 2021-2025, 2021 – 2025
        r'(\d{4})\s*[-–—]\s*(\d{4}|present|current|ongoing)',
        # Month Year - Month Year: Jan 2021 - Dec 2024
        r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{4})\s*[-–—]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{4}|present|current)',
        # MM/YYYY - MM/YYYY
        r'(\d{1,2})/(\d{4})\s*[-–—]\s*(\d{1,2})/(\d{4})',
        # Just years with pipe: 2021 | 2025
        r'(\d{4})\s*[|]\s*(\d{4})',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            groups = match.groups()
            
            # Extract start date
            if groups[0].isdigit() and len(groups[0]) == 4:
                start_date = groups[0]
            elif len(groups) > 1 and groups[1].isdigit():
                start_date = groups[1]
            else:
                start_date = None
            
            # Extract end date
            end_date = None
            for g in reversed(groups):
                if g and (g.isdigit() and len(g) == 4):
                    end_date = g
                    break
                elif g and any(word in g.lower() for word in ['present', 'current', 'ongoing']):
                    end_date = str(datetime.now().year)
                    break
            
            if start_date and end_date:
                return start_date, end_date
    
    return None, None

def extract_education(text: str) -> List[schemas.EducationCreate]:
    """Extract education entries with improved accuracy."""
    education = []
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    education_keywords = ['education', 'academic', 'qualification']
    start_idx, end_idx = find_section_boundaries(lines, education_keywords)
    
    if start_idx == -1:
        # Try to find education entries anywhere
        start_idx = 0
        end_idx = len(lines)
    
    # Degree patterns - more flexible
    degree_patterns = [
        r'(Bachelor|Master|PhD|Ph\.?D\.?|Doctorate|B\.?Tech|B\.?E\.?|B\.?S\.?|B\.?A\.?|M\.?S\.?|M\.?A\.?|M\.?Tech|MBA|Associate|Diploma)(?:\s+(?:of|in|degree))?\s+([A-Za-z\s&,\(\)]+?)(?=\s*(?:from|at|-|–|,|\||$))',
        r'(B\.?Tech|B\.?E\.?|B\.?S\.?|B\.?A\.?|M\.?S\.?|M\.?A\.?|M\.?Tech|MBA)',
    ]
    
    i = start_idx
    while i < end_idx:
        line = lines[i]
        
        # Try to match degree
        degree_match = None
        field = None
        
        for pattern in degree_patterns:
            degree_match = re.search(pattern, line, re.IGNORECASE)
            if degree_match:
                degree = degree_match.group(1).strip()
                if len(degree_match.groups()) > 1:
                    field = degree_match.group(2).strip()
                    # Clean up field
                    field = re.sub(r'\s+', ' ', field)
                    field = re.sub(r'[,\.\-–—].*$', '', field).strip()
                break
        
        if degree_match:
            # Look for university/college in same or nearby lines
            school = None
            dates = (None, None)
            location = None
            
            # Check current line and next 3 lines
            context_lines = [lines[j] for j in range(i, min(i+4, end_idx))]
            context = ' '.join(context_lines)
            
            # Extract university
            school_patterns = [
                r'((?:[A-Z][a-z]+\s+){1,4}(?:University|College|Institute|School|Academy)(?:\s+of\s+[A-Za-z\s]+)?)',
                r'([A-Z]{2,}(?:\s+[A-Z][a-z]+)*(?:\s+University|College|Institute)?)',
            ]
            
            for sp in school_patterns:
                school_match = re.search(sp, context)
                if school_match:
                    school = school_match.group(1).strip()
                    # Remove trailing info after comma or pipe
                    school = re.split(r'[,|]', school)[0].strip()
                    break
            
            # Extract dates
            dates = extract_dates_from_line(context)
            
            # If no field extracted, try to find it in context
            if not field:
                field_match = re.search(r'(?:in|of)\s+([A-Za-z\s&,]+?)(?=\s*(?:from|at|-|–|,|\||$))', context, re.IGNORECASE)
                if field_match:
                    field = field_match.group(1).strip()
            
            # Build degree string
            if field:
                degree_str = f"{degree} in {field}"
            else:
                degree_str = degree
            
            education.append(schemas.EducationCreate(
                school=school if school else "University",
                degree=clean_text(degree_str)[:200],
                start_date=dates[0] if dates[0] else "2020",
                end_date=dates[1] if dates[1] else "2024"
            ))
            
            i += 3  # Skip ahead
        else:
            i += 1
    
    # Fallback if nothing found
    if not education:
        education.append(schemas.EducationCreate(
            school="University",
            degree="Bachelor's Degree",
            start_date="2020",
            end_date="2024"
        ))
    
    return education

def extract_experience(text: str) -> List[schemas.ExperienceCreate]:
    """Extract work experience with improved accuracy."""
    experience = []
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    experience_keywords = ['experience', 'work history', 'employment', 'work experience', 'professional experience']
    start_idx, end_idx = find_section_boundaries(lines, experience_keywords)
    
    if start_idx == -1:
        return []
    
    # Job title patterns - look for titles that are typically standalone
    job_indicators = [
        'Engineer', 'Developer', 'Manager', 'Analyst', 'Designer', 'Consultant', 
        'Architect', 'Lead', 'Director', 'Specialist', 'Coordinator', 'Associate',
        'Intern', 'Assistant', 'Administrator', 'Scientist', 'Researcher', 'Officer',
        'Executive', 'Supervisor', 'Head', 'Chief', 'Programmer', 'Technician'
    ]
    
    i = start_idx
    while i < end_idx:
        line = lines[i]
        
        # Check if line contains job title indicator
        has_job_title = any(indicator in line for indicator in job_indicators)
        
        # Also check for patterns like "Senior X", "Lead Y"
        seniority_pattern = r'^(Senior|Junior|Lead|Principal|Staff|Associate|Chief|Head)\s+\w+'
        has_seniority = re.match(seniority_pattern, line, re.IGNORECASE)
        
        if has_job_title or has_seniority:
            role = line.strip()
            
            # Look for company and dates in next 2-3 lines
            company = None
            dates = (None, None)
            responsibilities = []
            
            for j in range(i+1, min(i+4, end_idx)):
                next_line = lines[j].strip()
                
                # Check if it's a company line (often has | or – with dates)
                if not company and ('|' in next_line or '–' in next_line or '-' in next_line):
                    # Extract company (part before | or date)
                    company_match = re.match(r'^([^|–\-\d]+)', next_line)
                    if company_match:
                        company = company_match.group(1).strip()
                    
                    # Extract dates from this line
                    dates = extract_dates_from_line(next_line)
                
                # Check for bullet points (responsibilities)
                if re.match(r'^[-•●▪]', next_line):
                    resp = re.sub(r'^[-•●▪]\s*', '', next_line)
                    responsibilities.append(resp)
                
                # Stop if we hit another job title
                if j > i+1 and any(indicator in next_line for indicator in job_indicators):
                    break
            
            # If no explicit company found, check if next line after role is company
            if not company and i+1 < end_idx:
                potential_company = lines[i+1].strip()
                # Check if it's not a bullet point and not a section header
                if not re.match(r'^[-•●]', potential_company) and len(potential_company.split()) <= 10:
                    if not any(indicator in potential_company for indicator in job_indicators):
                        company = potential_company.split('|')[0].strip()
                        dates = extract_dates_from_line(potential_company)
            
            experience.append(schemas.ExperienceCreate(
                company=clean_text(company)[:200] if company else "Company",
                role=clean_text(role)[:200],
                start_date=dates[0] if dates[0] else "2022",
                end_date=dates[1] if dates[1] else "2024",
                responsibilities=' | '.join(responsibilities) if responsibilities else "Key responsibilities and achievements"
            ))
            
            i += 4  # Skip ahead
        else:
            i += 1
    
    # Fallback
    if not experience:
        experience.append(schemas.ExperienceCreate(
            company="Company",
            role="Professional",
            start_date="2022",
            end_date="2024",
            responsibilities="Professional experience"
        ))
    
    return experience

def extract_skills(text: str) -> List[schemas.SkillCreate]:
    """Extract skills with improved detection."""
    skills_set = set()
    
    # Comprehensive skill database
    technical_skills = {
        'languages': ['Python', 'JavaScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 
                     'Swift', 'Kotlin', 'TypeScript', 'R', 'MATLAB', 'Scala', 'Perl', 'Dart'],
        'frontend': ['React', 'React.js', 'Vue', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 
                    'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'jQuery', 'Redux', 'Webpack'],
        'backend': ['Django', 'Flask', 'FastAPI', 'Node.js', 'Express', 'Express.js', 'Spring', 
                   'Spring Boot', 'ASP.NET', 'Laravel', 'Rails', 'Nest.js'],
        'databases': ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 
                     'Oracle', 'Cassandra', 'DynamoDB', 'Firebase', 'Supabase'],
        'devops': ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'Git', 'GitHub',
                  'Jenkins', 'Terraform', 'Ansible', 'Linux', 'Nginx', 'Apache'],
        'data_ai': ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'TensorFlow',
                   'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Data Analysis'],
        'tools': ['REST API', 'GraphQL', 'Postman', 'Jira', 'Figma', 'Tableau', 'Power BI',
                 'Excel', 'VS Code', 'IntelliJ'],
        'soft': ['Communication', 'Leadership', 'Project Management', 'Agile', 'Scrum',
                'Problem Solving', 'Team Collaboration', 'Critical Thinking']
    }
    
    all_skills = []
    for category in technical_skills.values():
        all_skills.extend(category)
    
    # Method 1: Find skills section and parse it
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    skill_keywords = ['skills', 'technical skills', 'competencies', 'technologies', 'tools']
    start_idx, end_idx = find_section_boundaries(lines, skill_keywords)
    
    if start_idx != -1:
        skill_section = '\n'.join(lines[start_idx:end_idx])
        
        # Split by common delimiters
        delimiters = r'[,|•●▪\n]'
        potential_skills = re.split(delimiters, skill_section)
        
        for ps in potential_skills:
            ps = clean_text(ps)
            # Filter out section headers and very short/long items
            if 2 <= len(ps) <= 50 and not any(kw in ps.lower() for kw in skill_keywords):
                # Remove common prefixes
                ps = re.sub(r'^(and|or|including|such as|like)\s+', '', ps, flags=re.IGNORECASE)
                if ps:
                    skills_set.add(ps)
    
    # Method 2: Search entire document for known skills
    for skill in all_skills:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text, re.IGNORECASE):
            skills_set.add(skill)
    
    skills = [schemas.SkillCreate(name=skill) for skill in sorted(skills_set)]
    
    # Ensure minimum skills
    if not skills:
        skills = [
            schemas.SkillCreate(name='Communication'),
            schemas.SkillCreate(name='Problem Solving'),
        ]
    
    return skills[:50]  # Limit to top 50

def extract_projects(text: str) -> List[schemas.ProjectCreate]:
    """Extract projects with improved detection."""
    projects = []
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    project_keywords = ['projects', 'portfolio', 'personal projects']
    start_idx, end_idx = find_section_boundaries(lines, project_keywords)
    
    if start_idx == -1:
        return []
    
    i = start_idx
    current_project = None
    current_description = []
    current_tech = []
    
    while i < end_idx:
        line = lines[i].strip()
        
        # Check if this is a project title (usually bold or has certain patterns)
        # Project titles often end with year, status, or tech stack
        is_title = False
        
        # Pattern 1: Line with status like "In Progress", "Completed"
        if re.search(r'(In Progress|Completed|Ongoing|Active|Live|Deployed)$', line, re.IGNORECASE):
            is_title = True
            # Remove status from title
            project_name = re.sub(r'\s*[-–—|]\s*(In Progress|Completed|Ongoing|Active|Live|Deployed)\s*$', '', line, flags=re.IGNORECASE)
        
        # Pattern 2: Bullet point followed by substantial text
        elif re.match(r'^[-•●▪]', line) and len(line.split()) >= 3:
            is_title = True
            project_name = re.sub(r'^[-•●▪]\s*', '', line)
        
        # Pattern 3: Line that's not a bullet and seems like a heading (shorter, no periods)
        elif not line.startswith('-') and len(line.split()) <= 15 and not line.endswith('.'):
            # Check if next line is a bullet or description
            if i+1 < end_idx:
                next_line = lines[i+1].strip()
                if re.match(r'^[-•●▪]', next_line) or len(next_line) > 30:
                    is_title = True
                    project_name = line
        
        if is_title and current_project:
            # Save previous project
            description = ' '.join(current_description).strip()
            tech = ', '.join(current_tech) if current_tech else None
            
            if tech and not description:
                description = tech
            elif tech:
                description = f"{tech} – {description}"
            
            projects.append(schemas.ProjectCreate(
                project_name=clean_text(current_project)[:200],
                description=clean_text(description)[:500] if description else "Technical project",
                project_url=None
            ))
            
            current_project = None
            current_description = []
            current_tech = []
        
        if is_title:
            current_project = project_name
        elif current_project:
            # This is a description line
            clean_line = re.sub(r'^[-•●▪]\s*', '', line)
            
            # Check if it's a tech stack line (contains commas and tech terms)
            tech_terms = ['React', 'Node', 'Python', 'Java', 'JavaScript', 'TypeScript', 
                         'CSS', 'HTML', 'Django', 'Flask', 'MongoDB', 'SQL', 'AWS', 
                         'Docker', 'Kubernetes', 'Tailwind', 'Bootstrap', 'Vue', 'Angular']
            
            has_tech = any(term in clean_line for term in tech_terms)
            has_commas = ',' in clean_line
            
            if has_tech and has_commas and len(clean_line) < 150:
                current_tech.append(clean_line)
            else:
                current_description.append(clean_line)
        
        i += 1
    
    # Don't forget the last project
    if current_project:
        description = ' '.join(current_description).strip()
        tech = ', '.join(current_tech) if current_tech else None
        
        if tech and not description:
            description = tech
        elif tech:
            description = f"{tech} – {description}"
        
        projects.append(schemas.ProjectCreate(
            project_name=clean_text(current_project)[:200],
            description=clean_text(description)[:500] if description else "Technical project",
            project_url=None
        ))
    
    return projects[:10]  # Limit to 10 projects

def parse_resume(pdf_path: str) -> schemas.ResumeCreate:
    """
    Main function to parse a resume PDF and return a ResumeCreate schema.
    Enhanced with better extraction logic for various resume formats.
    """
    text = extract_text_from_pdf(pdf_path)
    
    # Extract all information
    full_name = extract_name(text)
    email = extract_email(text)
    phone = extract_phone(text)
    linkedin_url = extract_linkedin(text)
    
    education = extract_education(text)
    experience = extract_experience(text)
    skills = extract_skills(text)
    projects = extract_projects(text)
    
    return schemas.ResumeCreate(
        full_name=full_name,
        email=email,
        phone=phone,
        linkedin_url=linkedin_url,
        education=education,
        experience=experience,
        skills=skills,
        projects=projects,
        template_name="classic"
    )