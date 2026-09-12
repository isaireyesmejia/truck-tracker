from app.security import hash_password, verify_password, create_access_token
import jwt
import os
from dotenv import load_dotenv

load_dotenv()


def test_hash_password_genera_hash_distinto_al_original():
    plano = "MiPassword123!"
    hashed = hash_password(plano)
    assert hashed != plano


def test_verify_password_correcta():
    plano = "MiPassword123!"
    hashed = hash_password(plano)
    assert verify_password(plano, hashed) is True


def test_verify_password_incorrecta():
    hashed = hash_password("MiPassword123!")
    assert verify_password("OtraCosa", hashed) is False


def test_create_access_token_contiene_el_payload():
    token = create_access_token({"sub": "test@example.com"})
    payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
    assert payload["sub"] == "test@example.com"