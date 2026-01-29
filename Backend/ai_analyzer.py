import os
import google.generativeai as genai
from dotenv import load_dotenv
import models
import json
import re

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found. Make sure it's set in your .env file.")

genai.configure(api_key=api_key)

model_name = 'gemini-2.5-flash'

def analyze_resume_with_ai(resume: models.Resume, job_description: str):
    """
    Analyzes a resume against a job description using the Gemini API
    and returns a structured JSON response.
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
    
    prompt = f"""You are an expert resume analyst. Analyze this resume against the job description and provide analysis in JSON format.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Provide analysis as valid JSON with exactly these fields:
- score: number 0-100 (how well resume matches job)
- missing_keywords: array of 5-8 missing skills/terms from job description
- suggestions: string with 3-4 bullet point suggestions (use \\n for line breaks)

Return ONLY valid JSON, no markdown or extra text."""
    
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        json_text = response_text
        
        if '```' in response_text:
            json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', response_text)
            if json_match:
                json_text = json_match.group(1).strip()
        
        if not json_text.startswith('{'):
            json_match = re.search(r'\{[\s\S]*\}', json_text)
            if json_match:
                json_text = json_match.group(0)
        
        if json_text.endswith(','):
            json_text = json_text[:-1]
        
        result = json.loads(json_text)
        
        if 'score' not in result:
            result['score'] = 0
        if 'missing_keywords' not in result:
            result['missing_keywords'] = []
        if 'suggestions' not in result:
            result['suggestions'] = ""
        
        return result
        
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        return {
            "score": 50,
            "missing_keywords": ["Unable to parse response"],
            "suggestions": "Resume review completed but detailed analysis unavailable"
        }
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return {
            "score": 0,
            "missing_keywords": ["Error: Could not analyze resume."],
            "suggestions": f"An error occurred while analyzing the resume: {str(e)}"
        }