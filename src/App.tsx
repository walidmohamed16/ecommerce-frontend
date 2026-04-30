// src/App.tsx

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar — shown on every page */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        <Routes>
          {/* ====== Public Routes ====== */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ====== Protected Routes (Login Required) ====== */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />

          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />

          <Route path="/orders/:id" element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          {/* ====== 404 Page ====== */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center py-20">
              <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
              <p className="text-xl text-gray-500 mb-6">Page not found</p>
              <a
                href="/"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Go Home
              </a>
            </div>
          } />
        </Routes>
      </main>

      {/* Footer — shown on every page */}
      <Footer />
    </div>
  );
}

export default App;