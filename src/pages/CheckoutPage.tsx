// src/pages/CheckoutPage.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, isLoading: cartLoading, refreshCart } = useCart();

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to cart if empty (fixed: using useEffect instead of direct navigate)
  useEffect(() => {
    if (!cartLoading && (!cart || cart.items.length === 0)) {
      navigate('/cart');
    }
  }, [cart, cartLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await ordersAPI.create({
        street,
        city,
        country,
        phone,
      });

      // Refresh cart (should be empty now)
      await refreshCart();

      // Navigate to order detail
      navigate(`/orders/${response.data.data.order._id}`, {
        state: { justCreated: true },
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartLoading) return <LoadingSpinner />;

  // Show nothing while redirecting
  if (!cart || cart.items.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Shipping Form */}
        <div className="flex-grow">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Shipping Address</h2>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Street */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  placeholder="123 Main Street"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* City & Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="Cairo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    placeholder="Egypt"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+20 123 456 7890"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? 'Placing Order...' : `Place Order — $${cart.totalPrice.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 mb-4">
              {cart.items.map((item) => (
                <div key={item.product._id} className="flex items-center gap-3">
                  <img
                    src={item.product.images?.[0] || 'https://via.placeholder.com/60'}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-lg font-bold text-gray-800">
              <span>Total</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;