// backend/controllers/productController.js
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Fetch all products with search, filter, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // Extract query parameters
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.page) || 1;

  // Keyword filter (case-insensitive search on product name)
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  // Category filter
  const category = req.query.category ? { category: req.query.category } : {};

  // Price filter: use minPrice and maxPrice query parameters
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : Number.MAX_SAFE_INTEGER;
  const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

  // Minimum rating filter: if minRating provided, filter products with rating greater than or equal
  const ratingFilter = req.query.minRating ? { rating: { $gte: Number(req.query.minRating) } } : {};

  // Combine all filters into one object
  const filter = { ...keyword, ...category, ...priceFilter, ...ratingFilter };

  // Sorting: determine sort order based on the 'sort' query parameter
  let sort = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'priceAsc':
        sort = { price: 1 };
        break;
      case 'priceDesc':
        sort = { price: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'bestRated':
        sort = { rating: -1 };
        break;
      default:
        sort = {};
    }
  }

  // Get the count of filtered products
  const count = await Product.countDocuments(filter);

  // Fetch products with filters, sorting, pagination applied
  const products = await Product.find(filter)
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), count });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a new review for a product
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    // Check if user has already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    // Calculate the new overall rating
    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get product suggestions based on keyword
// @route   GET /api/products/suggestions
// @access  Public
const getProductSuggestions = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword || '';
  
  // If keyword is empty, return an empty array
  if (!keyword.trim()) {
    return res.json([]);
  }
  
  // Find up to 10 products matching the keyword in the name (case-insensitive)
  const suggestions = await Product.find({
    name: { $regex: keyword, $options: 'i' }
  })
    .limit(10)
    .select('_id name');
  
  res.json(suggestions);
});

module.exports = {
  getProducts,
  getProductById,
  createProductReview,
  getProductSuggestions,
  // ... any other exports
};
