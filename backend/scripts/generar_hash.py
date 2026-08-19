"""
Script utilitario para generar el hash de una contraseña de prueba
y actualizarla directamente en la base de datos para un usuario existente.

Uso: python -m scripts.generar_hash
"""
import bcrypt
from sqlalchemy import text
from app.database import SessionLocal

def generar_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

if __name__ == "__main__":
    email = input("Correo del usuario a actualizar: ").strip()
    password = input("Contraseña de prueba (texto plano): ").strip()

    hashed = generar_hash(password)
    print(f"\nHash generado: {hashed}")

    db = SessionLocal()
    try:
        result = db.execute(
            text("UPDATE dbo.Usuarios SET password_hash = :hash WHERE correo_electronico = :email"),
            {"hash": hashed, "email": email}
        )
        db.commit()
        if result.rowcount == 0:
            print(f"⚠️  No se encontró ningún usuario con el correo: {email}")
        else:
            print(f"✅ Contraseña actualizada para: {email}")
    finally:
        db.close()