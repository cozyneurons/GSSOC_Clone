# GSSOC Clone Platform

Welcome to the open-source program platform scaffolding! This repository contains a fully separated **Next.js frontend** and **FastAPI backend** connected to **PostgreSQL**.

## Directory Structure Expanded

### `/frontend`
The frontend is built with Next.js 15 (App Router), TailwindCSS, and TypeScript.
- **`src/app/`**: Contains the Next.js App Router pages (e.g., `page.tsx` for the home page health check).
- **`src/lib/api.ts`**: A strongly typed fetch wrapper used to communicate with the FastAPI backend.
- **`src/types/`**: Contains all the TypeScript interfaces (`user.ts`, `project.ts`, `issue.ts`, `pullRequest.ts`, `badge.ts`, `announcement.ts`) that strictly mirror the backend database schemas.
- **`.env.local`**: Holds the local environment variables like `NEXT_PUBLIC_API_URL`.

### `/backend`
The backend is a FastAPI application using SQLAlchemy for ORM and Alembic for database migrations.
- **`app/main.py`**: The entry point for FastAPI. Includes the `/health` endpoint and CORS middleware configuration.
- **`app/models/`**: Contains the separated SQLAlchemy database models (`user.py`, `project.py`, `issue.py`, `pull_request.py`, `badge.py`, `announcement.py`) representing the core relations.
- **`app/db/`**: Contains the database session configuration and the declarative base class.
- **`app/core/config.py`**: Pydantic settings for managing environment variables (e.g., PostgreSQL credentials).
- **`alembic/`**: Contains the Alembic database migration environment and version scripts.
- **`backend/data/`**: Holds the generated mock JSON seed data (users, organizations, issues, PRs, etc.).
- **`backend/generate_data.py`**: A python script used to generate realistic, internally consistent JSON mock data.
- **`backend/app/seed.py`**: A python script that reads the mock JSON data and safely inserts it into the PostgreSQL database.
- **`.env`**: Holds the local backend configuration secrets.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- PostgreSQL running locally on port 5432

### Running the Backend
1. `cd backend`
2. Create and activate a virtual environment: `python -m venv venv` and `.\venv\Scripts\activate` (Windows)
3. Install dependencies: `pip install -r requirements.txt`
4. (Optional) Run `python app/seed.py` to seed your database with mock data.
5. Start the server: `uvicorn app.main:app --reload`

### Running the Frontend
1. `cd frontend`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Visit `http://localhost:3000` to see the health check in action!
