# Stockroom API

Express 5 + Sequelize API for the Stockroom admin. The repository
[README](../README.md) covers the product, the endpoints and the Docker Compose
setup; this file is the short version for working on the API alone.

```bash
cp .env.example .env   # MySQL connection and JWT_SECRET
npm install
npm run seed           # create tables, load the fictional demo shop if empty
npm run dev            # http://localhost:5000, restarts on change
```

| Script | What it does |
| --- | --- |
| `npm start` | Start the API |
| `npm run dev` | Start with `node --watch` |
| `npm run seed` | Create tables and load demo data into an empty database (`-- --reset` wipes it first) |
| `npm test` | Unit and HTTP tests that need no database |
| `npm run test:db` | Tests against MySQL; they reset the database, so use a throwaway one |
| `npm run lint` | ESLint |

Layout: `config/` (app factory, database settings), `models/` (Sequelize
models), `modules/` (one folder per resource: router + controller), `utils/`
(validation, JWT guard, query helpers), `seed/` and `tests/`.
