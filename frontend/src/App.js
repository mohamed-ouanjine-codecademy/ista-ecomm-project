// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import WishlistPage from './pages/WishlistPage';
import ComparisonDetailPage from './pages/ComparisonDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';  // Import Admin Dashboard
import AdminProductListPage from './pages/AdminProductListPage';
import AdminProductEditPage from './pages/AdminProductEditPage';
import AdminOrderListPage from './pages/AdminOrderListPage';
import AdminOrderDetailPage from './pages/AdminOrderDetailPage';
import AddressBookPage from './pages/AddressBookPage';
import ComparisonPage from './pages/ComparisonPage';
import FloatingCartSummary from './components/FloatingCartSummary';
import AccountDashboard from './pages/AccountDashboard';
import BackToTop from './components/BackToTop';

function App() {
  return (
    <Router>
      <Header />
       {/* This div serves as an anchor for scrolling back to top */}
       <div id="back-to-top-anchor" />
      {/* Floating cart summary appears on mobile */}
      <FloatingCartSummary />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/order/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
          <Route path="/orderhistory" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/addresses" element={<ProtectedRoute><AddressBookPage /></ProtectedRoute>} />
          <Route path="/comparison" element={<ProtectedRoute><ComparisonPage /></ProtectedRoute>} />
          <Route path="/comparison/details" element={<ProtectedRoute><ComparisonDetailPage /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><AccountDashboard /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/productlist" element={<ProtectedRoute><AdminProductListPage /></ProtectedRoute>} />
          <Route path="/admin/product/:id/edit" element={<ProtectedRoute><AdminProductEditPage /></ProtectedRoute>} />
          <Route path="/admin/orderlist" element={<ProtectedRoute><AdminOrderListPage /></ProtectedRoute>} />
          <Route path="/admin/order/:id" element={<ProtectedRoute><AdminOrderDetailPage /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </Router>
  );
}

export default App;
