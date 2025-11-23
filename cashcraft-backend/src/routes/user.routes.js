const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');


router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.delete('/account', deleteAccount);

module.exports = router;
