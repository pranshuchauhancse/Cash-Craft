# CashCraft Backend - Architecture & Working Explanation

## 📋 Overview
CashCraft Backend is a **RESTful API** built with **Node.js + Express.js** that manages personal finance data. It provides endpoints for user authentication, expense tracking, budget management, goal setting, and financial insights. The backend connects to **MongoDB Atlas** (cloud database) for data persistence.

---

## 🏗️ Architecture Layers

### 1. **Entry Point** (`src/server.js`)
- Loads environment variables from `.env` file
- Initializes Express app
- Connects to MongoDB
- Starts HTTP server on port 5000
- Handles graceful shutdown and error handling

### 2. **Application Setup** (`src/app.js`)
Configures the Express application with:
- **CORS Middleware**: Allows frontend (port 3000) to communicate with backend (port 5000)
- **Body Parser**: Parses JSON request bodies
- **Logger Middleware**: Logs all incoming requests
- **Rate Limiting**: Restricts 100 requests per IP per 15 minutes (prevents abuse)
- **Routes**: Registers all API route modules
- **Error Handling**: Global error middleware catches and formats errors

### 3. **Database Connection** (`db/connect.js`)
```
MongoDB Atlas Cloud ← Connection ← Backend
```
- Connects to MongoDB Atlas using connection string (credentials in `.env`)
- Uses Mongoose ODM for schema validation and querying
- Async/await pattern with try-catch error handling

---

## 🔐 Key Modules

### **A. Authentication System** (`src/controllers/auth.controller.js`)

#### User Registration (`POST /api/auth/register`)
```
1. Receive: name, email, password
2. Validate: Check if email already exists
3. Hash: Password hashed with bcryptjs (10 salt rounds)
4. Create: Save user to MongoDB
5. Generate: Access Token (JWT, 7 days) + Refresh Token (JWT, 30 days)
6. Return: User data + tokens to frontend
```

#### User Login (`POST /api/auth/login`)
```
1. Receive: email, password
2. Find: User in database
3. Verify: Compare entered password with stored hash
4. Generate: New JWT tokens
5. Return: User data + access token (for subsequent API calls)
```

#### Token Management
- **Access Token**: Short-lived (7 days), used for API authentication
- **Refresh Token**: Long-lived (30 days), used to get new access tokens
- **JWT Structure**: Contains user ID, issued time, expiration time

### **B. Models** (Database Schemas)

#### **User Model** (`src/models/User.js`)
```javascript
{
  name: String,
  email: String (unique),
  passwordHash: String (hashed),
  avatar: String,
  currency: String (default: 'INR'),  // ← Indian Rupee
  settings: {
    notifications: Boolean,
    budgetAlerts: Boolean,
    goalReminders: Boolean
  },
  role: String ('user' or 'admin'),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### **Expense Model** (`src/models/Expense.js`)
```javascript
{
  user: ObjectId (reference to User),
  amount: Number,
  category: String (enum: Food, Transport, Shopping, etc.),
  date: Date,
  description: String,
  paymentMethod: String (cash, credit_card, debit_card, upi),
  tags: [String],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```
- **Indexes**: On (user, date) and (user, category) for fast queries

#### **Goal Model** (`src/models/Goal.js`)
```javascript
{
  user: ObjectId,
  title: String,
  description: String,
  targetAmount: Number,
  currentAmount: Number,
  dueDate: Date,
  category: String,
  priority: String (high/medium/low),
  status: String (active/completed)
}
```

#### **Budget Model** (`src/models/Budget.js`)
```javascript
{
  user: ObjectId,
  month: String (YYYY-MM format),
  categoryBudgets: Map {
    "Groceries": { allocated: 5000, spent: 2300 },
    "Transport": { allocated: 2000, spent: 1500 }
  }
}
```

---

## 🛣️ API Routes & Endpoints

### **1. Authentication Routes** (`/api/auth`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/register` | Create new user account |
| POST | `/login` | Authenticate user, get tokens |
| GET | `/me` | Get current logged-in user (protected) |
| POST | `/logout` | Logout (client-side token removal) |
| POST | `/refresh-token` | Get new access token using refresh token |

### **2. Expense Routes** (`/api/expenses`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/` | Create new expense (protected) |
| GET | `/` | List all expenses with pagination/filters |
| GET | `/:id` | Get single expense details |
| PUT | `/:id` | Update expense |
| DELETE | `/:id` | Delete expense |

**Query Parameters**: `page`, `limit`, `startDate`, `endDate`, `category`

### **3. Goal Routes** (`/api/goals`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/` | Create financial goal |
| GET | `/` | List all goals |
| PUT | `/:id/progress` | Update goal progress |
| DELETE | `/:id` | Delete goal |

### **4. Budget Routes** (`/api/budgets`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/` | Set monthly budget |
| GET | `/` | Get budget for month |
| GET | `/:month/progress` | View spending vs budget |

### **5. Insights Routes** (`/api/insights`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/category` | Expenses grouped by category |
| GET | `/daily` | Daily expense trends |
| GET | `/monthly` | Monthly expense trends |
| GET | `/trends` | Spending patterns & analytics |

### **6. Dashboard Routes** (`/api/dashboard`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Comprehensive dashboard data |
| GET | `/stats` | Quick financial statistics |

---

## 🔒 Middleware Stack

### **1. CORS Middleware**
```javascript
Allows: http://localhost:3000 (frontend)
Credentials: true (sends cookies/auth headers)
```
Prevents cross-origin security issues between frontend and backend.

### **2. Authentication Middleware** (`src/middleware/auth.middleware.js`)
```javascript
if (route is protected) {
  1. Extract JWT from Authorization header
  2. Verify JWT signature using JWT_SECRET
  3. Decode token → get user ID
  4. Attach user to request object
  5. Proceed to controller
  OR return 401 Unauthorized
}
```

### **3. Validation Middleware** (`src/middleware/validate.middleware.js`)
Uses `express-validator` to:
- Check required fields
- Validate email format
- Ensure password length ≥ 6 characters
- Validate numeric fields
- Return 400 Bad Request if validation fails

### **4. Rate Limiting Middleware** (`src/middleware/rateLimit.middleware.js`)
- **Limit**: 100 requests per IP
- **Window**: 15 minutes
- **Purpose**: Prevent DDoS/brute force attacks

### **5. Error Handling Middleware** (`src/middleware/error.middleware.js`)
```javascript
All errors are caught and formatted as:
{
  success: false,
  message: "Error description",
  errors: [detailed error info]
}
Returns appropriate HTTP status: 400, 401, 403, 404, 500, etc.
```

---

## 📊 Request-Response Flow Example: Create Expense

```
Frontend (http://localhost:3000)
         ↓ (POST /api/expenses)
Proxy (react-scripts dev server)
         ↓ (Forwards to http://localhost:5000)
Backend (Express Server - port 5000)
    ↓ CORS Middleware (allowed origin check)
    ↓ Body Parser (parse JSON)
    ↓ Authentication Middleware (verify JWT)
    ↓ Validation Middleware (validate fields)
    ↓ Route Handler (/api/expenses POST)
    ↓ Controller (expense.controller.js)
       - Create expense object
       - Save to MongoDB
       - Return created expense + 201 status
    ↓ MongoDB Atlas (store data)
Response: {
  success: true,
  message: "Expense created successfully",
  data: { id, amount, category, date, ... }
}
         ↑ (JSON response)
Frontend displays the new expense
```

---

## 🗄️ Database Structure

### Collections in MongoDB
1. **users** - Stores user accounts and preferences
2. **expenses** - Stores all expense transactions
3. **goals** - Stores financial goals
4. **budgets** - Stores monthly budget allocations
5. **refreshtokens** - Stores refresh token blacklist (optional)

### Indexes for Performance
- `expenses.user_date` - Fast queries by user + date range
- `expenses.user_category` - Fast filtering by category
- `goals.user` - Fast goal retrieval per user
- `users.email` - Unique email constraint

---

## 🔑 Environment Configuration (`.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://cashcraft_db:Cashcraft4@cashcraft.c3z4ijs.mongodb.net/cashcraft

# JWT
JWT_SECRET=cashcraft_super_secret_jwt_key_2024_change_this_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=cashcraft_refresh_token_secret_2024_change_this
JWT_REFRESH_EXPIRE=30d

# CORS
CLIENT_URL=http://localhost:3000
```

---

## 🧪 Testing & Data Management

### Seed Database
```bash
npm run seed
```
Creates:
- Demo user: `demo@cashcraft.com / password123`
- 90 sample expenses (3 months)
- 3 financial goals
- Monthly budget with categories

### API Health Check
```bash
GET http://localhost:5000/health
Response: { success: true, message: "CashCraft API is running", ... }
```

---

## 🚀 Deployment Checklist

- [ ] Change JWT_SECRET and JWT_REFRESH_SECRET to strong random keys
- [ ] Set NODE_ENV=production
- [ ] Update CLIENT_URL to production frontend domain
- [ ] Configure MongoDB Atlas network access (whitelist production IP)
- [ ] Add SSL/HTTPS certificate
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for MongoDB
- [ ] Use environment variables for all sensitive data
- [ ] Implement request logging and error tracking

---

## 📈 Performance Optimizations

1. **Database Indexes**: Composite indexes on frequently queried fields
2. **Rate Limiting**: Prevents abuse and DDoS attacks
3. **JWT Authentication**: Stateless auth (no session database needed)
4. **Pagination**: Expenses endpoint supports limit/offset
5. **Caching**: Can be added for insights/dashboard queries
6. **Compression**: gzip compression can be enabled on responses

---

## 🛡️ Security Features

1. **Password Hashing**: Bcryptjs with 10 salt rounds
2. **JWT Tokens**: Signed with secret key, time-limited
3. **CORS Protection**: Whitelist frontend origin
4. **Rate Limiting**: 100 requests per 15 minutes per IP
5. **Input Validation**: All inputs validated before processing
6. **Error Handling**: Generic error messages (no sensitive info leaked)
7. **MongoDB Injection Prevention**: Mongoose schema validation

---

## 🔄 Technology Stack Summary

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| Password Hashing | Bcryptjs |
| Validation | express-validator |
| Rate Limiting | express-rate-limit |
| Logging | Morgan + Custom logger |

---

## 📝 Key Concepts for Viva

### Q1: How does authentication work?
**A**: Users register/login with email & password. Password is hashed with bcryptjs. On successful login, JWT tokens (access + refresh) are generated and sent to frontend. Frontend stores tokens in localStorage. For protected endpoints, JWT is verified via middleware before allowing access.

### Q2: How is data persisted?
**A**: All data (users, expenses, goals, budgets) is stored in MongoDB Atlas cloud database. Mongoose provides schema validation and query methods. Each user's data is isolated using user ID references.

### Q3: How does the frontend communicate with backend?
**A**: Frontend (React on port 3000) uses proxy configured in package.json to forward `/api/*` requests to backend (port 5000). This avoids CORS issues in development. In production, frontend and backend can be on the same domain.

### Q4: What is rate limiting used for?
**A**: Rate limiting prevents abuse by restricting each IP to 100 requests per 15 minutes. This protects against brute force attacks, DDoS, and unintended abuse.

### Q5: How are expenses tracked efficiently?
**A**: Database indexes on (user, date) and (user, category) make queries fast. Pagination limits results, and filters allow users to query by date range and category.

---

## 📊 Sample API Calls for PPT

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```
**Response includes**: accessToken, refreshToken, user data

### 3. Create Expense
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{
    "amount": 500,
    "category": "Groceries",
    "date": "2025-11-20",
    "description": "Weekly groceries",
    "paymentMethod": "credit_card"
  }'
```

### 4. Get Dashboard Data
```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer <accessToken>"
```

---

**End of Backend Architecture Explanation**

---

## 🔬 Deep Dive — Technical Details

### 1) Request lifecycle (detailed sequence)

1. Browser sends request to React frontend (or mobile app). In development the CRA dev-server proxies `/api/*` to `http://localhost:5000`.
2. Express receives the request in `src/app.js` and executes middlewares in order:
   - `cors()` validates origin and handles preflight
   - `express.json()` parses body into `req.body`
   - `logger` records method, path, duration and status (useful for latency metrics)
   - `rateLimit` checks client's IP request count
3. Router resolves path and attached route-level validation middleware runs (`express-validator`).
4. If route is protected, `auth.middleware` checks `Authorization: Bearer <token>`:
   - `jwt.verify(token, JWT_SECRET)` → attaches `{ id }` to `req.user`
5. Controller receives validated input and performs DB operations via Mongoose models.
6. Controller returns JSON response; `res.json()` formats it.
7. If any error is thrown, `error.middleware` normalizes the error and returns an appropriate HTTP status code.

Sequence (ASCII):

Browser --> Frontend --> Proxy --> Express
Express --> [CORS, JSON, Logger, RateLimit]
Express --> Router --> Validation --> Auth --> Controller --> Mongoose --> MongoDB

### 2) Example: JWT generation (concise)

```javascript
const jwt = require('jsonwebtoken');

function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
}

function verifyAccessToken(token) {
  try { return jwt.verify(token, process.env.JWT_SECRET); }
  catch (err) { return null; }
}
```

### 3) Aggregation example: monthly expenses by category (insights)

This is a typical aggregation pipeline used by `insight.service.js` or controller:

```javascript
db.expenses.aggregate([
  { $match: { user: ObjectId('<USER_ID>'), date: { $gte: ISODate('2025-11-01'), $lte: ISODate('2025-11-30') } } },
  { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
  { $sort: { total: -1 } }
]);
```

Include projections and `$project` stages when you need formatted output for charts.

### 4) Transactions (when to use)

Use MongoDB transactions for multi-document consistency (e.g., moving funds between accounts, or complex budget updates that must be atomic). Example with Mongoose:

```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  await Expense.create([expenseDoc], { session });
  await Budget.updateOne({ _id: budgetId }, { $inc: { 'categoryBudgets.Groceries.spent': expenseAmount } }, { session });
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}
```

Transactions cost more; use them sparingly for operations that cannot tolerate partial completion.

### 5) Indexes & Mongo shell commands

Create indexes that match query patterns. In mongo shell or migration script:

```javascript
db.expenses.createIndex({ user: 1, date: -1 });
db.expenses.createIndex({ user: 1, category: 1 });
db.users.createIndex({ email: 1 }, { unique: true });
```

Monitor index usage with Atlas UI or `db.collection.getIndexes()` and profiling.

### 6) Performance & scaling notes

- Use pagination (skip/limit or better: range-based pagination using `_id` or date) to avoid high `skip` costs.
- For heavy read queries (insights), consider pre-aggregation jobs that write to a `materialized_insights` collection and invalidate on writes.
- Add a Redis cache for frequent small queries (e.g., user settings, currency rates).
- Tune Mongoose connection pool via options in `mongoose.connect()` for higher concurrency.

### 7) Dockerfile (example)

```dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "src/server.js"]
```

### 8) CI/CD (simple pipeline outline)

1. On push to `main`: run `npm test`, `eslint`, `npm run build` (frontend), and `npm run lint`.
2. If tests pass, build Docker image, push to registry.
3. Deploy to staging environment for manual smoke tests.
4. Promote to production with database migration step and environment variable rotation.

### 9) Monitoring & alerts

- Use Application Performance Monitoring (APM) like Datadog/NewRelic or MongoDB Cloud Profiler.
- Monitor: request latency (p50/p95/p99), error rate, DB connections, CPU and memory.
- Alerts: trigger on 5xx rate > 5% for 10 minutes, DB connections near max pool, or queue backlog.

### 10) Security hardening checklist (practical)

- Move secrets to a secure store (AWS Secrets Manager / Azure Key Vault / Vault).
- Enforce TLS between app and DB (Atlas supports TLS by default).
- Rotate JWT and DB credentials periodically.
- Use HTTP-only, secure cookies for refresh tokens to prevent XSS theft.
- Harden rate limits for auth endpoints; add IP-based throttling for suspicious activity.
- Sanitize inputs and avoid building raw queries from user input.

### 11) Test matrix & recommended commands

- Unit tests: controllers and services (Jest) — run `npm test`
- Integration tests: start test DB (mongodb-memory-server) and run endpoint tests
- Manual smoke tests (post-deploy):
  - `GET /health` → 200
  - Register → Login → Create Expense → List Expense

---

## 🎤 Speaker Notes & Slide Suggestions

- Slide 1: System Overview — show browser → frontend → backend → DB diagram
- Slide 2: Request Flow — list middleware sequence and JWT check
- Slide 3: Data Model — show `User`, `Expense`, `Budget` schemas and indexes
- Slide 4: Key Code Samples — JWT generation, aggregation pipeline, transaction sample
- Slide 5: Security & Scaling — bullets for production hardening and scaling plan
- Slide 6: Demo Plan — seed DB, login, create expense, open Compass to show data

Keep each slide short: 3–5 bullets, and use speaker notes with one-sentence explanations.
