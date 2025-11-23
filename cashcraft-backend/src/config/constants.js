module.exports = {
  EXPENSE_CATEGORIES: [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Personal Care',
    'Groceries',
    'Rent',
    'Insurance',
    'Investments',
    'Others'
  ],

  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin'
  },

  GOAL_STATUS: {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    ABANDONED: 'abandoned'
  },

  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  },

  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
};
