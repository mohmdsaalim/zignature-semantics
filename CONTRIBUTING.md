# Contributing to Zignature Platform

Welcome to the Zignature Platform! This document provides guidelines and troubleshooting steps to help you set up the development environment and contribute effectively.

> [!IMPORTANT]
> **Learning from Experience**: This document isn't just a template; it captures specific technical hurdles we encountered during the initial setup of this project. **Pay close attention to the troubleshooting section**—these are documented solutions to real bugs we've already solved.

---

## 🚀 Getting Started

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-org/zignature-semantics.git
    cd zignature-semantics/backend
    ```

2.  **Environment Setup**:
    ```bash
    cp .env.example .env
    uv sync
    ```

3.  **Database & Services**:
    Ensure Docker is running and start the services:
    ```bash
    docker compose up -d db
    ```

4.  **Migrations & Superuser**:
    ```bash
    uv run python manage.py migrate
    uv run python manage.py createsuperuser
    ```

---

## 🔍 Pre-Flight Checklist
Run these commands before starting any ticket to ensure your environment is healthy:

```bash
# 1. Verify working directory (must be /backend)
pwd
# Expected: .../zignature-semantics/backend

# 2. Verify settings module
cat manage.py | grep DJANGO_SETTINGS_MODULE
# Expected: config.settings.development

# 3. Verify database is running
docker compose ps db
# Expected: Up (healthy)

# 4. Verify port 5432 is available
# Should show only Docker (com.docker)
lsof -i :5432

# 5. Run Django system check
uv run python manage.py check
# Expected: System check identified no issues (0 silenced).
```

---

## 🛠️ Common Setup Issues

### 1. `No installed app with label 'accounts'`
**Symptom**: Django cannot find the `accounts` app even though it is in `INSTALLED_APPS`.
**Cause**: `manage.py` might be pointing to the wrong settings module.
**Fix**: Ensure `manage.py` (around line 7) sets the default settings to:
```python
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
```

### 2. Database Connection Fails: "role does not exist"
**Symptom**: `psycopg.OperationalError: connection failed: FATAL: role "zignature_user" does not exist`.
**Cause**: The Docker container was initialized with different credentials than those in your `.env` file.
**Fix**: Rebuild the database container with a clean volume:
```bash
docker compose down -v  # -v deletes the old volume with wrong credentials
docker compose up -d db
```

### 3. Port 5432 Conflict
**Symptom**: Docker fails to start the `db` service because the port is already in use.
**Cause**: A native PostgreSQL instance (e.g., from Homebrew) is running on your machine.
**Fix**: Stop the native service:
```bash
brew services stop postgresql@18  # Adjust version as needed
```
Alternatively, change the port in `docker-compose.yml` to `"5433:5432"` and update `DB_PORT=5433` in your `.env`.

### 4. `ImproperlyConfigured: Set the SECRET_KEY`
**Symptom**: Tests fail with a `SECRET_KEY` error even if `.env` exists.
**Cause**: `pytest` does not automatically load `.env` files.
**Fix**: Ensure `config/settings/base.py` calls `environ.Env.read_env()` early, or run tests with:
```bash
uv run pytest
```
(Our `base.py` is already configured to load `.env` automatically.)

### 5. Collation Version Mismatch (PostgreSQL on Docker)
**Symptom**: `psycopg.errors.InternalError_: template database "template1" has a collation version, but no actual collation version could be determined`.
**Cause**: This often occurs on Apple Silicon Macs when the database volume was initialized with different collation metadata than what the current container version expects.
**Fix**: You must reset the database volume. **Note: This will delete all local data.**
```bash
docker compose down -v
docker compose up -d
```
After this, you will need to re-run your migrations and recreate your superuser.

---

## 📋 Database Reset Procedure
If your database state becomes corrupted or you need a fresh start:

```bash
# 1. Stop and remove everything (including volumes)
docker compose down -v

# 2. Verify no PostgreSQL is running natively
lsof -i :5432

# 3. Start fresh
docker compose up -d db

# 4. Wait for initialization (approx 5s)
sleep 5

# 5. Run migrations
uv run python manage.py migrate

# 6. Create superuser
uv run python manage.py createsuperuser
```

---

## 🧪 Useful Debugging Commands

| Task | Command |
|---|---|
| **View DB Logs** | `docker compose logs db` |
| **Direct DB Access** | `docker compose exec db psql -U zignature_user -d zignature_db` |
| **Show Migrations** | `uv run python manage.py showmigrations` |
| **Check Settings** | `uv run python manage.py diffsettings` |
| **Run Tests (Verbose)** | `uv run pytest -v --tb=short` |
| **Check App Import** | `uv run python -c "import apps.accounts; print('Success')"` |

---

## 🏛️ Project Architecture — The Golden Rules
To prevent repeating the most common bugs encountered in this project, follow these architectural rules:

### 1. The "Base Settings" First Rule
**Issue**: Accessing `env("SECRET_KEY")` before `.env` is loaded causes an immediate crash.
**Rule**: Always call `environ.Env.read_env()` inside `config/settings/base.py` **before** any environment variables are accessed. Never rely on the sub-settings (like `development.py`) to load the environment for the base.

### 2. The "Explicit Settings" Rule
**Issue**: Defaulting `DJANGO_SETTINGS_MODULE` to `config.settings` leads to `AppRegistryNotReady` or `KeyError` because the base settings don't have enough info to run on their own.
**Rule**: `manage.py` and `wsgi.py` must default to a specific environment (e.g., `config.settings.development`).

### 3. The "Docker-First DB" Rule
**Issue**: Running local/native PostgreSQL alongside Docker causes port conflicts on 5432.
**Rule**: Prefer Docker for all services. If you must use native Postgres, change the mapping in `docker-compose.yml` to `5433:5432` to avoid collisions.

---

## 🤝 Branching & PRs
- Create feature branches from `develop`: `feature/XX-short-desc`.
- All PRs must target `develop`.
- Ensure `uv run ruff check .` and `uv run pytest` pass before submitting.