import { Link } from 'react-router-dom';
import { FaTrash, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import LoadingSpinner from '../components/LoadingSpinner';

const CartPage = () => {
  const { cart, isLoading, clearCart, itemCount } = useCart();

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      {/* Empty Cart */}
      {!cart || cart.items.length === 0 ? (
        <div className="text-center py-20">
          <FaShoppingBag className="mx-auto text-gray-300 text-6xl mb-4" />
          <h2 className="text-2xl font-semibold text-gray-500 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-400 mb-6">
            Looks like you haven't added anything yet
          </p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-grow space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <p className="text-gray-500">{itemCount} item(s) in cart</p>
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm transition"
              >
                <FaTrash />
                Clear Cart
              </button>
            </div>

            {/* Items List */}
            {cart.items.map((item) => (
              <CartItem key={item.product._id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

              {/* Items Breakdown */}
              <div className="space-y-2 mb-4">
                {cart.items.map((item) => (
                  <div key={item.product._id} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate mr-2">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              {/* Total */}
              <div className="flex justify-between text-lg font-bold text-gray-800 mb-6">
                <span>Total</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Proceed to Checkout
              </Link>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="block w-full text-center text-blue-600 mt-3 hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;