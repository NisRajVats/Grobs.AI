import os
import json
import models
from datetime import datetime
from typing import Dict, List


CAREER_PROGRESSIONS = {
    'software_engineer': {
        'junior': {
            'titles': ['Junior Developer', 'Associate Software Engineer', 'Software Developer I'],
            'next_level': 'mid',
            'skills_to_develop': ['System Design', 'Code Review', 'Leadership', 'Architecture'],
            'typical_years': 2
        },
        'mid': {
            'titles': ['Software Engineer', 'Software Engineer II', 'Senior Developer'],
            'next_level': 'senior',
            'skills_to_develop': ['Technical Leadership', 'Mentoring', 'Strategic Thinking', 'Full-stack Mastery'],
            'typical_years': 3
        },
        'senior': {
            'titles': ['Senior Software Engineer', 'Staff Engineer', 'Principal Engineer'],
            'next_level': 'principal',
            'skills_to_develop': ['Architectural Vision', 'Strategic Planning', 'Team Leadership', 'Innovation'],
            'typical_years': 4
        }
    },
    'data_engineer': {
        'junior': {
            'titles': ['Junior Data Engineer', 'Associate Data Engineer'],
            'next_level': 'mid',
            'skills_to_develop': ['Data Warehousing', 'ETL Optimization', 'Big Data', 'Analytics'],
            'typical_years': 2
        },
        'mid': {
            'titles': ['Data Engineer', 'Senior Data Engineer'],
            'next_level': 'senior',
            'skills_to_develop': ['Data Architecture', 'Leadership', 'Cloud Platform Mastery', 'ML Pipelines'],
            'typical_years': 3
        }
    },
    'product_manager': {
        'junior': {
            'titles': ['Associate Product Manager', 'Assistant Product Manager'],
            'next_level': 'mid',
            'skills_to_develop': ['Product Strategy', 'User Research', 'Analytics', 'Stakeholder Management'],
            'typical_years': 2
        },
        'mid': {
            'titles': ['Product Manager', 'Senior Product Manager'],
            'next_level': 'senior',
            'skills_to_develop': ['Product Vision', 'Team Leadership', 'Market Strategy', 'Business Acumen'],
            'typical_years': 3
        }
    },
    'devops_engineer': {
        'junior': {
            'titles': ['Junior DevOps Engineer', 'Junior DevOps Specialist'],
            'next_level': 'mid',
            'skills_to_develop': ['Infrastructure as Code', 'Cloud Platforms', 'Monitoring', 'Security'],
            'typical_years': 2
        },
        'mid': {
            'titles': ['DevOps Engineer', 'Senior DevOps Engineer'],
            'next_level': 'senior',
            'skills_to_develop': ['Architecture Design', 'Leadership', 'Disaster Recovery', 'SRE Principles'],
            'typical_years': 3
        }
    }
}

LATERAL_MOVES = {
    'software_engineer': ['devops_engineer', 'data_engineer', 'product_manager', 'solution_architect'],
    'data_engineer': ['data_scientist', 'analytics_engineer', 'ml_engineer'],
    'product_manager': ['business_analyst', 'project_manager'],
    'devops_engineer': ['site_reliability_engineer', 'cloud_architect'],
}

EMERGING_SKILLS = [
    'AI/ML Integration',
    'Cloud Architecture',
    'Kubernetes',
    'GraphQL',
    'Serverless Architecture',
    'Microservices',
    'Data Engineering',
    'MLOps',
    'BlockChain',
    'Cybersecurity'
]


def analyze_career_path(resume: models.Resume) -> Dict:
    """
    Analyze resume and provide career path recommendations.
    """
    
    current_role = identify_current_role(resume)
    experience_level = calculate_experience_level(resume)
    current_skills = extract_skills(resume)
    skill_categories = categorize_skills(current_skills)
    
    next_progression = get_next_career_step(current_role, experience_level)
    lateral_moves = get_lateral_career_moves(current_role)
    skills_gap = identify_skill_gaps(current_role, experience_level, current_skills)
    industry_trends = get_relevant_industry_trends(current_role)
    
    return {
        'current_role': current_role,
        'experience_level': experience_level,
        'current_skills': current_skills,
        'skill_categories': skill_categories,
        'next_career_step': next_progression,
        'lateral_moves': lateral_moves,
        'skills_to_develop': skills_gap['skills_to_develop'],
        'skill_gaps': skills_gap['gaps'],
        'estimated_timeline': skills_gap['timeline'],
        'industry_trends': industry_trends,
        'recommendations': generate_career_recommendations(
            current_role, experience_level, skills_gap, industry_trends
        )
    }


def identify_current_role(resume: models.Resume) -> str:
    """Identify the person's current/primary role from experience and title."""
    
    if not resume.experience:
        return 'general'
    
    role_keywords = {
        'software_engineer': ['software', 'engineer', 'developer', 'programmer', 'architect'],
        'data_engineer': ['data engineer', 'data pipeline', 'etl', 'warehouse'],
        'product_manager': ['product manager', 'product manager'],
        'devops_engineer': ['devops', 'devops engineer', 'sre', 'infrastructure'],
        'analyst': ['analyst', 'business analyst'],
    }
    
    recent_roles = [exp.role.lower() for exp in resume.experience[:3]]
    all_role_text = ' '.join(recent_roles)
    
    scores = {}
    for role_type, keywords in role_keywords.items():
        score = sum(1 for keyword in keywords if keyword in all_role_text)
        scores[role_type] = score
    
    if scores and max(scores.values()) > 0:
        return max(scores, key=scores.get)
    
    return 'general'


def calculate_experience_level(resume: models.Resume) -> str:
    """Determine if person is junior, mid, or senior level."""
    
    if not resume.experience:
        return 'junior'
    
    total_years = 0
    for exp in resume.experience:
        try:
            start = int(exp.start_date) if exp.start_date else 2020
            end = int(exp.end_date) if exp.end_date else 2024
            total_years += (end - start)
        except:
            pass
    
    total_years = max(1, total_years)
    
    if total_years < 2:
        return 'junior'
    elif total_years < 5:
        return 'mid'
    else:
        return 'senior'


def extract_skills(resume: models.Resume) -> List[str]:
    """Extract all skills from resume."""
    return [skill.name for skill in resume.skills]


def categorize_skills(skills: List[str]) -> Dict[str, List[str]]:
    """Categorize skills by type."""
    
    technical_skills = {
        'languages': ['Python', 'Java', 'JavaScript', 'C++', 'Go', 'Rust', 'TypeScript'],
        'frontend': ['React', 'Vue', 'Angular', 'HTML', 'CSS', 'Tailwind'],
        'backend': ['Django', 'FastAPI', 'Node.js', 'Spring', 'ASP.NET'],
        'data': ['SQL', 'MongoDB', 'PostgreSQL', 'Pandas', 'NumPy', 'Spark'],
        'devops': ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform'],
        'ai_ml': ['Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP'],
    }
    
    categorized = {category: [] for category in technical_skills}
    categorized['soft_skills'] = []
    
    soft_skill_keywords = ['leadership', 'communication', 'team', 'management', 'agile', 'scrum']
    
    for skill in skills:
        found = False
        for category, keywords in technical_skills.items():
            if any(keyword.lower() in skill.lower() for keyword in keywords):
                categorized[category].append(skill)
                found = True
                break
        
        if not found:
            if any(soft_word in skill.lower() for soft_word in soft_skill_keywords):
                categorized['soft_skills'].append(skill)
            else:
                categorized['soft_skills'].append(skill)
    
    return {k: v for k, v in categorized.items() if v}


def get_next_career_step(current_role: str, experience_level: str) -> Dict:
    """Get the next logical career progression."""
    
    if current_role not in CAREER_PROGRESSIONS:
        return {
            'title': f"Senior {current_role.replace('_', ' ').title()}",
            'description': 'Continue deepening expertise in your current domain',
            'typical_years': 2,
            'key_competencies': ['Leadership', 'Mentoring', 'Strategic Thinking']
        }
    
    progression = CAREER_PROGRESSIONS[current_role]
    
    if experience_level not in progression:
        experience_level = 'mid'
    
    current_level = progression[experience_level]
    
    return {
        'title': current_level['titles'][0],
        'next_level': current_level['next_level'],
        'key_competencies': current_level['skills_to_develop'],
        'typical_years_to_next': current_level['typical_years'],
        'description': f"Progress to the {current_level['next_level']} level by developing: {', '.join(current_level['skills_to_develop'][:2])}"
    }


def get_lateral_career_moves(current_role: str) -> List[Dict]:
    """Suggest lateral career moves (different but related roles)."""
    
    moves = []
    if current_role in LATERAL_MOVES:
        for lateral_role in LATERAL_MOVES[current_role][:3]:
            moves.append({
                'role': lateral_role.replace('_', ' ').title(),
                'description': f"Transition to {lateral_role.replace('_', ' ')} while leveraging your current experience",
                'skills_to_focus': ['New domain knowledge', 'Skill diversification']
            })
    
    return moves


def identify_skill_gaps(current_role: str, experience_level: str, current_skills: List[str]) -> Dict:
    """Identify skill gaps for progression."""
    
    gaps = []
    skills_to_develop = []
    
    if current_role in CAREER_PROGRESSIONS and experience_level in CAREER_PROGRESSIONS[current_role]:
        skills_to_develop = CAREER_PROGRESSIONS[current_role][experience_level]['skills_to_develop']
    
    current_skills_lower = [s.lower() for s in current_skills]
    
    for skill in skills_to_develop:
        if not any(s in skill.lower() or skill.lower() in s for s in current_skills_lower):
            gaps.append(skill)
    
    trending_skills = [s for s in EMERGING_SKILLS if not any(s.lower() in cs.lower() for cs in current_skills_lower)][:3]
    
    return {
        'skills_to_develop': skills_to_develop,
        'gaps': gaps[:5],
        'trending_skills': trending_skills,
        'timeline': f"{len(gaps)} to 12 months to close major gaps"
    }


def get_relevant_industry_trends(current_role: str) -> List[str]:
    """Get relevant industry trends for the current role."""
    
    trends = {
        'software_engineer': [
            'AI/ML integration in applications',
            'Serverless and edge computing adoption',
            'Full-stack development expectations',
            'Security-first development (DevSecOps)',
            'Quantum computing preparation'
        ],
        'data_engineer': [
            'Real-time data processing',
            'Data mesh architecture',
            'DataOps practices',
            'Privacy-preserving analytics',
            'AI/ML pipeline automation'
        ],
        'devops_engineer': [
            'Platform engineering and internal developer platforms',
            'GitOps and infrastructure as code evolution',
            'Observability and AIOps',
            'Serverless infrastructure',
            'Multi-cloud strategy'
        ],
        'product_manager': [
            'AI-powered product features',
            'Data-driven product decisions',
            'User-centric design philosophy',
            'Subscription and retention models',
            'Global product considerations'
        ]
    }
    
    return trends.get(current_role, [
        'Digital transformation',
        'Cloud adoption',
        'Automation and efficiency',
        'Security and compliance',
        'Team collaboration tools'
    ])


def generate_career_recommendations(
    current_role: str, 
    experience_level: str, 
    skills_gap: Dict,
    industry_trends: List[str]
) -> List[str]:
    """Generate actionable career recommendations."""
    
    recommendations = []
    
    if experience_level == 'junior':
        recommendations.append("🎯 Focus on building strong fundamentals and mastering your current tech stack")
        recommendations.append("🎯 Seek mentorship from senior team members to accelerate growth")
    elif experience_level == 'mid':
        recommendations.append("🎯 Develop leadership and communication skills for next-level roles")
        recommendations.append("🎯 Take on higher-impact projects and mentor junior team members")
    else:
        recommendations.append("🎯 Consider transitioning to leadership/architecture roles")
        recommendations.append("🎯 Build strategic vision and influence across the organization")
    
    if skills_gap['gaps']:
        recommendations.append(f"📚 Priority skill gaps: {', '.join(skills_gap['gaps'][:2])}")
    
    if industry_trends:
        recommendations.append(f"🔮 Industry trend to watch: {industry_trends[0]}")
    
    recommendations.append("💡 Build a learning plan for the next 12 months with clear milestones")
    recommendations.append("🤝 Network with professionals in your target role/industry")
    
    return recommendations
