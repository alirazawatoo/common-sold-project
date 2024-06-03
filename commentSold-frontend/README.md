# Stockroom admin

React 19 admin for Stockroom, built with Vite and MUI. The repository
[README](../README.md) covers the product and the Docker Compose setup; this
file is the short version for working on the admin alone.

```bash
cp .env.example .env   # VITE_API_BASE_URL, e.g. http://localhost:5000/api/v1/
npm install
npm run dev            # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build into `build/` |
| `npm test -- --run` | Vitest + Testing Library, API modules mocked |
| `npm run lint` | ESLint with the react, react-hooks and jsx-a11y plugins |

Layout: `src/api/` (axios client and one module per resource), `src/components/`
(shared UI such as the table, form and dialogs), `src/container/` (one folder per
page), `src/utils/` (hooks, formatting, validation, constants) and `src/theme.js`
(palette and type). In Docker the build is served by nginx (`nginx.conf`), which
also proxies `/api/` to the API.
