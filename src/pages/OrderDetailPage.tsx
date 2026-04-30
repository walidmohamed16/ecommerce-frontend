import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { ordersAPI } from '../services/api';
import type { Order } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const statusSteps = ['processing', 'shipped', 'delivered'];

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const justCreated = (location.state as any)?.justCreated;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const response = await ordersAPI.getById(id);
        setOrder(response.data.data.order);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!order) return;
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setIsCancelling(true);
    try {
      const response = await ordersAPI.cancel(order._id);
      setOrder(response.data.data.order);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!order) return <div className="text-center py-20">Order not found</div>;

  // Current step index for progress bar
  const currentStepIndex = order.orderStatus === 'cancelled'
    ? -1
    : statusSteps.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Success Banner */}
      {justCreated && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 flex items-center gap-4">
          <FaCheckCircle className="text-green-500 text-3xl flex-shrink-0" />
          <div>
            <h2 className="text-lg font-bold text-green-800">Order Placed Successfully!</h2>
            <p className="text-green-600">Your order has been confirmed and is being processed.</p>
          </div>
        </div>
      )}

      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
          <p className="text-gray-500 mt-1">
            Order #{order._id.slice(-8).toUpperCase()} •{' '}
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        {/* Cancel Button */}
        {order.orderStatus === 'processing' && (
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 disabled:opacity-50 transition"
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>

      {/* Progress Tracker */}
      {order.orderStatus !== 'cancelled' ? (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            {statusSteps.map((step, index) => (
              <div key={step} className="flex-1 flex flex-col items-center relative">
                {/* Connector Line */}
                {index > 0 && (
                  <div
                    className={`absolute top-4 right-1/2 w-full h-1 -z-10 ${
                      index <= currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
                {/* Step Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                    index <= currentStepIndex
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index <= currentStepIndex ? '✓' : index + 1}
                </div>
                <p
                  className={`mt-2 text-sm capitalize ${
                    index <= currentStepIndex ? 'text-blue-600 font-medium' : 'text-gray-400'
                  }`}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-center">
          <p className="text-red-600 font-semibold">This order has been cancelled</p>
          {order.cancelledAt && (
            <p className="text-red-400 text-sm mt-1">
              Cancelled on {new Date(order.cancelledAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Items ({order.items.length})
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.product._id} className="flex items-center gap-4">
                  <img
                    src={item.product.images?.[0] || 'https://via.placeholder.com/80'}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-grow">
                    <Link
                      to={`/products/${item.product._id}`}
                      className="font-medium text-gray-800 hover:text-blue-600 transition"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Shipping Address</h2>
            <p className="text-gray-600">{order.shippingAddress.street}</p>
            <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
            <p className="text-gray-600">{order.shippingAddress.phone}</p>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Payment</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Status</span>
              <span className={`capitalize font-medium ${
                order.paymentStatus === 'paid' ? 'text-green-600' :
                order.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {order.paymentStatus}
              </span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;