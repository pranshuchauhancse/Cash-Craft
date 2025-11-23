const morgan = require('morgan');


morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});


const morganFormat = ':method :url :status :response-time ms - :res[content-length]';


const logger = morgan(morganFormat, {
  skip: (req, res) => {
    
    return process.env.NODE_ENV === 'test';
  }
});


const log = {
  info: (message) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  },
  error: (message) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  },
  warn: (message) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
  },
  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`);
    }
  }
};

module.exports = { logger, log };
