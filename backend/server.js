// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const connectDB = require('./backend/config/db'); // Assuming db.js connects your DB
const errorHandler = require('./backend/middleware/errorHandler');

// Initialize the Express app
const app = express();

// --- 1. Connect Database ---
connectDB();

// --- 2. Middleware ---
// Body parser for JSON data
app.use(express.json());

// --- 3. Routes ---
// Import and use your route files
app.use('/api/auth', require('./backend/routes/auth')); // e.g., for login/register
app.use('/api/expenses', require('./backend/routes/expenses')); // e.g., for expense CRUD
// Add other routes here (budgets, goals, etc.)

// --- 4. Error Handling Middleware (MUST be the last middleware) ---
app.use(errorHandler);

// --- 5. Start Server ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Optional: Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});