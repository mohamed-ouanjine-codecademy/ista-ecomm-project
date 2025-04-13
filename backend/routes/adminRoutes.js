// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getProductsAdmin, deleteProduct, createProduct, updateProduct } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.route('/products')
  .get(protect, admin, getProductsAdmin)
  .post(protect, admin, createProduct);

router.route('/products/:id')
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

module.exports = router;
