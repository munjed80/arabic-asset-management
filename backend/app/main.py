from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
from app.models import asset_movement  # noqa: F401 — ensures table is registered
from app.routers import asset_movements, assets, auth, categories, departments, health, locations, users

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Public Asset Management System",
    description="API for managing public assets — نظام إدارة الأصول العامة",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(assets.router, prefix="/api/v1")
app.include_router(categories.router, prefix="/api/v1")
app.include_router(locations.router, prefix="/api/v1")
app.include_router(departments.router, prefix="/api/v1")
app.include_router(asset_movements.router, prefix="/api/v1")
