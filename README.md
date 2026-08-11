# Recipe App

A simple recipe management app with a Node.js/TypeScript backend and Angular 17 frontend.

## Project Structure

```
squad-recipe-app/
├── backend/         # Node.js + TypeScript REST API
│   ├── src/
│   │   ├── controllers/   recipe-controller.ts
│   │   ├── services/      recipe-service.ts
│   │   ├── repositories/  recipe-repository.ts  (file-based storage)
│   │   ├── models/        recipe.ts
│   │   ├── server.ts
│   │   └── index.ts
│   ├── data/              recipes.json  (auto-created on first run)
│   └── package.json
└── frontend/        # Angular 17 app
    └── src/app/
        ├── components/
        │   ├── recipe-list/
        │   └── add-recipe/
        ├── services/  recipe.service.ts
        └── models/    recipe.ts
```

## Running the App

### Backend

```bash
cd backend
npm install
npm run dev        # ts-node dev mode
# or
npm run build && npm start   # compiled
```

API runs on **http://localhost:3000**

Endpoints:
- `GET  /api/recipes`  — list all recipes
- `POST /api/recipes`  — create a recipe `{ name, ingredients }`
- `PUT  /api/recipes/:id` — update a recipe `{ name, ingredients }`

OpenAPI docs:
- `GET /api-docs` — Swagger UI
- `GET /openapi.json` — raw OpenAPI document

### Frontend

```bash
cd frontend
npm install
npm start          # ng serve → http://localhost:4200
```
