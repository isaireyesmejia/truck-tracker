# Truck Tracker

Sistema de monitoreo de ubicación en tiempo real (camiones/personas), construido como proyecto full-stack de portafolio.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend web | React |
| Backend | Python (FastAPI) |
| Mobile | React Native |
| Cloud | Azure (App Service, SQL Database) |
| Base de datos relacional/geoespacial | SQL Server (`geography`) |
| Base de datos NoSQL | MongoDB (logs/eventos) |
| Autenticación | JWT propio (bcrypt + PyJWT) |
| DevOps | Docker + GitHub Actions (CI/CD) |

## Estructura del repo

```
truck-tracker/
├── backend/     # API REST en FastAPI
├── frontend/    # Aplicación web en React
├── mobile/      # App móvil en React Native (captura y envío de GPS)
├── docs/        # Diagramas de arquitectura, capturas, notas de diseño
└── README.md
```

## Arquitectura (resumen)

- La **app móvil** captura la ubicación GPS del usuario/vehículo y la envía a la API.
- La **API (FastAPI)** valida el usuario vía JWT, guarda la posición en **SQL Server** (columna `geography`) y registra eventos de auditoría en **MongoDB**.
- El **frontend web** consulta la API y muestra las posiciones en un mapa en tiempo real.
- Todo desplegado en **Azure** (App Service para la API, Azure SQL Database para el almacenamiento relacional).

## Estado del proyecto

🚧 En desarrollo — ver `docs/` para el detalle de arquitectura y el plan de fases.

## Cómo correr el proyecto localmente

Instrucciones detalladas próximamente en cada subcarpeta (`backend/README.md`, `frontend/README.md`, `mobile/README.md`).