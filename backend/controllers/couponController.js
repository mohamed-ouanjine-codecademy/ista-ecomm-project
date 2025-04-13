// backend/controllers/couponController.js
const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

// @desc    Get coupon details by code
// @route   GET /api/coupons/:code
// @access  Public
const getCouponByCode = asyncHandler(async (req, res) => {
  const code = req.params.code.toUpperCase(); // Ensure code is uppercase for consistency
  const coupon = await Coupon.findOne({ code });
  // Check if coupon exists and is not expired
  if (coupon && new Date() <= coupon.expiryDate) {
    res.json(coupon);
  } else {
    res.status(404);
    throw new Error('Coupon not found or expired');
  }
});

module.exports = { getCouponByCode };
