# Zignature Platform

<<<<<<< HEAD
# Stoats are deadly predators(Testing sinan's pull request issue)
# Stoats dev is dangerous when you code push without test
=======
A modern, high-performance job agency platform built with **Django**, **PostgreSQL**, and **React**.

---

## 🛠️ Tech Stack

- **Backend**: Django 4.2 LTS, Django REST Framework
- **Frontend**: React (Vite), TailwindCSS, Zustand
- **Environment**: Docker, uv (Python package manager)
- **Infrastructure**: Nginx, PostgreSQL 16

---

## 📋 Prerequisites

Ensure you have the following installed based on your operating system:

### **Mac / Linux**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [uv](https://docs.astral.sh/uv/getting-started/installation/)
- Git

### **Windows**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ensure WSL2 backend is enabled)
- [uv](https://docs.astral.sh/uv/getting-started/installation/)
- [Git Bash](https://git-scm.com/downloads) (recommended for running shell commands)

---

## 🚀 Quick Start (Recommended)

Get the project running in under 5 minutes using Docker. This is the **standard environment** for the team.

1.  **Clone and Enter**:
    ```bash
    git clone https://github.com/your-org/zignature-semantics.git
    cd zignature-semantics
    ```

2.  **Environment Config**:
    ```bash
    cp backend/.env.example backend/.env
    ```

3.  **Start Services**:
    ```bash
    docker compose up -d --build
    ```

4.  **Initialize Database**:
    ```bash
    docker compose exec backend uv run python manage.py migrate
    docker compose exec backend uv run python manage.py createsuperuser
    ```

5.  **Access the Platform**:
    - **Frontend**: `http://localhost:5173` (Once frontend setup is complete)
    - **API & Admin**: `http://localhost/admin/` (via Nginx Proxy)
    - **API Direct**: `http://localhost:8000/api/v1/`

---

## 🐍 Native Setup (Optional)

If you prefer to run the backend natively (without Docker):

1.  **Install Python 3.12**
2.  **Initialize Environment**:
    ```bash
    cd backend
    uv sync
    ```
3.  **Activate Virtual Environment**:
    - **Mac/Linux**: `source .venv/bin/activate`
    - **Windows**: `.venv\Scripts\activate`
4.  **Run Server**:
    ```bash
    uv run python manage.py runserver
    ```

---

## 🧪 Testing & Linting

We maintain high code quality standards. Run these before every commit:

```bash
# Run Backend Tests
docker compose exec backend uv run pytest

# Run Linting (Ruff)
docker compose exec backend uv run ruff check .
```

---

## 📖 Developer Resources

- [**CONTRIBUTING.md**](./CONTRIBUTING.md): Detailed troubleshooting, historical gotchas, and database reset procedures. **Read this if you encounter setup errors.**
- [**Handbook Directory**](./handbook/): System design, architectural decisions, and the phased implementation plan.

---

## 🤝 Contribution Workflow

1. Create a feature branch from `dev`: `feature/XX-short-desc`
2. Implement changes and add tests.
3. Verify all tests pass locally.
4. Open a Pull Request into `dev`.
>>>>>>> 8095f792ff68d8d0d3b5278ff98b5fb6549746aa
