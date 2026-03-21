# Architecture

## Overview

The system is a monorepo composed of two main services:

```
arabic-asset-management/
├── frontend/   Next.js 14 (TypeScript, Tailwind, RTL/Arabic)
├── backend/    FastAPI (Python 3.11, SQLAlchemy, PostgreSQL)
└── docs/       Project documentation
```

## Frontend Architecture

```
frontend/src/
├── app/                  # Next.js App Router
│   ├── (auth)/login/     # Login page (public route)
│   ├── dashboard/        # Dashboard
│   ├── assets/           # Assets list + [id] detail
│   ├── movements/        # Asset movements
│   ├── maintenance/      # Maintenance records
│   ├── audits/           # Audit records
│   └── settings/         # Settings
├── components/
│   ├── layout/           # Sidebar, TopBar
│   └── ui/               # Shared UI primitives
├── lib/                  # API client, utilities
├── hooks/                # Custom React hooks
└── types/                # TypeScript interfaces
```

## Backend Architecture

```
backend/app/
├── core/
│   ├── config.py         # Pydantic settings (env vars)
│   ├── database.py       # SQLAlchemy engine & session
│   └── security.py       # JWT + password hashing
├── models/               # SQLAlchemy ORM models
├── schemas/              # Pydantic request/response schemas
├── routers/              # FastAPI route handlers
└── main.py               # Application entry point
```

## Data Flow

```
Browser → Next.js Frontend → FastAPI Backend → PostgreSQL
```

## Design Principles

- **Separation of concerns** — frontend and backend are fully independent services.
- **English internals** — all code, routes, DB columns, folder names are in English.
- **Arabic UI** — all user-visible text is in Arabic; `lang="ar" dir="rtl"` on `<html>`.
- **Minimal dependencies** — no over-engineering; add libraries only when needed.
