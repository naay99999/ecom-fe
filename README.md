# E-commerce Frontend

A modern e-commerce web frontend built with React and Vite, covering product catalogs, search, cart, checkout, authentication, and customer account management.

## Tech Stack

- **Framework & Tooling:** React 19, Vite 8, React Router
- **State & Data Fetching:** TanStack Query, Zustand
- **UI & Styling:** Tailwind CSS 4, shadcn-style UI primitives, Lucide Icons
- **Testing & Quality:** Vitest, MSW (Mock Service Worker), ESLint

## Getting Started

### Prerequisites

Node.js (LTS recommended) and npm.

### Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

Configure `.env` based on `.env.example`:

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | Backend API base URL |
| `VITE_API_TIMEOUT_MS` | `10000` | Request timeout in milliseconds |
| `VITE_ENABLE_MSW` | `false` | Set to `true` to enable mock API in dev |

Mock handlers are located in `src/mocks/handlers.js`.

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build production bundle to dist/
npm run preview   # Preview production build locally
npm run test      # Run tests with Vitest
npm run lint      # Run ESLint check
```

## Project Structure

```text
src/
├── pages/          # Route-level page components
├── layouts/        # Layout wrappers (Root, Account, Checkout)
├── features/       # Domain-specific UI and business logic
├── components/ui/  # Reusable UI primitives
├── lib/            # API client, Query client, and utilities
├── mocks/          # MSW setup and mock handlers
├── router.js       # Route definitions
├── providers.jsx   # Context and app providers
└── styles/         # Global styles
```

## Routes Overview

| Section | Routes |
| --- | --- |
| **Catalog** | `/`, `/products`, `/products/:productId`, `/categories/:slug`, `/search` |
| **Orders** | `/cart`, `/checkout`, `/checkout/success` |
| **Auth** | `/login`, `/register`, `/forgot-password` |
| **Account** | `/account`, `/account/profile`, `/account/addresses`, `/account/orders`, `/account/orders/:orderId` |
| **General** | `/about`, `/contact` |

## Git Workflow

- `main` — Production branch (do not commit directly).
- `staging` — Pre-release QA and validation.
- `develop` — Active development and feature integration.

Branch naming: `feat/*`, `fix/*`, `hotfix/*`, `refactor/*`, `chore/*`.

```bash
git switch develop
git pull origin develop
git switch -c feat/<task-name>

# Validate changes before submitting PR
npm run test && npm run lint && npm run build
```

Promotion flow: `develop` → `staging` → `main`.

## Deployment

Run `npm run build` to generate the production-ready bundle in `dist/`. Deploy to any static hosting service with SPA fallback routing to `index.html`.
