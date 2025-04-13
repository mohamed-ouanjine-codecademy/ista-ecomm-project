// backend/controllers/adminOrderController.js
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email');
  res.json(orders);
});

// @desc    Mark an order as delivered (Admin)
// @route   PUT /api/admin/orders/:id/deliver
// @access  Private/Admin
const markOrderAsDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = { getAllOrders, markOrderAsDelivered };
