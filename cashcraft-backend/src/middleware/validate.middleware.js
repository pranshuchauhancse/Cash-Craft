const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/formatResponse');
const { HTTP_STATUS } = require('../config/constants');


const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg
    }));

    return errorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Validation failed',
      extractedErrors
    );
  }

  next();
};

module.exports = validate;
