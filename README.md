# نظام إدارة الأصول العامة — Public Asset Management System

A monorepo for managing public assets, built with Next.js (frontend) and FastAPI (backend).

## Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Next.js 14 · TypeScript · Tailwind  |
| Backend   | FastAPI · SQLAlchemy · PostgreSQL   |
| Auth      | JWT (Bearer tokens)                 |
| Container | Docker · Docker Compose             |

## Project Structure

```
arabic-asset-management/
├── frontend/        # Next.js application (RTL, Arabic UI)
├── backend/         # FastAPI application
├── docs/            # Project documentation
├── docker-compose.yml
├── .env.example
└── README.md
```

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local frontend dev)
- Python 3.11+ (for local backend dev)

### Using Docker Compose

```bash
cp .env.example .env
# Edit .env with your values
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Local Development

**Backend**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Documentation

See the [`docs/`](./docs/) folder for:
- [Architecture](./docs/architecture.md)
- [API Reference](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Frontend Guide](./docs/frontend.md)
- [Deployment Guide](./docs/deployment.md)

## Conventions

- UI language: **Arabic (RTL)**
- Internal code, folders, variables, API routes, and DB names: **English**
- No complaints module — this system is **asset management only**
