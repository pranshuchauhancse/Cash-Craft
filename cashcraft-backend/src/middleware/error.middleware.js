const { errorResponse } = require('../utils/formatResponse');
const { HTTP_STATUS } = require('../config/constants');
const { log } = require('../utils/logger');


const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(HTTP_STATUS.NOT_FOUND);
  next(error);
};


const errorHandler = (err, req, res, next) => {
  
  log.error(`${err.name}: ${err.message}`);
  
  let statusCode = res.statusCode === 200 ? HTTP_STATUS.INTERNAL_SERVER_ERROR : res.statusCode;
  let message = err.message;

  
  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Resource not found';
  }

  
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  
  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join(', ');
  }

  
  if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Token expired';
  }

  return errorResponse(
    res,
    statusCode,
    message,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : null
  );
};

module.exports = { notFound, errorHandler };
