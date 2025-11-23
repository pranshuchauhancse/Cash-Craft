require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { log } = require('./utils/logger');

const PORT = process.env.PORT || 5000;


connectDB();


const server = app.listen(PORT, () => {
  log.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});


process.on('unhandledRejection', (err) => {
  log.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});


process.on('uncaughtException', (err) => {
  log.error(`Uncaught Exception: ${err.message}`);
  server.close(() => process.exit(1));
});


process.on('SIGTERM', () => {
  log.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    log.info('HTTP server closed');
    process.exit(0);
  });
});
