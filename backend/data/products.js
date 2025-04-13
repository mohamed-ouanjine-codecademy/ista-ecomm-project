// backend/data/products.js
const products = [
  {
    name: "Sample Product 1",
    image: "https://via.placeholder.com/300",
    description: "This is a sample product 1 description.",
    brand: "Brand A",
    category: "Category A",
    price: 29.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 10,
  },
  {
    name: "Sample Product 2",
    image: "https://via.placeholder.com/300",
    description: "This is a sample product 2 description.",
    brand: "Brand B",
    category: "Category B",
    price: 39.99,
    countInStock: 5,
    rating: 4.0,
    numReviews: 8,
  },
  {
    name: "Sample Product 3",
    image: "https://via.placeholder.com/300",
    description: "This is a sample product 3 description.",
    brand: "Brand C",
    category: "Category C",
    price: 19.99,
    countInStock: 0, // Out of stock sample
    rating: 3.5,
    numReviews: 4,
  },
];

module.exports = products;
