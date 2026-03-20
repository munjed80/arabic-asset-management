# API Reference

Base URL: `http://localhost:8000`

Interactive docs: `http://localhost:8000/docs` (Swagger UI)

All authenticated routes require the header:
```
Authorization: Bearer <access_token>
```

---

## Health

| Method | Path      | Description    |
|--------|-----------|----------------|
| GET    | /health   | Health check   |

---

## Auth — `/api/v1/auth`

| Method | Path             | Description      |
|--------|------------------|------------------|
| POST   | /auth/login      | Obtain JWT token |

**POST /auth/login**
```json
{
  "email": "user@example.com",
  "password": "secret"
}
```
Response:
```json
{
  "access_token": "<jwt>",
  "token_type": "bearer"
}
```

---

## Users — `/api/v1/users`

| Method | Path             | Description       |
|--------|------------------|-------------------|
| GET    | /users           | List users        |
| POST   | /users           | Create user       |
| GET    | /users/{id}      | Get user          |
| PATCH  | /users/{id}      | Update user       |

---

## Assets — `/api/v1/assets`

| Method | Path             | Description       |
|--------|------------------|-------------------|
| GET    | /assets          | List assets       |
| POST   | /assets          | Create asset      |
| GET    | /assets/{id}     | Get asset         |
| PATCH  | /assets/{id}     | Update asset      |
| DELETE | /assets/{id}     | Delete asset      |

---

## Categories — `/api/v1/categories`

| Method | Path                  | Description       |
|--------|-----------------------|-------------------|
| GET    | /categories           | List categories   |
| POST   | /categories           | Create category   |
| GET    | /categories/{id}      | Get category      |

---

## Locations — `/api/v1/locations`

| Method | Path                | Description     |
|--------|---------------------|-----------------|
| GET    | /locations          | List locations  |
| POST   | /locations          | Create location |
| GET    | /locations/{id}     | Get location    |

---

## Departments — `/api/v1/departments`

| Method | Path                   | Description      |
|--------|------------------------|------------------|
| GET    | /departments           | List departments |
| POST   | /departments           | Create dept      |
| GET    | /departments/{id}      | Get department   |
