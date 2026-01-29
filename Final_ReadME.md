# GROBS.AI - AI-Powered Career Platform

GROBS.AI is a comprehensive, modern career platform designed to help job seekers optimize their resumes, prepare for interviews, and chart their career paths using cutting-edge Artificial Intelligence.

## 🚀 Project Overview

GROBS.AI leverages advanced Large Language Models (LLMs) and Natural Language Processing (NLP) to provide personalized career assistance. From building a resume from scratch to generating tailored cover letters and interview questions, GROBS.AI is an all-in-one solution for the modern professional.

## 🏗️ Architecture

The platform follows a decoupled **Client-Server Architecture**:

- **Frontend**: A highly responsive Single Page Application (SPA) built with React and Vite.
- **Backend**: A high-performance asynchronous API built with FastAPI (Python).
- **Database**: SQLite for persistent storage, managed through SQLAlchemy ORM.
- **Authentication**: Secure JWT (JSON Web Token) based authentication system with protected routes.

---

## 💻 Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI
- **Server**: Uvicorn
- **ORM**: SQLAlchemy
- **Database**: SQLite
- **Security**: Python-Jose (JWT), Passlib (Bcrypt)
- **Environment**: Python-Decouple, Dotenv

---

## 🤖 AI Models & Technologies

GROBS.AI integrates several state-of-the-art AI models to provide intelligent features:

1.  **Google Gemini 1.5 Flash**: Used for complex reasoning tasks including:
    *   Resume Analysis & Scoring
    *   Cover Letter Generation
    *   Career Path Recommendations
    *   Interview Question Generation
2.  **HuggingFace `dslim/bert-base-NER`**: A BERT-based Named Entity Recognition model used for accurately extracting names and entities from uploaded PDF resumes.
3.  **Sentence Transformers**: Used for semantic matching and calculating similarity scores between resumes and job descriptions.
4.  **SpaCy**: Leveraged for advanced NLP tasks such as keyword extraction and linguistic analysis.
5.  **PDFPlumber**: Used for high-fidelity text extraction from PDF documents.

---

## ✨ Key Features

### 1. Smart Resume Builder
- Dynamic, multi-section form with real-time updates.
- Support for Education, Experience, Projects, and Skills.
- Glass-morphism UI with smooth Framer Motion transitions.

### 2. AI Resume Parser
- Upload existing PDF resumes.
- Automatic extraction of personal info, work history, and skills using NLP/NER models.
- Pre-fills the resume builder for quick editing.

### 3. AI Analysis & Scoring
- Paste a job description to get a real-time match score.
- Identify missing keywords and critical skills.
- Get AI-powered suggestions to improve your resume for a specific role.

### 4. ATS Optimization Checker
- Checks for formatting compatibility with Applicant Tracking Systems.
- Analyzes keyword density and placement.

### 5. Career Path Prediction
- Analyzes your current trajectory.
- Suggests next career steps and lateral moves.
- Identifies skill gaps for your target roles.

### 6. Tailored Interview Prep
- Generates behavioral and technical questions based on your specific resume and the target job description.
- Provides context-aware preparation tips.

### 7. AI Cover Letter Generator
- Instantly creates professional, customized cover letters.
- Perfectly balanced between your experience and the job requirements.

---

## 🛠️ Setup and Installation

### Backend
1. Navigate to the backend directory: `cd Backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Create a `.env` file with your `GEMINI_API_KEY`.
4. Start the server: `uvicorn main:app --reload`

### Frontend
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

---

## 📊 Database Schema

The system uses a relational schema:
- **Users**: Authentication and profile data.
- **Resumes**: Core resume data linked to users.
- **Education/Experience/Projects/Skills**: Related tables for granular resume management.

---

Developed with ❤️ by the GROBS.AI Team.
