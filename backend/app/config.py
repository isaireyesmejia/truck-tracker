import os
from dotenv import load_dotenv

# Carga las variables del archivo .env (solo en desarrollo local)
load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    JWT_SECRET: str = os.getenv("JWT_SECRET")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60

    def __init__(self):
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL no está definido. Revisa tu archivo .env")
        if not self.JWT_SECRET:
            raise ValueError("JWT_SECRET no está definido. Revisa tu archivo .env")

settings = Settings()