# CashCraft Backend API

A comprehensive personal finance management REST API built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Authentication & Authorization** - JWT-based authentication with refresh tokens
- 💰 **Expense Tracking** - Create, read, update, and delete expenses with categorization
- 🎯 **Goal Management** - Set and track financial goals with progress monitoring
- 📊 **Budget Management** - Create monthly budgets and track spending by category
- 📈 **Insights & Analytics** - Get detailed spending insights and trends
- 📱 **Dashboard** - Comprehensive overview of financial health

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **Security:** bcryptjs for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cashcraft-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env
```

4. Update `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cashcraft
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

5. Start MongoDB service:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux with systemctl
sudo systemctl start mongodb

# Or run MongoDB directly
mongod
```

6. Seed the database with dummy data (optional):
```bash
npm run seed
```

This will create a demo user:
- **Email:** demo@cashcraft.com
- **Password:** password123

7. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Expense Endpoints

#### Create Expense
```http
POST /api/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50.00,
  "category": "Food & Dining",
  "date": "2024-01-15",
  "description": "Lunch at restaurant",
  "paymentMethod": "credit_card"
}
```

#### Get All Expenses
```http
GET /api/expenses?page=1&limit=20&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

#### Get Expense by ID
```http
GET /api/expenses/:id
Authorization: Bearer <token>
```

#### Update Expense
```http
PUT /api/expenses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 55.00,
  "description": "Updated description"
}
```

#### Delete Expense
```http
DELETE /api/expenses/:id
Authorization: Bearer <token>
```

### Goal Endpoints

#### Create Goal
```http
POST /api/goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Emergency Fund",
  "targetAmount": 10000,
  "currentAmount": 2000,
  "dueDate": "2024-12-31",
  "category": "savings",
  "priority": "high"
}
```

#### Get All Goals
```http
GET /api/goals?status=active
Authorization: Bearer <token>
```

#### Update Goal Progress
```http
PUT /api/goals/:id/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500
}
```

### Budget Endpoints

#### Set Budget
```http
POST /api/budgets
Authorization: Bearer <token>
Content-Type: application/json

{
  "month": "2024-01",
  "categoryBudgets": {
    "Food & Dining": 500,
    "Transportation": 200,
    "Shopping": 300
  }
}
```

#### Get Budget
```http
GET /api/budgets?month=2024-01
Authorization: Bearer <token>
```

#### Get Budget Progress
```http
GET /api/budgets/2024-01/progress
Authorization: Bearer <token>
```

### Insights Endpoints

#### Get Expenses by Category
```http
GET /api/insights/category?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

#### Get Daily Expenses
```http
GET /api/insights/daily?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

#### Get Monthly Expenses
```http
GET /api/insights/monthly?year=2024
Authorization: Bearer <token>
```

#### Get Expense Trends
```http
GET /api/insights/trends?month=2024-01
Authorization: Bearer <token>
```

### Dashboard Endpoints

#### Get Dashboard Data
```http
GET /api/dashboard
Authorization: Bearer <token>
```

#### Get Quick Stats
```http
GET /api/dashboard/stats
Authorization: Bearer <token>
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── validators/      # Request validation
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── .env.example         # Environment variables template
├── package.json         # Dependencies
└── README.md           # This file
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with dummy data

## Expense Categories

- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Education
- Travel
- Personal Care
- Groceries
- Rent
- Insurance
- Investments
- Others

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Rate limiting
- Input validation and sanitization
- CORS configuration
- MongoDB injection prevention

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication errors
- Database errors
- Not found errors
- Server errors

## License

ISC

## Support

For support, email support@cashcraft.com or open an issue in the repository.
