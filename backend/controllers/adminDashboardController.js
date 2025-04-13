// backend/controllers/adminDashboardController.js
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // Get all orders and products (in a real-world scenario, you might limit the data or use aggregation)
  const orders = await Order.find({});
  const products = await Product.find({});

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const totalProducts = products.length;

  res.json({ totalOrders, totalRevenue, totalProducts });
});

module.exports = { getDashboardStats };
