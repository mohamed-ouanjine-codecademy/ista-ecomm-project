// backend/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const { getCart, updateCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getCart)
  .post(protect, updateCart)
  .delete(protect, clearCart);

module.exports = router;
