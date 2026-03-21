# Deployment Guide

## Docker Compose (Recommended for Development)

```bash
# 1. Copy environment file and fill in secrets
cp .env.example .env

# 2. Build and start all services
docker-compose up --build

# Services:
# - Frontend:  http://localhost:3000
# - Backend:   http://localhost:8000
# - API Docs:  http://localhost:8000/docs
# - Database:  localhost:5432
```

## Environment Variables

See [`.env.example`](../.env.example) for all required variables.

Critical variables to change before going to production:
- `APP_SECRET_KEY` — long random string
- `JWT_SECRET_KEY` — different long random string
- `POSTGRES_PASSWORD` — strong database password

## Production Checklist

- [ ] Replace all default secrets in `.env`
- [ ] Set `APP_ENV=production`
- [ ] Use a managed PostgreSQL service (e.g., AWS RDS, Supabase)
- [ ] Set `BACKEND_CORS_ORIGINS` to your production frontend domain
- [ ] Switch from `Base.metadata.create_all()` to Alembic migrations
- [ ] Use HTTPS (reverse proxy: nginx / Caddy)
- [ ] Set up log aggregation

## Local Development (Without Docker)

**Backend**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # adjust for local DB
uvicorn app.main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```
