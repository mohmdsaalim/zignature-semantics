# Zignature Backend Management Commands
# Standardized for: Ruff (Lint/Format), Pytest, and UV environment management.

# Variables
DOCKER_COMPOSE = docker compose
BACKEND_EXEC = $(DOCKER_COMPOSE) exec backend
# Inside the container, we must use 'uv run' to access the synced environment
UV_RUN = uv run

.PHONY: help up down restart rebuild logs migrate migrations shell test lint format check sync

help:
	@echo "Available commands:"
	@echo "  make up          - Start backend docker services (background)"
	@echo "  make down        - Stop backend docker services"
	@echo "  make restart     - Restart all docker containers"
	@echo "  make rebuild     - Rebuild and start containers (use after dep changes)"
	@echo "  make logs        - Follow docker logs"
	@echo "  make migrate     - Run django migrations"
	@echo "  make migrations  - Create new django migrations"
	@echo "  make shell       - Open django shell"
	@echo "  make test        - Run backend tests (pytest)"
	@echo "  make lint        - Run backend linter (ruff)"
	@echo "  make format      - Auto-format backend code (ruff)"
	@echo "  make check       - Pre-push check (ruff + pytest)"
	@echo "  make sync        - Post-pull sync (up + migrate)"

# Docker Management
up:
	$(DOCKER_COMPOSE) up -d

down:
	$(DOCKER_COMPOSE) down

restart:
	$(DOCKER_COMPOSE) restart

rebuild:
	$(DOCKER_COMPOSE) up -d --build

logs:
	$(DOCKER_COMPOSE) logs -f

# Backend Commands (Inside Docker via uv)
migrate:
	$(BACKEND_EXEC) $(UV_RUN) python manage.py migrate

migrations:
	$(BACKEND_EXEC) $(UV_RUN) python manage.py makemigrations

shell:
	$(BACKEND_EXEC) $(UV_RUN) python manage.py shell

test:
	$(BACKEND_EXEC) $(UV_RUN) pytest

lint:
	$(BACKEND_EXEC) $(UV_RUN) ruff check .

format:
	$(BACKEND_EXEC) $(UV_RUN) ruff format .

# Workflow
check: lint test
	@echo "✅ Pre-push check passed (Ruff + Pytest)."

sync: up migrate
	@echo "✅ Backend environment synced and migrations applied."
