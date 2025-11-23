const { verifyAccessToken } = require('../utils/generateToken');
const User = require('../models/User');
const { errorResponse } = require('../utils/formatResponse');
const { HTTP_STATUS } = require('../config/constants');


const protect = async (req, res, next) => {
  let token;

  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      
      token = req.headers.authorization.split(' ')[1];

      
      const decoded = verifyAccessToken(token);

      if (!decoded) {
        return errorResponse(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized, token failed');
      }

      
      req.user = await User.findById(decoded.id).select('-passwordHash');

      if (!req.user) {
        return errorResponse(res, HTTP_STATUS.UNAUTHORIZED, 'User not found');
      }

      next();
    } catch (error) {
      return errorResponse(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized, token failed');
    }
  }

  if (!token) {
    return errorResponse(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized, no token provided');
  }
};


const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return errorResponse(res, HTTP_STATUS.FORBIDDEN, 'Access denied. Admin only.');
  }
};

module.exports = { protect, adminOnly };
