# Elix Fragancias — Project Context for AI Agents

## Project Overview

Web platform serving as a perfume catalog for a small business. Customers can browse products with their information, and admins manage products, sales, and promotions via an administration panel.

## Architecture

Monorepo with two services:

```
Elix/
├── App/          # Next.js frontend (App Router, Tailwind CSS, Zustand)
├── Server/       # Django REST Framework API + PostgreSQL
```

| Service       | Port | Technology              |
|---------------|------|-------------------------|
| Frontend      | 3000 | Next.js, Tailwind, Zustand |
| Backend API   | 8000 | Django REST Framework   |
| PostgreSQL    | 5432 | PostgreSQL 16+          |

## App (Next.js Frontend)

### Conventions

- **Routing**: Next.js App Router with route groups `(auth)`, dynamic routes `[id]`
- **State**: Zustand stores in `src/context/`
- **Styling**: Tailwind CSS utility classes
- **API calls**: Service layer in `src/services/` (`api.ts`, `auth.ts`, `products.ts`, `orders.ts`)
- **Components**: `src/components/` organized by domain (`products/`, `cart/`, `auth/`, `ui/`)
- **Hooks**: Custom hooks in `src/hooks/`
- **Utils**: Pure helper functions in `src/utils/`

### File Pattern

```
src/
├── app/
│   ├── (auth)/login/page.tsx
│   ├── (auth)/register/page.tsx
│   ├── cart/page.tsx
│   ├── products/[id]/page.tsx
│   ├── products/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/{domain}/
├── services/{domain}.ts
├── context/store.ts
├── hooks/use{name}.ts
└── utils/{name}.ts
```

## Server (Django REST Framework)

### Conventions

- **App structure** — Each Django app follows a flat module pattern:
  ```
  apps/{app_name}/
  ├── __init__.py
  ├── apps.py
  ├── models/__init__.py
  ├── views/__init__.py
  ├── serializers/__init__.py
  ├── urls/__init__.py
  └── forms/__init__.py
  ```
- **Models**: Defined in `models/__init__.py` or split into submodules
- **Views**: DRF ViewSets or APIViews in `views/__init__.py`
- **Serializers**: DRF serializers in `serializers/__init__.py`
- **URLs**: Routers in `urls/__init__.py`
- **Config**: Project settings in `config/settings.py`
- **Middleware**: Custom middleware in `middleware/custom_middleware.py`
- **Utils**: Shared helpers in `utils/helpers.py`
- **Tests**: Pytest in `tests/` and app-level test files

## Code Style

- **Python**: PEP 8, Django REST Framework best practices
- **TypeScript/JSX**: Functional components, no class components
- **No comments in production code** unless explaining a complex workaround
- **Spanish**: Project name and business logic in Spanish; code (variables, functions) in English

## Development

```bash
# Start full stack
docker compose -f docker-compose-prod.yml up --build

# Stop
docker compose down

# Reset (with volume deletion)
docker compose down -v
```

## Environment Files

- `App/.env.dev` — Next.js environment variables
- `Server/.env.dev` — Django environment variables

## Opencode Agent Usage

This project has custom agents defined in `opencode.jsonc`:

- `@frontend` — For Next.js/Tailwind/Zustand tasks
- `@backend` — For Django REST tasks

Use them with: `opencode @frontend <task description>`
