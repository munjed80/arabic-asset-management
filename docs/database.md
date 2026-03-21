# Database Schema

Database: PostgreSQL 16  
ORM: SQLAlchemy 2 (mapped columns)

---

## Tables

### `users`

| Column           | Type         | Notes                         |
|------------------|--------------|-------------------------------|
| id               | SERIAL PK    |                               |
| email            | VARCHAR(255) | Unique, indexed               |
| full_name        | VARCHAR(255) |                               |
| hashed_password  | VARCHAR(255) | bcrypt                        |
| role             | ENUM         | admin / manager / viewer      |
| is_active        | BOOLEAN      | Default true                  |
| created_at       | TIMESTAMPTZ  | Server default                |
| updated_at       | TIMESTAMPTZ  | Auto-updated                  |

---

### `categories`

| Column      | Type         | Notes   |
|-------------|--------------|---------|
| id          | SERIAL PK    |         |
| name        | VARCHAR(150) | Unique  |
| description | VARCHAR(500) |         |

---

### `locations`

| Column  | Type         | Notes   |
|---------|--------------|---------|
| id      | SERIAL PK    |         |
| name    | VARCHAR(150) | Unique  |
| address | VARCHAR(500) |         |

---

### `departments`

| Column      | Type         | Notes   |
|-------------|--------------|---------|
| id          | SERIAL PK    |         |
| name        | VARCHAR(150) | Unique  |
| description | VARCHAR(500) |         |

---

### `assets`

| Column         | Type          | Notes                                        |
|----------------|---------------|----------------------------------------------|
| id             | SERIAL PK     |                                              |
| asset_tag      | VARCHAR(100)  | Unique, indexed                              |
| name           | VARCHAR(255)  |                                              |
| description    | VARCHAR(1000) |                                              |
| serial_number  | VARCHAR(150)  | Unique, nullable                             |
| status         | ENUM          | active / inactive / under_maintenance / disposed |
| purchase_date  | DATE          |                                              |
| purchase_cost  | NUMERIC(12,2) |                                              |
| category_id    | INT FK        | → categories.id                              |
| location_id    | INT FK        | → locations.id                               |
| department_id  | INT FK        | → departments.id                             |
| assigned_to_id | INT FK        | → users.id                                   |
| created_at     | TIMESTAMPTZ   |                                              |
| updated_at     | TIMESTAMPTZ   |                                              |

---

## Migrations

Migrations are managed with **Alembic**.  
Currently, tables are auto-created on startup via `Base.metadata.create_all()`.  
Production deployments should switch to Alembic migration scripts.
