# Product Operations Dashboard

A full-stack inventory and product-management application with an Express/Sequelize API and a React administration interface. The project combines authenticated access, product CRUD, inventory and order views, validation, paginated tables, responsive UI states, and component tests.

## Architecture

```text
React admin client
commentSold-frontend
        |
        | JSON API
        v
Express modules
commonSold-backend
        |
        v
Sequelize + MySQL
```

## Implemented areas

- Login flow and protected dashboard navigation
- Product listing, creation, editing, and deletion
- Inventory and order views
- Form validation and reusable field components
- Paginated data tables, filters, loading skeletons, modals, and toast feedback
- Sequelize models for users, products, inventory, and orders
- Modular backend controllers and routers
- React component and container test source

## Repository layout

```text
commonSold-backend/
├── config/        # Express and database setup
├── models/        # Sequelize domain models
├── modules/       # Auth, products, inventory, and orders
└── routes/        # API composition

commentSold-frontend/
└── src/
    ├── api/        # HTTP clients
    ├── components/ # Reusable table and form UI
    ├── container/  # Product, inventory, order, and login screens
    └── __tests__/  # Component and workflow coverage
```

## Local setup

### Backend

```bash
git clone https://github.com/alirazawatoo/common-sold-project.git
cd common-sold-project/commonSold-backend
npm install
node app.js
```

The backend requires a MySQL database and local environment configuration. Review `config/db.js`, the environment references, and the seed/setup expectations before supplying credentials.

### Frontend

```bash
cd ../commentSold-frontend
npm install
npm start
```

The frontend must be configured to reach the backend API expected by the files under `src/api`.

## Tests

```bash
cd commentSold-frontend
npm test
```

The tracked frontend suite covers shared components plus login, product, inventory, and order containers. The backend package currently has no implemented test command. No test result is claimed here because dependencies were not installed or executed during review.

## Design and security boundaries

- The two applications retain assessment-era package metadata and repository references; provenance should be preserved when republishing or extending the work.
- Database and token configuration must come from local secrets rather than documentation examples.
- The backend lacks an automated behavior suite.
- Authentication, authorization, validation, and API error semantics require runtime verification before deployment.
- Product images, inventory quantities, and order transitions should be validated consistently at both API and UI boundaries.

## Next improvements

1. Add a root workspace command or Compose setup only if repeatable onboarding becomes important.
2. Add backend request tests for authentication and product ownership rules.
3. Centralize environment validation and sanitize all example configuration.
4. Document the exact product/inventory/order state transitions with API examples.
