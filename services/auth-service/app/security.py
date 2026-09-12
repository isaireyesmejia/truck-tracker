import os
from dotenv import load_dotenv
load_dotenv()

import bcrypt
from jose import jwt
from datetime import datetime, timedelta

JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), password_hash.encode())

def create_access_token(data: dict, expires_minutes: int = 30) -> str:
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(minutes=expires_minutes)
    return jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)