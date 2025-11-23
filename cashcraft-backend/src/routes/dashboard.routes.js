const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  getQuickStats
} = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');


router.use(protect);

router.get('/', getDashboardData);
router.get('/stats', getQuickStats);

module.exports = router;
