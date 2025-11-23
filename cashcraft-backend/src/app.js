const express = require('express');
const cors = require('cors');
const { logger } = require('./utils/logger');
const { notFound, errorHandler } = require('./middleware/error.middleware');
const rateLimit = require('./middleware/rateLimit.middleware');


const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const expenseRoutes = require('./routes/expense.routes');
const goalRoutes = require('./routes/goal.routes');
const budgetRoutes = require('./routes/budget.routes');
const insightRoutes = require('./routes/insight.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const connectDB = require('../db/connect');



const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);


app.use(rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
}));


app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CashCraft API is running',
    timestamp: new Date().toISOString()
  });
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/test", require("./routes/testroute"));


app.use(notFound);
app.use(errorHandler);

module.exports = app;
