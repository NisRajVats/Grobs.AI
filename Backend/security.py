from datetime import datetime, timedelta, timezone
import hashlib
from jose import JWTError, jwt
from pydantic import BaseModel

# --- Password Hashing ---

def verify_password(plain_password, hashed_password):
    """Checks if the plain password matches the hashed one."""
    # Simple SHA256 hashing for testing (NOT for production)
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

def get_password_hash(password):
    """Generates a secure hash for a plain-text password."""
    # Simple SHA256 hashing for testing (NOT for production)
    return hashlib.sha256(password.encode()).hexdigest()


# --- JSON Web Token (JWT) ---

# !! PASTE YOUR SECRET KEY HERE !!
# Replace 'YOUR_SECRET_KEY_HERE' with the key you generated in Step 2
SECRET_KEY = "fa65bf978f9b46b1652c712c6b0f79b2b84af8d011383d1948fe047b758fc549" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 # A user stays logged in for 30 minutes

class TokenData(BaseModel):
    """
    This is the data we'll store *inside* the token.
    'sub' is the standard name for the 'subject' (the user's email).
    """
    email: str | None = None


def create_access_token(data: dict):
    """
    Creates a new JWT access token.
    """
    to_encode = data.copy()
    
    # Set the token's expiration time
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    # Encode the token with our secret key
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    """
    Decodes a JWT access token and returns the payload (data).
    Will be used later to protect routes.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            # Token is invalid if it doesn't have a 'sub' field
            return None
        return TokenData(email=email)
    except JWTError:
        # Token is invalid (expired, wrong signature, etc.)
        return None