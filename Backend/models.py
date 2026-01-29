from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base # Use absolute import

# --- User Model (UPDATED) ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    
    # This creates a "link" so we can access user.resumes
    resumes = relationship("Resume", back_populates="owner")

# --- NEW: Resume Model ---
class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # --- Personal Info (a snapshot from the form) ---
    full_name = Column(String)
    email = Column(String)
    phone = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    template_name = Column(String, default="classic")
    
    # --- Links ---
    # Link to the user who owns this resume
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="resumes")
    
    
    
    # Links to the other sections
    education = relationship("Education", back_populates="resume", cascade="all, delete-orphan")
    experience = relationship("Experience", back_populates="resume", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="resume", cascade="all, delete-orphan")

    skills = relationship("Skill", back_populates="resume", cascade="all, delete-orphan")

# --- NEW: Education Model ---
class Education(Base):
    __tablename__ = "education"
    
    id = Column(Integer, primary_key=True, index=True)
    school = Column(String)
    degree = Column(String)
    major = Column(String, nullable=True)
    gpa = Column(String, nullable=True)
    start_date = Column(String)
    end_date = Column(String)
    description = Column(Text, nullable=True)
    
    # Link to the resume it belongs to
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    resume = relationship("Resume", back_populates="education")

# --- NEW: Experience Model ---
class Experience(Base):
    __tablename__ = "experience"
    
    id = Column(Integer, primary_key=True, index=True)
    company = Column(String)
    role = Column(String)
    location = Column(String, nullable=True)
    start_date = Column(String)
    end_date = Column(String)
    current = Column(Boolean, default=False)
    description = Column(Text, nullable=True)
    
    # Link to the resume it belongs to
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    resume = relationship("Resume", back_populates="experience")

# --- NEW: Project Model ---
class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String)
    description = Column(Text, nullable=True)
    project_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    technologies = Column(String, nullable=True)
    
    # Link to the resume it belongs to
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    resume = relationship("Resume", back_populates="projects")

# --- NEW: Skill Model ---
class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String, nullable=True, default='Technical')

    # Link to the resume it belongs to
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    resume = relationship("Resume", back_populates="skills")