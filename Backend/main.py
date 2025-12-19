from fastapi import FastAPI, Depends, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from typing import List
import crud
import ai_analyzer

# Import all our new files
import models
import schemas
import crud
from database import engine, get_db  # get_db was in database.py

# This creates the tables (it's safe to run every time)
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CORS Middleware ---
# This is the security that allows your React frontend
# to talk to your Python backend
origins = [
    "http://localhost:5175",  # Your React app
    "http://127.0.0.1:5175",  # Your React app (127.0.0.1)
    "http://localhost:3000",  # Alternative port
    "http://127.0.0.1:3000",  # Alternative port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)

# Instantiate OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "GROBS.AI Backend is running!"}


@app.post("/register/", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    import hashlib
    
    # 1. Check if user already exists
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Hash password using simple SHA256
    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()
    
    # 3. Create user directly
    db_user = models.User(
        email=user.email, 
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    db: Session = Depends(get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
):
    import hashlib
    from datetime import datetime, timedelta, timezone
    from jose import jwt
    
    # 1. Get the user from the DB by email (form_data.username is the email)
    user = crud.get_user_by_email(db, email=form_data.username)

    # 2. Check if user exists and if the password is correct
    hashed_input = hashlib.sha256(form_data.password.encode()).hexdigest()
    if not user or user.hashed_password != hashed_input:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Create a new access token
    SECRET_KEY = "fa65bf978f9b46b1652c712c6b0f79b2b84af8d011383d1948fe047b758fc549"
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    
    to_encode = {"sub": user.email}
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    access_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    # 4. Return the token
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(
    db: Session = Depends(get_db), 
    token: str = Depends(oauth2_scheme)
):
    from jose import JWTError, jwt
    
    SECRET_KEY = "fa65bf978f9b46b1652c712c6b0f79b2b84af8d011383d1948fe047b758fc549"
    ALGORITHM = "HS256"
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Get the user from the database
    user = crud.get_user_by_email(db, email=email)
    
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    return user


@app.get("/users/me", response_model=schemas.User)
async def read_users_me(
    current_user: models.User = Depends(get_current_user)
):
    """
    A protected endpoint. If you can access this,
    your token is valid and the dependency is working.
    """
    return current_user


@app.post("/resume/", response_model=schemas.Resume)
async def create_new_resume(
    resume_data: schemas.ResumeCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    """
    Protected endpoint to create a new resume.
    It takes the full resume data from the frontend
    and associates it with the logged-in user.
    """
    
    # 1. We already have the user from get_current_user
    # 2. We have the resume data from the request body
    
    # 3. Call the CRUD function to save everything
    return crud.create_resume(db=db, resume_data=resume_data, user_id=current_user.id)

@app.get("/resumes/", response_model=List[schemas.Resume])
async def read_user_resumes(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Protected endpoint to get all resumes for the current user.
    """
    return crud.get_resumes_by_owner(db=db, user_id=current_user.id)


@app.get("/resume/{resume_id}", response_model=schemas.Resume)
async def read_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Protected endpoint to get a single resume by its ID.
    """
    db_resume = crud.get_resume(db=db, resume_id=resume_id, user_id=current_user.id)
    if db_resume is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    return db_resume

@app.post("/resume/{resume_id}/analyze", response_model=schemas.AnalysisResult)
async def analyze_resume(
    resume_id: int,
    job_description: schemas.JobDescriptionIn,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Protected endpoint to analyze a specific resume against a job description.
    """

    # 1. Get the resume from the DB
    resume = crud.get_resume(db=db, resume_id=resume_id, user_id=current_user.id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    # 2. Call our new AI analyzer function
    # This function does the heavy lifting
    analysis_data = ai_analyzer.analyze_resume_with_ai(
        resume=resume,
        job_description=job_description.text
    )

    # 3. Return the JSON analysis
    return analysis_data  

@app.delete("/resume/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Protected endpoint to delete a resume.
    """

    db_resume = crud.delete_resume(db=db, resume_id=resume_id, user_id=current_user.id)

    if db_resume is None:
        raise HTTPException(status_code=404, detail="Resume not found")

    # A 204 response means "Success, but I have nothing to send back"
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.put("/resume/{resume_id}", response_model=schemas.Resume)
async def update_resume(
    resume_id: int,
    resume_data: schemas.ResumeCreate, # We can re-use the Create schema!
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Protected endpoint to update an existing resume.
    """
    
    db_resume = crud.update_resume(
        db=db, 
        resume_id=resume_id, 
        user_id=current_user.id, 
        resume_data=resume_data
    )
    
    if db_resume is None:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    return db_resume