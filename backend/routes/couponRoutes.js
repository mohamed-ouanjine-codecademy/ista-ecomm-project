// backend/routes/couponRoutes.js
const express = require('express');
const router = express.Router();
const { getCouponByCode } = require('../controllers/couponController');

router.get('/:code', getCouponByCode);

module.exports = router;
