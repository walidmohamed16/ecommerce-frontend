
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox } from 'react-icons/fa';
import { ordersAPI } from '../services/api';
import type { Order } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const statusColors: Record<string, string> = {
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const paymentColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const params: any = { page: currentPage, limit: 10 };
        if (statusFilter) params.status = statusFilter;

        const response = await ordersAPI.getMyOrders(params);
        setOrders(response.data.data.orders);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter, currentPage]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status === '' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <FaBox className="mx-auto text-gray-300 text-6xl mb-4" />
          <h2 className="text-2xl font-semibold text-gray-500 mb-2">No orders found</h2>
          <Link
            to="/products"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block bg-white rounded-xl shadow-sm hover:shadow-md transition p-6"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${paymentColors[order.paymentStatus]}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="flex items-center gap-3">
                {order.items.slice(0, 3).map((item) => (
                  <img
                    key={item.product._id}
                    src={item.product.images?.[0] || 'https://via.placeholder.com/50'}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ))}
                {order.items.length > 3 && (
                  <span className="text-sm text-gray-500">
                    +{order.items.length - 3} more
                  </span>
                )}
                <div className="ml-auto text-right">
                  <p className="text-lg font-bold text-gray-800">
                    ${order.totalPrice.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.items.length} item(s)
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;