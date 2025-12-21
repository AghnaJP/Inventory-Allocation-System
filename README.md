# Inventory Allocation System

A full-stack inventory management system with automated purchase request workflow and webhook integration for supplier communication.

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **ORM**: Sequelize
- **API Client**: Axios
- **Containerization**: Docker & Docker Compose

### Frontend
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI Library**: Material UI v7
- **State Management**: React Hooks
- **API Client**: Axios

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- ngrok (for webhook testing)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/AghnaJP/Inventory-Allocation-System.git
   cd Inventory-Allocation-System
   ```

2. **Setup environment variables**
   
   **Root `.env`:**
   ```env
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    DB_HOST=your_db_host
    DB_PORT=your_db_port


    NEXT_PUBLIC_API_URL=http://your-backend-host:your-backend-port/api
   ```
   
   **Backend `.env`:**
   ```env
    PORT=YOUR_BACKEND_PORT
    DATABASE_URL=postgres://your_db_user:your_db_password@your_db_host:your_db_port/your_db_name
    FOOM_SECRET_KEY=<YOUR_SECRET_KEY>
    FOOM_HUB_URL=<YOUR_FOOM_HUB_ENDPOINT>
   ```
   
   **Frontend `.env`:**
   ```env
   NEXT_PUBLIC_API_URL=http://your-backend-host:your-backend-port/api
   ```

3. **Build and start services with Docker Compose**
   ```bash
   docker compose up -d --build
   ```

   To see logs:
    ```bash
    docker compose logs -f backend
    docker compose logs -f frontend
    ```

4. **Run database migrations**
   ```bash
   docker compose exec backend npx sequelize-cli db:migrate
   ```

5. **Seed sample data**
   ```bash
   docker compose exec backend npx sequelize-cli db:seed:all
   ```

6. **Access the application**
    Also can check is container running and check ports
   ```bash
   docker compose ps
   ```

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

7. **Webhook Testing Setup**
    - **Start ngrok** (for receiving FOOM webhooks)
    ```bash
    ngrok http 8000
    ```

    - **Configure webhook URL in FOOM dashboard**
    - URL: `https://your-ngrok-url.ngrok.io/api/webhook/receive-stock`
    - Add your FOOM secret key to backend `.env`

---

## Reset Database (Optional)

If you want to reset the database completely:

```bash
docker compose down -v
docker compose up -d --build
docker compose exec backend npx sequelize-cli db:migrate
docker compose exec backend npx sequelize-cli db:seed:all
```

---

## 📝 Notes

* Make sure **Docker & Docker Compose** are installed.
* All services (frontend, backend, database) run inside Docker containers.
* Do **not** run `sequelize-cli` directly on your host machine.

---

## 🏗 Design Decisions

### Core Logic & Architecture

#### 1. Purchase Request State Machine

```
DRAFT -> PENDING -> COMPLETED
          -> REJECTED
```

**Rules:**
- **DRAFT**: Can edit, delete, or submit
- **PENDING**: Cannot modify (being processed)
- **COMPLETED**: Read-only (stock updated)
- **REJECTED**: Read-only (supplier rejected)


#### 2. Idempotency Implementation

```javascript
if (purchaseRequest.status === 'COMPLETED') {
  throw new Error('Purchase request is already completed');
}
```

**Prevents:**
- Duplicate stock additions if webhook is received twice
- Race conditions from concurrent webhook calls
- Data integrity issues

**Trade-off**: 
- Uses last-write-wins strategy. For production, i would consider adding a processed webhook ID table.

#### 3. Transaction Management (ACID)

```javascript
await sequelize.transaction(async (t) => {
  // All database operations use transaction: t
  await purchaseRequest.update({...}, { transaction: t });
  await PurchaseRequestItem.bulkCreate([...], { transaction: t });
});
```

**Benefits:**
- ACID

#### 4. Service Layer Pattern

```
Request → Route → Controller → Service → Database
```

**Separation of Concerns:**
- **Routes**: HTTP routing
- **Controllers**: Request/response handling
- **Services**: Business logic and database operations
- **Models**: Data structure and relationships

**Benefits:**
- Testability: Services can be unit tested
- Reusability: Services can be called from multiple controllers
- Maintainability: Clear responsibility boundaries

#### 5. Reference Number Generation

```javascript
const reference = `PR${Date.now().toString().slice(-5)}`;

const purchaseRequest = await PurchaseRequest.create({
  reference,
  warehouse_id,
  status: 'DRAFT',
  vendor: vendor || null
}, { transaction: t });

```

**Format**: PR12345 (last 5 digits of timestamp, unique per request)
Trade-off:
Never inserts null → avoids notNull violation
Concurrent-safe → multiple requests can be created at the same time
Not strictly sequential like PR00001, PR00002
Alternative for sequential numbers: use a database sequence or UUID with prefix

## 🚀 Possible Improvements

1. **Authentication & Authorization**
   - Implement JWT-based authentication
   - Role-based access control (Admin, Manager, User)
   - Protect sensitive endpoints

2. **Webhook Retry Mechanism**
   - Queue failed webhook calls

3. **Audit Trail**
   - Log all state changes with timestamps
   - Track who made changes (requires auth)
   - Store webhook payloads for debugging

4. **Export Functionality**
   - Export stock reports to CSV/Excel
   - Generate PDF purchase orders
   - Email reports on schedule

5. **Multi-language Support**
    - Internationalization (i18n)

6. **Testing**
    - Unit tests for services (Jest)
    - Integration tests for API endpoints

7. **CI/CD Pipeline**
    - Automated testing on PR
    - Automatic deployment to development staging production if exists

8. **Database Optimization**
    - Add indexes for common queries
    - Implement database connection pooling

9. **Caching**

10. **API Rate Limiting**

11. **Documentation**
    - OpenAPI/Swagger for endpoints

12. **Monitoring & Alers**
    - Example: Sentry, Prometheus

---
