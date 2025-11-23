const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/formatResponse');
const { HTTP_STATUS } = require('../config/constants');


const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    return successResponse(res, HTTP_STATUS.OK, 'Profile retrieved successfully', { user });
  } catch (error) {
    next(error);
  }
};


const updateProfile = async (req, res, next) => {
  try {
    const { name, currency, settings } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    
    if (name) user.name = name;
    if (currency) user.currency = currency;
    if (settings) {
      user.settings = {
        ...user.settings,
        ...settings
      };
    }

    await user.save();

    return successResponse(res, HTTP_STATUS.OK, 'Profile updated successfully', { user });
  } catch (error) {
    next(error);
  }
};


const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Current password and new password are required'
      );
    }

    const user = await User.findById(req.user._id).select('+passwordHash');

    
    const isPasswordMatch = await user.matchPassword(currentPassword);

    if (!isPasswordMatch) {
      return errorResponse(res, HTTP_STATUS.UNAUTHORIZED, 'Current password is incorrect');
    }

    
    user.passwordHash = newPassword;
    await user.save();

    return successResponse(res, HTTP_STATUS.OK, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};


const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    

    return successResponse(res, HTTP_STATUS.OK, 'Account deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount
};
