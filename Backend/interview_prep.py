import os
import json
import re
import google.generativeai as genai
from dotenv import load_dotenv
import models
from typing import Dict, List

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)
    model_name = 'gemini-2.5-flash'
else:
    model_name = None


BEHAVIORAL_QUESTIONS = [
    "Tell me about a time when you had to work with a difficult team member. How did you handle it?",
    "Describe a situation where you failed. What did you learn from it?",
    "Tell me about your proudest professional achievement.",
    "How do you handle tight deadlines and pressure?",
    "Describe a time when you had to learn something new quickly.",
    "Tell me about a time when you had to take initiative.",
    "How do you handle constructive criticism?",
    "Tell me about a time when you had to adapt your approach.",
]

TECHNICAL_QUESTION_TEMPLATES = {
    'software_engineer': [
        "Explain how {technology} works and when you would use it.",
        "Design a system for {system_type}. What are the key considerations?",
        "Walk me through your approach to debugging {issue_type}.",
        "How would you optimize {component} for performance?",
    ],
    'data_engineer': [
        "How would you design a data pipeline for {use_case}?",
        "Explain the difference between {concept1} and {concept2} in the context of {domain}.",
        "How would you ensure data quality in {scenario}?",
        "Design a solution for {data_problem}.",
    ],
    'product_manager': [
        "How would you approach building a feature for {user_type}?",
        "Walk me through your product strategy for {product_area}.",
        "How would you measure success for {feature}?",
        "Describe how you would handle {product_challenge}.",
    ],
    'devops_engineer': [
        "How would you set up CI/CD for {application_type}?",
        "Explain your approach to {infrastructure_concern}.",
        "How would you handle {scaling_scenario}?",
        "Design a disaster recovery plan for {system}.",
    ]
}

ROLE_SPECIFIC_QUESTIONS = {
    'software_engineer': [
        "What's your approach to writing clean, maintainable code?",
        "How do you approach system design?",
        "Tell me about your experience with code reviews.",
        "How do you stay updated with new technologies?",
        "What's your approach to testing?",
    ],
    'data_engineer': [
        "How do you ensure data pipeline reliability?",
        "What's your experience with big data technologies?",
        "How do you approach data modeling?",
        "Tell me about your ETL optimization experience.",
        "How do you handle data governance?",
    ],
    'product_manager': [
        "What's your product development process?",
        "How do you prioritize features?",
        "Tell me about your experience with user research.",
        "How do you measure product metrics?",
        "What's your approach to competitive analysis?",
    ],
    'devops_engineer': [
        "What's your approach to infrastructure as code?",
        "Tell me about your monitoring and logging strategy.",
        "How do you approach incident management?",
        "What's your experience with container orchestration?",
        "How do you ensure system reliability?",
    ]
}


def generate_interview_questions(resume: models.Resume, job_description: str = "") -> Dict:
    """
    Generate customized interview questions based on resume content.
    """
    
    current_role = identify_role_from_resume(resume)
    technologies = extract_technologies(resume)
    projects_summary = summarize_projects(resume)
    experience_summary = summarize_experience(resume)
    
    behavioral_questions = select_behavioral_questions(resume)
    technical_questions = generate_technical_questions(current_role, technologies, projects_summary)
    role_specific_questions = generate_role_specific_questions(current_role, resume)
    
    if model_name and job_description:
        ai_questions = generate_ai_questions(resume, job_description)
    else:
        ai_questions = []
    
    return {
        'role': current_role,
        'technologies': technologies[:10],
        'interview_structure': {
            'behavioral_questions': behavioral_questions,
            'technical_questions': technical_questions,
            'role_specific_questions': role_specific_questions,
            'job_specific_questions': ai_questions,
        },
        'preparation_tips': generate_preparation_tips(current_role, resume),
        'estimated_duration': estimate_interview_duration(behavioral_questions, technical_questions, role_specific_questions),
    }


def identify_role_from_resume(resume: models.Resume) -> str:
    """Identify the role type from resume experience."""
    
    if not resume.experience:
        return 'general'
    
    role_keywords = {
        'software_engineer': ['engineer', 'developer', 'programmer', 'architect'],
        'data_engineer': ['data engineer', 'data', 'etl', 'pipeline', 'warehouse'],
        'product_manager': ['product', 'manager'],
        'devops_engineer': ['devops', 'infrastructure', 'sre', 'cloud'],
    }
    
    recent_roles = ' '.join([exp.role.lower() for exp in resume.experience[:3]])
    
    scores = {}
    for role_type, keywords in role_keywords.items():
        score = sum(1 for keyword in keywords if keyword in recent_roles)
        scores[role_type] = score
    
    if scores and max(scores.values()) > 0:
        return max(scores, key=scores.get)
    
    return 'general'


def extract_technologies(resume: models.Resume) -> List[str]:
    """Extract all technologies/tools mentioned in resume."""
    
    tech_keywords = [
        'Python', 'Java', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'C++', 'C#',
        'React', 'Vue', 'Angular', 'Node.js', 'Django', 'FastAPI', 'Spring', 'Express',
        'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
        'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes',
        'Git', 'Jenkins', 'Terraform', 'Ansible',
        'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'Numpy'
    ]
    
    all_text = ' '.join([
        ' '.join([skill.name for skill in resume.skills]),
        ' '.join([exp.description for exp in resume.experience]),
        ' '.join([proj.description for proj in resume.projects]),
    ])
    
    found_tech = []
    for tech in tech_keywords:
        if tech.lower() in all_text.lower():
            found_tech.append(tech)
    
    return found_tech


def summarize_projects(resume: models.Resume) -> str:
    """Create a summary of notable projects."""
    
    if not resume.projects:
        return "No specific projects mentioned"
    
    project_summaries = []
    for proj in resume.projects[:3]:
        summary = f"{proj.project_name}: {proj.description}"
        project_summaries.append(summary)
    
    return " | ".join(project_summaries)


def summarize_experience(resume: models.Resume) -> str:
    """Create a summary of experience."""
    
    if not resume.experience:
        return "Limited experience"
    
    latest_role = resume.experience[0]
    total_years = sum(
        int(exp.end_date or '2024') - int(exp.start_date or '2020')
        for exp in resume.experience
    )
    
    return f"{latest_role.role} at {latest_role.company} with ~{max(total_years, 1)} years experience"


def select_behavioral_questions(resume: models.Resume) -> List[Dict]:
    """Select and customize behavioral questions."""
    
    selected = []
    for i, question in enumerate(BEHAVIORAL_QUESTIONS[:5]):
        selected.append({
            'question': question,
            'tips': get_behavioral_tips(i),
            'sample_structure': 'Use STAR method: Situation, Task, Action, Result'
        })
    
    return selected


def get_behavioral_tips(question_index: int) -> str:
    """Get tips for answering behavioral questions."""
    
    tips = {
        0: "Focus on communication and conflict resolution skills",
        1: "Show growth mindset and learning from mistakes",
        2: "Highlight technical and leadership achievements",
        3: "Demonstrate stress management and prioritization",
        4: "Show adaptability and learning agility",
    }
    
    return tips.get(question_index, "Use specific examples from your experience")


def generate_technical_questions(current_role: str, technologies: List[str], projects: str) -> List[Dict]:
    """Generate technical questions based on role and technologies."""
    
    questions = []
    
    if current_role not in TECHNICAL_QUESTION_TEMPLATES:
        current_role = 'software_engineer'
    
    templates = TECHNICAL_QUESTION_TEMPLATES.get(current_role, [])
    
    tech_to_use = technologies[:2] if technologies else ['REST APIs', 'Databases']
    
    example_mappings = {
        'software_engineer': {
            'technology': tech_to_use[0] if tech_to_use else 'REST APIs',
            'system_type': 'real-time notification system',
            'issue_type': 'memory leaks',
            'component': 'database queries'
        },
        'data_engineer': {
            'use_case': 'real-time user analytics',
            'concept1': 'batch processing',
            'concept2': 'stream processing',
            'domain': 'data engineering',
            'scenario': 'downstream pipeline failures',
            'data_problem': 'deduplicating large datasets'
        }
    }
    
    mappings = example_mappings.get(current_role, {})
    
    for template in templates[:3]:
        question_text = template
        for key, value in mappings.items():
            question_text = question_text.replace('{' + key + '}', value)
        
        questions.append({
            'question': question_text,
            'focus_areas': get_technical_focus_areas(current_role),
            'follow_up': 'How would you handle scalability concerns?'
        })
    
    return questions


def get_technical_focus_areas(role: str) -> List[str]:
    """Get key technical focus areas for a role."""
    
    focus = {
        'software_engineer': ['Architecture', 'Scalability', 'Performance', 'Code Quality'],
        'data_engineer': ['Data Quality', 'Pipeline Reliability', 'Optimization', 'Scalability'],
        'product_manager': ['User Impact', 'Business Value', 'Metrics', 'Tradeoffs'],
        'devops_engineer': ['Reliability', 'Performance', 'Security', 'Automation'],
    }
    
    return focus.get(role, ['Technical Excellence', 'Problem Solving', 'System Design'])


def generate_role_specific_questions(current_role: str, resume: models.Resume) -> List[Dict]:
    """Generate questions specific to the role."""
    
    questions = []
    
    role_questions = ROLE_SPECIFIC_QUESTIONS.get(current_role, ROLE_SPECIFIC_QUESTIONS['software_engineer'])
    
    for question in role_questions[:4]:
        questions.append({
            'question': question,
            'context': f"Based on your experience in {resume.experience[0].role if resume.experience else 'your field'}",
            'suggested_points': get_suggested_talking_points(current_role, question)
        })
    
    return questions


def get_suggested_talking_points(role: str, question: str) -> List[str]:
    """Get suggested talking points for a question."""
    
    return [
        "Share a specific example from your experience",
        "Explain your methodology or approach",
        "Highlight key results or learnings",
        "Connect to the role you're interviewing for"
    ]


def generate_ai_questions(resume: models.Resume, job_description: str) -> List[Dict]:
    """Generate AI-powered questions using Gemini API."""
    
    if not model_name:
        return []
    
    try:
        resume_summary = f"""
RESUME SUMMARY:
- Name: {resume.full_name}
- Current Role: {resume.experience[0].role if resume.experience else 'N/A'}
- Key Skills: {', '.join([s.name for s in resume.skills[:5]])}
- Experience: {resume.experience[0].company if resume.experience else 'N/A'}
        """
        
        prompt = f"""Based on this resume and job description, generate 3 specific interview questions that:
1. Are tailored to the candidate's experience
2. Test technical depth relevant to the job
3. Allow the candidate to demonstrate their strengths

{resume_summary}

JOB DESCRIPTION:
{job_description}

Return a JSON array with 3 objects, each containing:
- question: (string)
- why_important: (string explaining why this question matters)
- sample_answer_points: (array of 3-4 key points)

Return ONLY valid JSON, no markdown."""
        
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        json_text = response_text
        
        if '```' in response_text:
            json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', response_text)
            if json_match:
                json_text = json_match.group(1).strip()
        
        if not json_text.startswith('['):
            json_match = re.search(r'\[[\s\S]*\]', json_text)
            if json_match:
                json_text = json_match.group(0)
        
        result = json.loads(json_text)
        
        return result if isinstance(result, list) else []
        
    except json.JSONDecodeError as e:
        print(f"JSON parsing error in interview prep: {e}")
        return []
    except Exception as e:
        print(f"Error generating AI questions: {e}")
        return []


def generate_preparation_tips(current_role: str, resume: models.Resume) -> List[str]:
    """Generate interview preparation tips."""
    
    tips = [
        "✓ Review your projects and be ready to explain technical decisions",
        "✓ Practice the STAR method (Situation, Task, Action, Result) for behavioral questions",
        "✓ Research the company's tech stack and products",
        "✓ Prepare 2-3 questions to ask your interviewer",
        "✓ Mock interview with a peer or mentor",
    ]
    
    if current_role == 'software_engineer':
        tips.extend([
            "✓ Review common algorithms and data structures",
            "✓ Be ready to code and explain your approach",
        ])
    elif current_role == 'data_engineer':
        tips.extend([
            "✓ Be prepared to discuss database design",
            "✓ Understand scalability and performance trade-offs",
        ])
    elif current_role == 'product_manager':
        tips.extend([
            "✓ Know the company's product roadmap",
            "✓ Be ready to discuss metrics and success criteria",
        ])
    
    tips.append("✓ Get a good night's sleep before the interview")
    
    return tips


def estimate_interview_duration(behavioral: List, technical: List, role_specific: List) -> str:
    """Estimate total interview duration."""
    
    behavioral_time = len(behavioral) * 5
    technical_time = len(technical) * 7
    role_time = len(role_specific) * 6
    buffer = 10
    
    total = behavioral_time + technical_time + role_time + buffer
    
    return f"Estimated {total}-{total + 10} minutes"
