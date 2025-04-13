// backend/routes/adminOrderRoutes.js
const express = require('express');
const router = express.Router();
const { getAllOrders, markOrderAsDelivered } = require('../controllers/adminOrderController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/', protect, admin, getAllOrders);
router.put('/:id/deliver', protect, admin, markOrderAsDelivered);

module.exports = router;
