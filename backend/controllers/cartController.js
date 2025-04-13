// backend/controllers/cartController.js
const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');

// @desc    Get the current user's cart (merge duplicates before returning)
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product', 'name image price');
  if (cart) {
    // Merge duplicate items by product id (normalize to string)
    const mergedItems = cart.cartItems.reduce((acc, item) => {
      // Determine the product id (from populated object or raw value)
      const prodId = String(item.product._id ? item.product._id : item.product);
      const existing = acc.find(i => String(i.product) === prodId);
      if (existing) {
        existing.qty += item.qty;
      } else {
        // Convert to plain object if needed and normalize the product field
        acc.push({ ...item.toObject(), product: prodId });
      }
      return acc;
    }, []);
    
    // Optionally, update the cart in the database if duplicates were merged
    cart.cartItems = mergedItems;
    await cart.save();

    res.json(cart);
  } else {
    // If no cart exists, create a new one for the user
    const newCart = await Cart.create({ user: req.user._id, cartItems: [] });
    res.status(201).json(newCart);
  }
});

// @desc    Update the current user's cart (merge duplicates)
// @route   POST /api/cart
// @access  Private
const updateCart = asyncHandler(async (req, res) => {
  // Expect req.body.cartItems to be an array of items,
  // each with at least: { product, name, image, price, qty }
  let { cartItems } = req.body;

  // Merge duplicate items by product id (normalized to string)
  const mergedItems = cartItems.reduce((acc, item) => {
    const prodId = String(item.product || item._id); // fallback if product field is missing
    const existing = acc.find(i => i.product === prodId);
    if (existing) {
      existing.qty += item.qty;
    } else {
      acc.push({ ...item, product: prodId });
    }
    return acc;
  }, []);

  let cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.cartItems = mergedItems;
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } else {
    cart = await Cart.create({ user: req.user._id, cartItems: mergedItems });
    res.status(201).json(cart);
  }
});

// @desc    Clear the current user's cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.cartItems = [];
    await cart.save();
    res.json({ message: 'Cart cleared' });
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

module.exports = { getCart, updateCart, clearCart };
