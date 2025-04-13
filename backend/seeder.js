// backend/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const products = require('./data/products');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear existing products
    await Product.deleteMany();
    // Insert sample products
    await Product.insertMany(products);
    console.log('Sample products imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error while importing data: ${error}`);
    process.exit(1);
  }
};

importData();
