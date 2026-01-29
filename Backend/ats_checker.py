import re
from typing import Dict, List
import models


def calculate_ats_score(resume: models.Resume, job_description: str = "") -> Dict:
    """
    Analyzes a resume for ATS compatibility and returns a detailed score.
    """
    
    resume_text = f"""
NAME: {resume.full_name}
EMAIL: {resume.email}
PHONE: {resume.phone or 'N/A'}
LINKEDIN: {resume.linkedin_url or 'N/A'}

EDUCATION:
{chr(10).join([f"- {edu.degree} from {edu.school}" for edu in resume.education]) or 'N/A'}

EXPERIENCE:
{chr(10).join([f"- {exp.role} at {exp.company}: {exp.description}" for exp in resume.experience]) or 'N/A'}

PROJECTS:
{chr(10).join([f"- {proj.project_name}: {proj.description}" for proj in resume.projects]) or 'N/A'}

SKILLS:
{', '.join([skill.name for skill in resume.skills]) or 'N/A'}
    """
    
    scores = {}
    issues = []
    
    scores['contact_info'] = check_contact_info(resume)
    scores['formatting'] = check_formatting_compatibility(resume_text)
    scores['keyword_optimization'] = check_keyword_optimization(resume_text)
    scores['structure'] = check_resume_structure(resume)
    scores['readability'] = check_ats_readability(resume_text)
    
    if job_description:
        scores['job_match'] = check_job_description_match(resume_text, job_description)
    else:
        scores['job_match'] = 0
    
    issues = identify_ats_issues(resume, resume_text)
    
    overall_score = int((
        scores['contact_info'] * 0.15 +
        scores['formatting'] * 0.20 +
        scores['keyword_optimization'] * 0.25 +
        scores['structure'] * 0.15 +
        scores['readability'] * 0.15 +
        scores.get('job_match', 0) * 0.10
    ))
    
    return {
        'overall_score': overall_score,
        'category_scores': scores,
        'issues': issues,
        'recommendations': generate_ats_recommendations(issues, scores)
    }


def check_contact_info(resume: models.Resume) -> int:
    """Check if contact information is complete and properly formatted (0-100)."""
    score = 0
    max_points = 100
    
    if resume.email and '@' in resume.email:
        score += 30
    
    if resume.phone and len(resume.phone) >= 10:
        score += 30
    
    if resume.linkedin_url and 'linkedin' in resume.linkedin_url.lower():
        score += 20
    
    if resume.full_name and len(resume.full_name.split()) >= 2:
        score += 20
    
    return min(score, max_points)


def check_formatting_compatibility(text: str) -> int:
    """
    Check for ATS-unfriendly formatting elements.
    Returns score 0-100 (higher is better for ATS).
    """
    score = 100
    
    problematic_patterns = [
        (r'[^\x00-\x7F]', 2, "Special Unicode characters that may not parse correctly"),
        (r'\b[A-Z]{2,}\b.*\b[A-Z]{2,}\b', 3, "Multiple all-caps abbreviations"),
        (r'[|◆●■►]', 2, "Special characters instead of standard bullets"),
        (r'http[s]?://[^\s]+', 1, "URLs (some ATS systems prefer plain text)"),
    ]
    
    for pattern, penalty, _ in problematic_patterns:
        matches = len(re.findall(pattern, text))
        score -= matches * penalty
    
    return max(score, 0)


def check_keyword_optimization(text: str) -> int:
    """
    Check for presence of high-value technical keywords (0-100).
    """
    score = 0
    
    high_value_keywords = {
        'technical_skills': ['Python', 'Java', 'JavaScript', 'SQL', 'AWS', 'Docker', 
                            'React', 'Node.js', 'API', 'Database', 'Cloud', 'API',
                            'Machine Learning', 'Data Analysis', 'Agile'],
        'soft_skills': ['Leadership', 'Communication', 'Project Management', 'Problem Solving',
                       'Team Collaboration', 'Critical Thinking'],
        'metrics_indicators': ['increased', 'improved', 'reduced', 'achieved', 'delivered',
                             'percentage', '%', 'revenue', 'efficiency', 'growth']
    }
    
    total_keywords = sum(len(v) for v in high_value_keywords.values())
    found_keywords = 0
    
    for category, keywords in high_value_keywords.items():
        for keyword in keywords:
            if re.search(r'\b' + re.escape(keyword) + r'\b', text, re.IGNORECASE):
                found_keywords += 1
    
    score = int((found_keywords / total_keywords) * 100)
    return min(score, 100)


def check_resume_structure(resume: models.Resume) -> int:
    """Check if resume has proper sections (0-100)."""
    score = 0
    
    if resume.full_name:
        score += 20
    if resume.email or resume.phone:
        score += 15
    if len(resume.education) > 0:
        score += 20
    if len(resume.experience) > 0:
        score += 25
    if len(resume.skills) > 0:
        score += 20
    
    return min(score, 100)


def check_ats_readability(text: str) -> int:
    """
    Check if resume is ATS-readable (plain text compatibility, no complex formatting).
    """
    score = 100
    
    lines = text.split('\n')
    
    empty_lines = sum(1 for line in lines if not line.strip())
    if len(lines) > 0:
        empty_line_ratio = empty_lines / len(lines)
        if empty_line_ratio > 0.3:
            score -= 10
    
    average_line_length = sum(len(line) for line in lines) / len(lines) if lines else 0
    if average_line_length > 120:
        score -= 5
    
    words_count = len(text.split())
    if words_count < 100:
        score -= 15
    elif words_count > 1000:
        score -= 5
    
    return max(score, 0)


def check_job_description_match(resume_text: str, job_description: str) -> int:
    """
    Compare resume keywords with job description keywords (0-100).
    """
    job_words = set(re.findall(r'\b[a-z]{3,}\b', job_description.lower()))
    resume_words = set(re.findall(r'\b[a-z]{3,}\b', resume_text.lower()))
    
    if not job_words:
        return 0
    
    matched_words = len(job_words.intersection(resume_words))
    match_percentage = (matched_words / len(job_words)) * 100
    
    return min(int(match_percentage), 100)


def identify_ats_issues(resume: models.Resume, resume_text: str) -> List[str]:
    """Identify specific ATS compatibility issues."""
    issues = []
    
    if not resume.email:
        issues.append("Missing email address - ATS systems need this")
    
    if not resume.phone:
        issues.append("Missing phone number - reduces ATS matching")
    
    if len(resume.education) == 0:
        issues.append("No education section found - ATS expects this")
    
    if len(resume.experience) == 0:
        issues.append("No work experience found - critical for ATS parsing")
    
    if len(resume.skills) < 5:
        issues.append("Less than 5 skills listed - may reduce keyword matching")
    
    if len(resume.full_name.split()) < 2:
        issues.append("Name might be incomplete or unclear")
    
    special_chars = len(re.findall(r'[^\x00-\x7F]', resume_text))
    if special_chars > 5:
        issues.append(f"Contains {special_chars} special characters that may not parse correctly")
    
    if not any(date for edu in resume.education for date in [edu.start_date, edu.end_date]):
        issues.append("Education dates missing - important for ATS timeline")
    
    if not any(date for exp in resume.experience for date in [exp.start_date, exp.end_date]):
        issues.append("Work experience dates missing - critical for ATS parsing")
    
    responsibility_count = sum(1 for exp in resume.experience if exp.description)
    if responsibility_count == 0:
        issues.append("No job descriptions/achievements - reduces impact and ATS matching")
    
    if len(resume_text) < 500:
        issues.append("Resume is very short - consider adding more details for better ATS matching")
    
    return issues


def generate_ats_recommendations(issues: List[str], scores: Dict) -> List[str]:
    """Generate actionable recommendations based on issues and scores."""
    recommendations = []
    
    if scores['contact_info'] < 80:
        recommendations.append("✓ Ensure all contact information is complete and clearly formatted")
    
    if scores['formatting'] < 80:
        recommendations.append("✓ Remove special characters and use standard formatting (bullets, hyphens)")
    
    if scores['keyword_optimization'] < 70:
        recommendations.append("✓ Add more relevant technical keywords from your industry/job title")
    
    if scores['structure'] < 80:
        recommendations.append("✓ Organize content into clear sections: Contact Info, Education, Experience, Skills")
    
    if scores['readability'] < 80:
        recommendations.append("✓ Keep resume concise (500-1000 words) with consistent formatting")
    
    for issue in issues[:3]:
        recommendations.append(f"⚠ {issue}")
    
    recommendations.append("✓ Save and submit as PDF to preserve formatting during ATS parsing")
    
    return recommendations
