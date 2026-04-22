# BookSwap

BookSwap is a full-stack platform for peer-to-peer book exchanging and donating.  
Users can list books, request swaps, manage exchange workflows, and leave reviews to build trust in the community.

## Features

- JWT-based authentication (register, login, profile)
- Book management (create, browse, update, delete)
- Exchange requests (send, accept, reject, cancel, complete)
- User reviews and ratings after completed exchanges
- Public user profiles with listed books and review history
- Image uploads for user avatars and book covers

## Tech Stack

- **Backend:** Django, Django REST Framework, SimpleJWT
- **Database:** PostgreSQL (Supabase via `DATABASE_URL`)
- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **API Docs:** drf-spectacular (OpenAPI/Swagger)

## Project Structure

- `bookswap/` - Django project settings and root URL config
- `accounts/` - authentication and user profile APIs
- `books/` - books, genres, and listing APIs
- `exchanges/` - exchange workflow APIs
- `reviews/` - review and rating APIs
- `frontend/` - React + Vite client application

## Environment Variables

Create a `.env` file in the project root (already present in this project) with:

- `SECRET_KEY` - Django secret key
- `DEBUG` - `True`/`False`
- `ALLOWED_HOSTS` - comma-separated hostnames
- `DATABASE_URL` - Supabase PostgreSQL URL (required)
- `DB_SSL_REQUIRE` - `True` by default for managed Postgres
- `DB_CONN_MAX_AGE` - DB connection pooling age (seconds)
- `CORS_ALLOWED_ORIGINS` - comma-separated frontend origins
- `CSRF_TRUSTED_ORIGINS` - comma-separated trusted origins

## Backend Setup (Django + DRF)

1. Create and activate virtual environment:
   - Windows PowerShell:
     - `python -m venv .venv`
     - `.\.venv\Scripts\Activate.ps1`
2. Install dependencies:
   - `pip install -r requirements.txt`
3. Run migrations:
   - `python manage.py migrate`
4. Start backend server:
   - `python manage.py runserver`

Backend runs at `http://127.0.0.1:8000`.

## Frontend Setup (React + Vite)

1. Open frontend directory:
   - `cd frontend`
2. Install dependencies:
   - `npm install`
3. Start dev server:
   - `npm run dev`
4. Build for production:
   - `npm run build`

Frontend runs at `http://127.0.0.1:5173` by default.

## API Endpoints (High-level)

- Auth: `/api/auth/`
- Books: `/api/books/`
- Exchanges: `/api/exchanges/`
- Reviews: `/api/reviews/`
- Schema: `/api/schema/`
- Swagger UI: `/api/docs/`

## Media and Uploads

- Media files are stored under `MEDIA_ROOT` and served from `MEDIA_URL`.
- In development, Django serves media directly when `DEBUG=True`.
- For production, configure external/static hosting or web server media handling.

## Production Readiness Notes

- All sensitive settings are read from environment variables.
- Database uses `DATABASE_URL` for managed PostgreSQL environments.
- SSL for Postgres is enabled by default (`DB_SSL_REQUIRE=True`).
- `DEBUG` is `False` by default if not set.
- Avoid committing real secrets in `.env`.

## Screenshots

_Add screenshots here:_

- Landing page
- Browse books page
- Exchange dashboard
- User profile page

## License

Add your preferred license (MIT recommended for portfolio projects).
