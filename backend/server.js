// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const passport = require('passport');

dotenv.config();
connectDB();

const app = express();

// Security middleware
app.use(helmet());
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // it was 15 minute and I chnage it to 5
  max: 100,
});
app.use(limiter);
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());
app.use(cors());

// Initialize Passport and load config
app.use(passport.initialize());
require('./config/passport');

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const addressRoutes = require('./routes/addressRoutes');
const avatarRoutes = require('./routes/avatarRoutes');
const cartRoutes = require('./routes/cartRoutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/avatar', avatarRoutes);
app.use('/api/cart', cartRoutes);

// Serve the uploads folder statically
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(__dirname, '/uploads'))
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
