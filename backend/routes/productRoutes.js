// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProductReview, getProductSuggestions } = require('../controllers/productController');
const { protect } = require('../middleware/auth');

// Fetch all products with search, filtering, etc.
router.get('/', getProducts);

// New endpoint for product suggestions
router.get('/suggestions', getProductSuggestions);

// Fetch single product details
router.get('/:id', getProductById);

// Create a product review (protected)
router.post('/:id/reviews', protect, createProductReview);

module.exports = router;
