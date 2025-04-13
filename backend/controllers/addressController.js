// backend/controllers/addressController.js
const asyncHandler = require('express-async-handler');
const Address = require('../models/Address');

// @desc    Get all addresses for the logged-in user
// @route   GET /api/addresses
// @access  Private
const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id });
  res.json(addresses);
});

// @desc    Create a new address
// @route   POST /api/addresses
// @access  Private
const createAddress = asyncHandler(async (req, res) => {
  const { fullName, address, city, postalCode, country, phone } = req.body;
  const newAddress = new Address({
    user: req.user._id,
    fullName,
    address,
    city,
    postalCode,
    country,
    phone
  });
  const createdAddress = await newAddress.save();
  res.status(201).json(createdAddress);
});

// @desc    Update an address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const { fullName, address, city, postalCode, country, phone } = req.body;
  const addr = await Address.findById(req.params.id);

  if (addr && addr.user.toString() === req.user._id.toString()) {
    addr.fullName = fullName || addr.fullName;
    addr.address = address || addr.address;
    addr.city = city || addr.city;
    addr.postalCode = postalCode || addr.postalCode;
    addr.country = country || addr.country;
    addr.phone = phone || addr.phone;

    const updatedAddress = await addr.save();
    res.json(updatedAddress);
  } else {
    res.status(404);
    throw new Error('Address not found');
  }
});

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const addr = await Address.findById(req.params.id);

  if (addr && addr.user.toString() === req.user._id.toString()) {
    await addr.deleteOne();
    res.json({ message: 'Address removed' });
  } else {
    res.status(404);
    throw new Error('Address not found');
  }
});

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};
