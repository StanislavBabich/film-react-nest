# FILM!

Cinema listings and ticket booking: React frontend and NestJS API with PostgreSQL.

## Setup

### PostgreSQL

Install PostgreSQL locally or run it with Docker. Create a database, for example `films`.

Apply the schema and seed data from the project root:

```bash
psql "$DATABASE_URL" -f backend/test/prac.init.sql
psql "$DATABASE_URL" -f backend/test/prac.films.sql
psql "$DATABASE_URL" -f backend/test/prac.shedules.sql
```

`prac.films.sql` loads titles and descriptions from `backend/test/mongodb_initial_stub.json`.

### Backend

```bash
cd backend
npm ci
```

Copy `.env.example` to `.env` and set:

- `DATABASE_DRIVER` — `postgres`
- `DATABASE_URL` — for example `postgres://postgres:postgres@localhost:5432/films`
- `DATABASE_USERNAME` / `DATABASE_PASSWORD` if they are not in the URL

Start the API:

```bash
npm run start:dev
```

The API listens on port 3000 with the prefix `api/afisha`. Check with Postman or curl: `GET http://localhost:3000/api/afisha/films`.

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

Optional `.env` values:

- `VITE_API_URL` — API base, default `/api/afisha`
- `VITE_CDN_URL` — image CDN, default `/content/afisha`
