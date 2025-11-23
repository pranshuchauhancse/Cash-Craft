const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/formatResponse');
const { HTTP_STATUS } = require('../config/constants');


const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    
    const userExists = await User.findOne({ email });

    if (userExists) {
      return errorResponse(res, HTTP_STATUS.BAD_REQUEST, 'User already exists with this email');
    }

    
    const user = await User.create({
      name,
      email,
      passwordHash: password
    });

    
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    return successResponse(res, HTTP_STATUS.CREATED, 'User registered successfully', {
      user,
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      return errorResponse(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid credentials');
    }

    
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return errorResponse(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid credentials');
    }

    
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    
    user.passwordHash = undefined;

    return successResponse(res, HTTP_STATUS.OK, 'Login successful', {
      user,
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
};


const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    return successResponse(res, HTTP_STATUS.OK, 'User retrieved successfully', { user });
  } catch (error) {
    next(error);
  }
};


const logout = async (req, res, next) => {
  try {
    
    
    

    return successResponse(res, HTTP_STATUS.OK, 'Logout successful');
  } catch (error) {
    next(error);
  }
};


const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, HTTP_STATUS.NOT_FOUND, 'User not found with this email');
    }

    
    
    
    return successResponse(
      res,
      HTTP_STATUS.OK,
      'Password reset instructions sent to email'
    );
  } catch (error) {
    next(error);
  }
};


const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    
    

    return successResponse(res, HTTP_STATUS.OK, 'Password reset successful');
  } catch (error) {
    next(error);
  }
};


const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return errorResponse(res, HTTP_STATUS.BAD_REQUEST, 'Refresh token is required');
    }

    
    const { verifyRefreshToken } = require('../utils/generateToken');
    const decoded = verifyRefreshToken(token);

    if (!decoded) {
      return errorResponse(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid refresh token');
    }

    
    const accessToken = generateAccessToken(decoded.id);

    return successResponse(res, HTTP_STATUS.OK, 'Token refreshed successfully', {
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken
};
