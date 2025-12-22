# Inventory Allocation System - Backend

## System Minimum Requirements

General

- Node.js ≥ 20
- Yarn ≥ 1.22.10

## Dependencies

This project is built using:

- Node.js + Express + tsoa + Typescript + Postgres SQL + ORM (Sequelize) + Helmet (Basic security)

## Start development

Prerequisites:
Make sure, to install `yarn` as the package manager.
Make sure, to install DB management tools.

Install all dependencies (run if there's a new dependency added in `package.json`)

```bash
yarn
```

Before run a DB migration, please create your DB in the DB management tools installed e.g `pgAdmin4`. And then , run below command to conduct DB migration

```bash
npx sequelize-cli db:migrate
```

And run the development server:

```bash
yarn dev
```

Open [http://localhost:8000](http://localhost:8000) with your browser to see the result.

## Available Scripts

- `yarn dev` - Starts the development server

- `yarn build` - Builds the project

## Seed Database

This project includes seed scripts to initialize the PostgreSQL collections with **sample data** (for development)

## Contribute

Development Flow

1. Create a new branch based on dev:

```
git checkout -b feature/new-feature
```

2. Commit your changes with meaningful messages following git conventions.

3. Push your branch:

```
git push origin feature/new-feature
```

4. Create a Pull Request (PR) to merge your branch into dev.

5. Request code review and make necessary changes.

6. Merge the PR once approved.

# Inventory Allocation System - Frontend

## System Minimum Requirements

General

- Next.js
- Yarn ≥ 1.22.10

## Start development

Prerequisites:
Make sure, to install `yarn` as the package manager.
Make sure, to install DB management tools.

Install all dependencies (run if there's a new dependency added in `package.json`)

```bash
yarn
```

and then start development server, by running below command

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
---


# Design Decisions

## 1. Project Architecture

The project follows a **modular monolith** pattern, where each service has its own module containing:
```
src/
└─ v1/
└─ service-name/
├─ controller/
│ └─ service-name.controller.ts
├─ service/
│ └─ service-name.service.ts
└─ model/
└─ service-name.model.ts
```

### Why Modular Monolith?
- **Isolation:** Each service/module encapsulates its controller, service, and model logic.
- **Ease of maintenance:** Developers can work on individual services without touching unrelated modules.
- **Future scalability:** Allows gradual transition to microservices if needed (Only by adding package.json in each and follow Fig/Strangler pattern).

---

## 2. Frameworks & Libraries

| Layer                  | Technology / Library             | Reason                                                                 |
|------------------------|---------------------------------|------------------------------------------------------------------------|
| API & Routing          | Node.js + Express + Tsoa         | Tsoa generates OpenAPI-compliant routes, TypeScript types, and Swagger docs. |
| Database               | PostgreSQL + Sequelize ORM       | Sequelize provides a structured ORM with migrations and relations; PostgreSQL ensures reliable relational data storage. |
| Caching / Performance  | NodeCache (via `injectCache.middleware.ts`) | Simple in-memory caching for frequently accessed data per service. |
| Logging                | `logger.middleware.ts`           | Centralized logging for requests and errors.                           |
| Error Handling         | `errorHandler.middleware.ts`     | Consistent error formatting and response handling.                     |

---

## 3. Folder Structure

**Service module structure example (`service-name`):**

```

controller/ -> Handles API endpoints and Tsoa decorators.
service/ -> Business logic and orchestration.
model/ -> Sequelize model definitions.

```

**Middleware folder:**

```

middleware/
├─ errorHandler.middleware.ts
├─ logger.middleware.ts
└─ injectCache.middleware.ts

````

- `logger.middleware.ts` → Logs all incoming requests, useful for debugging and monitoring.
- `errorHandler.middleware.ts` → Centralized error formatting for consistent API responses.
- `injectCache.middleware.ts` → Implements in-memory caching using NodeCache.

---

## 4. Tsoa Design

- **Controllers** are decorated with `@Route`, `@Tags`, and `@Response`.
- **Models/DTOs** are typed with TypeScript and used to validate request/response contracts.
- **OpenAPI docs** are generated automatically from Tsoa decorators, reducing manual Swagger maintenance.

Example:

```ts
@Route("warehouse")
export class WarehouseController extends Controller {
  @Get("{id}")
  public async getUser(@Path() id: string): Promise<User> {
    return this.warehouseervice.getById(id);
  }
}
````

---

## 5. Sequelize Models

- Each module defines its **own Sequelize models**, encapsulated per service.
- Relations can be defined across modules if needed (e.g., `hasMany`, `belongsTo`).
- Migrations and seeds are handled globally per project to maintain database consistency.

---

## 6. Caching

- `injectCache.middleware.ts` caches common query results in memory for quick retrieval.
- **NodeCache** is service-local, meaning cache is **not shared across instances**.
- Can be replaced with **Redis** when horizontal scaling or distributed cache is needed.

---

## 7. Error Handling & Logging

- All errors flow through `errorHandler.middleware.ts`.
- Logs are recorded using `logger.middleware.ts` for audit, debugging, and monitoring.
- Response format is standardized:

```json
{
  "status": "error",
  "message": "Detailed error message",
  "code": 400,
  "type": "ERROR_TYPE",
  "path": "URL_PATH"
}
```

---

## 8. Scaling Strategy

Although the app is a **modular monolith**, horizontal scaling is possible:

1. **Multiple Node.js instances** behind a **load balancer** (e.g. Nginx).
2. **Shared database**: PostgreSQL handles concurrent connections from multiple instances.
3. **Cache layer**:

   - Replace NodeCache with Redis or Memcached for distributed caching across instances.

4. **Stateless services**: Ensure no service-local state is required for requests; all state is in DB or distributed cache.
5. **Deployment**: Containerized each instance for consistent environment replication and orchestrated by Kubernetes or GKE or OpenShift.

💡 This allows each service to scale horizontally without changing the modular monolith codebase.

---

## 9. Future Considerations

- **Microservices migration:** Individual modules can be extracted as standalone services once traffic or complexity increases.
- **Event-driven communication:** For scaling services without tight coupling, consider adding message queues (e.g., RabbitMQ or Kafka or EventEmitter EventBus node-built-in).
- **Monitoring & Metrics:** Integrate NewRelic, Prometheus, Grafana, or ELK stack for observability.

# Possible improvements

## Backend

1. Unit Testing.
2. Component Testing.
3. Contract Testing.
4. Integration Testing.
5. Observability Testing (Redact PII logs, or any sensitive data to be stored in distributed tracing).
6. pre-commmit hooks, pre-push hooks to run checks.
7. SAST & DAST local checks (Unfeasible due to current system limitation that i have e.g my own laptop).
8. External integration with FOOM must be decoupled using Event Driven and leverage dlq db-based to pickup failed created resource and handle exponential backoff.
9. Integration layer sitting in front of BE services to integrate with FOOM external.
10. Circuit Breaker handling Resiliency Pattern.
11. Security Definitions under controller
12. Basic Security Headers for FE e.g CSP.
13. API Rate limiter.
14. Transformer and Business Enricher e.g by POJO before on DTO-like and DAO-like.
15. Enhance type by Strongly typed and moved common type to types.
16. Self Healing feature on services
17. Wrapper response for more Standart Message/Response structure.
18. To enable CI/CD for example Jenskinsm, All configurations files needed to be store in configuration-branch and to handle each flavor/env need to be stored in deployment-branch
19. Code Coverage on testing cover 70-80% on statements, lines, functions, branches.
20. Design Documentation on Document Platform like Gitlab Wiki or Confluence.
21. MOST IMPORTANTLY, service for health-check.

## Frontend

1. pre-commmit hooks, pre-push hooks to run checks and code formatting.
2. i18n usage instead of string hardcode.
3. Use a atomic state management e.g recoil or zustand
4. Use SWR for client caching
5. Offline first application on Networking Layer, e.g queue API called in each pages and retry on connectivity
6. Handle connectivity issues.
7. Handle Form validation "much better" by leveraging perhaps Yup.
8. Avoid inline styles
9. Implement basic security headers on FE server e.g Nginx or Apache.
10. On deployment will be much better if we have a compression, deploy using http2, and then handling content-negotiation, DB routing redirection.
11. UI testing automation test using Cypress for E2E and Jest for Unit testing.
12. Using React Testing Library.
13. Code Coverage on testing cover 70-80% on statements, lines, functions, branches.
14. Design Documentation on Document Platform like Gitlab Wiki or Confluence.
