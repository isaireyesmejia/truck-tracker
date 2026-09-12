def test_registro_usuario_exitoso(client):
    response = client.post("/registro", json={"email": "nuevo@example.com", "password": "Segura123!"})
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "nuevo@example.com"
    assert "id" in data


def test_registro_usuario_duplicado(client):
    client.post("/registro", json={"email": "dup@example.com", "password": "Segura123!"})
    response = client.post("/registro", json={"email": "dup@example.com", "password": "OtraPass456!"})
    assert response.status_code == 400


def test_login_credenciales_correctas(client):
    client.post("/registro", json={"email": "login@example.com", "password": "Segura123!"})
    response = client.post("/login", json={"email": "login@example.com", "password": "Segura123!"})
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_password_incorrecta(client):
    client.post("/registro", json={"email": "malapass@example.com", "password": "Segura123!"})
    response = client.post("/login", json={"email": "malapass@example.com", "password": "Incorrecta"})
    assert response.status_code == 401


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200