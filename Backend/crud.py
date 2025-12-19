from sqlalchemy.orm import Session
import models
import schemas
import hashlib

# --- User CRUD (No Changes) ---

def get_user_by_email(db: Session, email: str):
    """Looks up a user by their email address."""
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    """Creates a new user in the database."""
    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()
    db_user = models.User(
        email=user.email, 
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- NEW: Resume CRUD ---

def create_resume(db: Session, resume_data: schemas.ResumeCreate, user_id: int):
    """
    Creates a full resume with all nested data for a specific user.
    """
    
    # 1. Create the main Resume object
    # We unpack the personal info from the resume_data
    db_resume = models.Resume(
        full_name=resume_data.full_name,
        email=resume_data.email,
        phone=resume_data.phone,
        linkedin_url=resume_data.linkedin_url,
        template_name=resume_data.template_name,
        owner_id=user_id  # Link it to the logged-in user
    )
    
    # 2. Add it to the session to get an ID
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    
    # 3. Create all the Education entries
    for edu_data in resume_data.education:
        db_edu = models.Education(
            **edu_data.dict(), # Unpack the education data
            resume_id=db_resume.id # Link it to the new resume
        )
        db.add(db_edu)
        
    # 4. Create all the Experience entries
    for exp_data in resume_data.experience:
        db_exp = models.Experience(
            **exp_data.dict(), # Unpack the experience data
            resume_id=db_resume.id # Link it to the new resume
        )
        db.add(db_exp)

    # 5. Create all the Project entries
    for proj_data in resume_data.projects:
        db_proj = models.Project(
            **proj_data.dict(), # Unpack the project data
            resume_id=db_resume.id # Link it to the new resume
        )
        db.add(db_proj)

    for skill_data in resume_data.skills:
        db_skill = models.Skill(
            **skill_data.dict(),
            resume_id=db_resume.id
        )
        db.add(db_skill)
        
    # 6. Commit all the new entries (education, exp, projects)
    db.commit()
    db.refresh(db_resume)
    
    return db_resume

def get_resumes_by_owner(db: Session, user_id: int):
    """
    Gets all resumes owned by a specific user.
    """
    return db.query(models.Resume).filter(models.Resume.owner_id == user_id).all()

def get_resume(db: Session, resume_id: int, user_id: int):
    """
    Gets a single resume by its ID,
    ensuring it belongs to the correct user.
    """
    return db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.owner_id == user_id
    ).first()

def delete_resume(db: Session, resume_id: int, user_id: int):
    # Find the resume first
    db_resume = get_resume(db=db, resume_id=resume_id, user_id=user_id)
    
    if db_resume is None:
        return None
    
    # Now delete it
    db.delete(db_resume)
    db.commit()
    
    return db_resume # Return the object we deleted


def update_resume(db: Session, resume_id: int, user_id: int, resume_data: schemas.ResumeCreate):
    """
    Updates an existing resume.
    """
    
    # 1. Get the existing resume
    db_resume = get_resume(db=db, resume_id=resume_id, user_id=user_id)
    
    if not db_resume:
        return None # Resume not found or user doesn't own it

    # 2. Delete all old children data
    # (SQLAlchemy's "cascade" will handle this from the resume object)
    db_resume.education = []
    db_resume.experience = []
    db_resume.projects = []
    db_resume.skills = []
    
    # We commit here to clear the old relationships
    db.commit()

    # 3. Update the main resume (Personal Info)
    db_resume.full_name = resume_data.full_name
    db_resume.email = resume_data.email
    db_resume.phone = resume_data.phone
    db_resume.linkedin_url = resume_data.linkedin_url
    db_resume.template_name = resume_data.template_name
    
    # 4. Add all the new children, just like in create_resume
    for edu_data in resume_data.education:
        db_edu = models.Education(**edu_data.dict(), resume_id=db_resume.id)
        db.add(db_edu)
        
    for exp_data in resume_data.experience:
        db_exp = models.Experience(**exp_data.dict(), resume_id=db_resume.id)
        db.add(db_exp)

    for proj_data in resume_data.projects:
        db_proj = models.Project(**proj_data.dict(), resume_id=db_resume.id)
        db.add(db_proj)
        
    for skill_data in resume_data.skills:
        db_skill = models.Skill(**skill_data.dict(), resume_id=db_resume.id)
        db.add(db_skill)
            
    # 5. Commit all the changes
    db.commit()
    db.refresh(db_resume)
    
    return db_resume