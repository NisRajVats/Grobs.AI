import os
import json
import re
import google.generativeai as genai
from dotenv import load_dotenv
import models
from typing import Dict
from datetime import datetime

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)
    model_name = 'gemini-2.5-flash'
else:
    model_name = None


def generate_cover_letter(
    resume: models.Resume,
    job_description: str,
    company_name: str = "",
    position_title: str = ""
) -> Dict:
    """
    Generate a tailored cover letter using Gemini API.
    """
    
    if not model_name:
        return {
            'success': False,
            'error': 'Gemini API key not configured',
            'cover_letter': generate_fallback_cover_letter(resume, job_description, company_name, position_title)
        }
    
    resume_summary = build_resume_summary(resume)
    key_experiences = extract_key_experiences(resume)
    key_skills = extract_key_skills(resume, job_description)
    
    prompt = build_cover_letter_prompt(
        resume_summary, key_experiences, key_skills,
        job_description, company_name, position_title
    )
    
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        cover_letter_text = response.text.strip()
        
        cover_letter_html = format_cover_letter_html(cover_letter_text, company_name)
        
        return {
            'success': True,
            'cover_letter': cover_letter_text,
            'cover_letter_html': cover_letter_html,
            'metadata': {
                'generated_date': datetime.now().isoformat(),
                'company': company_name or 'Target Company',
                'position': position_title or 'Position',
                'candidate_name': resume.full_name
            }
        }
        
    except Exception as e:
        print(f"Error generating cover letter: {e}")
        return {
            'success': False,
            'error': str(e),
            'cover_letter': generate_fallback_cover_letter(resume, job_description, company_name, position_title)
        }


def build_resume_summary(resume: models.Resume) -> str:
    """Build a concise summary of the candidate's resume."""
    
    education_str = ""
    if resume.education:
        latest_edu = resume.education[-1]
        education_str = f"{latest_edu.degree} from {latest_edu.school}"
    
    experience_str = ""
    if resume.experience:
        experiences = []
        for exp in resume.experience[:3]:
            experiences.append(f"{exp.role} at {exp.company}")
        experience_str = " | ".join(experiences)
    
    skills_str = ""
    if resume.skills:
        skills_str = ", ".join([s.name for s in resume.skills[:8]])
    
    return f"""
Candidate: {resume.full_name}
Education: {education_str or 'Not specified'}
Experience: {experience_str or 'Not specified'}
Key Skills: {skills_str or 'Not specified'}
Contact: {resume.email or 'Not provided'}
    """


def extract_key_experiences(resume: models.Resume) -> str:
    """Extract and summarize key experiences."""
    
    if not resume.experience:
        return "Limited professional experience"
    
    experiences = []
    for exp in resume.experience[:3]:
        exp_summary = f"""
- Position: {exp.role}
- Company: {exp.company}
- Duration: {exp.start_date} to {exp.end_date}
- Key Achievements: {exp.description[:150]}...
        """
        experiences.append(exp_summary)
    
    return "\n".join(experiences)


def extract_key_skills(resume: models.Resume, job_description: str) -> str:
    """Extract skills relevant to the job description."""
    
    job_words = set(job_description.lower().split())
    relevant_skills = []
    
    for skill in resume.skills:
        skill_lower = skill.name.lower()
        if any(word in job_words for word in skill_lower.split()):
            relevant_skills.append(skill.name)
    
    if not relevant_skills:
        relevant_skills = [s.name for s in resume.skills[:5]]
    
    return ", ".join(relevant_skills[:10])


def build_cover_letter_prompt(
    resume_summary: str,
    key_experiences: str,
    key_skills: str,
    job_description: str,
    company_name: str,
    position_title: str
) -> str:
    """Build the prompt for cover letter generation."""
    
    company_context = f"for {company_name}" if company_name else ""
    position_context = f"for the position of {position_title}" if position_title else ""
    
    prompt = f"""Generate a professional, compelling cover letter {company_context} {position_context}.

CANDIDATE PROFILE:
{resume_summary}

KEY EXPERIENCES:
{key_experiences}

RELEVANT SKILLS:
{key_skills}

JOB DESCRIPTION:
{job_description}

REQUIREMENTS FOR THE COVER LETTER:
1. Write in a professional yet personable tone
2. Keep it to 3-4 paragraphs (approximately 250-300 words)
3. Highlight 2-3 most relevant experiences that match the job requirements
4. Show genuine interest in the company and role
5. Connect the candidate's skills to the job requirements
6. Include a strong closing with call to action
7. Format as a ready-to-send letter (with date, recipient, and professional closing)
8. Make it specific to the job description provided
9. Use "I" statements and show personality
10. Avoid generic phrases and clichés

Generate ONLY the cover letter text, no additional commentary or explanations."""
    
    return prompt


def generate_fallback_cover_letter(
    resume: models.Resume,
    job_description: str,
    company_name: str,
    position_title: str
) -> str:
    """Generate a basic cover letter when AI API is not available."""
    
    date_str = datetime.now().strftime("%B %d, %Y")
    company = company_name or "Hiring Manager"
    position = position_title or "the position"
    
    # Extract key points from resume
    latest_role = resume.experience[0].role if resume.experience else "Professional"
    latest_company = resume.experience[0].company if resume.experience else ""
    
    key_achievement = ""
    if resume.experience and resume.experience[0].description:
        key_achievement = resume.experience[0].description[:100]
    
    relevant_skills = ", ".join([s.name for s in resume.skills[:5]]) if resume.skills else "technical skills"
    
    cover_letter = f"""{date_str}

{company}
Hiring Team

Dear Hiring Manager,

I am writing to express my strong interest in {position} at {company}. With my background as a {latest_role} at {latest_company}, I am confident in my ability to contribute meaningfully to your team.

In my current role, I have demonstrated expertise in {relevant_skills}. {key_achievement} My experience has equipped me with a strong foundation in problem-solving and collaboration, which I believe aligns perfectly with the requirements outlined in the job description.

I am particularly drawn to {company} because of your commitment to innovation and excellence. The opportunity to contribute to {position} excites me, and I am confident that my skills and experience make me an excellent fit for this role.

Thank you for considering my application. I would welcome the opportunity to discuss how I can contribute to your team. Please feel free to contact me at {resume.email or 'your contact'} at your earliest convenience.

Sincerely,

{resume.full_name}
"""
    
    return cover_letter


def format_cover_letter_html(cover_letter_text: str, company_name: str = "") -> str:
    """Format cover letter as HTML for web display."""
    
    paragraphs = cover_letter_text.split('\n\n')
    
    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{
            font-family: 'Calibri', 'Arial', sans-serif;
            line-height: 1.5;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            color: #333;
        }}
        .letter {{
            background: white;
            border: 1px solid #ddd;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .date {{
            margin-bottom: 20px;
            font-size: 14px;
        }}
        .recipient {{
            margin-bottom: 20px;
            font-size: 14px;
        }}
        .greeting {{
            margin-bottom: 20px;
        }}
        .body-paragraph {{
            text-align: justify;
            margin-bottom: 15px;
        }}
        .closing {{
            margin-top: 20px;
        }}
        .signature {{
            margin-top: 40px;
        }}
        @media print {{
            body {{
                padding: 0;
            }}
            .letter {{
                border: none;
                box-shadow: none;
            }}
        }}
    </style>
</head>
<body>
    <div class="letter">
"""
    
    for i, para in enumerate(paragraphs):
        para = para.strip()
        if not para:
            continue
        
        if i == 0:
            html += f'<div class="date">{para}</div>'
        elif i == 1:
            html += f'<div class="recipient">{para.replace(chr(10), "<br>")}</div>'
        elif para.startswith('Dear'):
            html += f'<div class="greeting">{para}</div>'
        elif para.startswith('Sincerely') or para.startswith('Best regards'):
            html += f'<div class="closing">{para}</div>'
        elif any(name_part in para for name_part in [company_name] if company_name):
            html += f'<div class="signature">{para}</div>'
        else:
            html += f'<div class="body-paragraph">{para}</div>'
    
    html += """
    </div>
</body>
</html>
"""
    
    return html


def get_cover_letter_tips() -> Dict:
    """Provide tips for a strong cover letter."""
    
    return {
        'structure': [
            'Opening: Show enthusiasm and mention the specific position',
            'Middle: Highlight relevant experiences and match job requirements',
            'Closing: Express interest in interview and provide clear call-to-action',
        ],
        'do_list': [
            'Customize for each company and position',
            'Research the company and mention specific projects/values',
            'Use specific examples and metrics when possible',
            'Match the tone to the company culture',
            'Keep it to 3-4 paragraphs (250-300 words)',
            'Proofread carefully for grammar and spelling',
        ],
        'dont_list': [
            'Use generic templates without customization',
            'Repeat your resume - add new information',
            'Make it too long - hiring managers are busy',
            'Use unprofessional language or tone',
            'Include salary expectations unless asked',
            'Have typos or formatting issues',
        ],
        'key_elements': {
            'personalization': 'Address to specific person when possible',
            'relevant_experience': 'Show how your background matches the role',
            'company_knowledge': 'Demonstrate understanding of the company',
            'enthusiasm': 'Show genuine interest in the position',
            'unique_value': 'Explain what makes you different from other candidates',
        }
    }
