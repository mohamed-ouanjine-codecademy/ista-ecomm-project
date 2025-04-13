const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Place the '/myorders' route before the '/:id' route.
router.route('/myorders').get(protect, getMyOrders);  // New route for user's orders
router.route('/').post(protect, addOrderItems);         // For creating an order
router.route('/:id').get(protect, getOrderById);          // For fetching a single order by ID

module.exports = router;
