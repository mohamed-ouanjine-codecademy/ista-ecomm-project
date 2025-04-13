// backend/routes/adminDashboardRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminDashboardController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/', protect, admin, getDashboardStats);

module.exports = router;
