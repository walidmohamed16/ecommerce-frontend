import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import type { CartItem as CartItemType } from '../types';
import { useCart } from '../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateItem, removeItem } = useCart();

  const handleIncrease = async () => {
    if (item.quantity < item.product.stock) {
      await updateItem(item.product._id, item.quantity + 1);
    }
  };

  const handleDecrease = async () => {
    if (item.quantity > 1) {
      await updateItem(item.product._id, item.quantity - 1);
    }
  };

  const handleRemove = async () => {
    await removeItem(item.product._id);
  };

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
      {/* Product Image */}
      <img
        src={item.product.images?.[0] || 'https://via.placeholder.com/100?text=No+Image'}
        alt={item.product.name}
        className="w-20 h-20 object-cover rounded-lg"
      />

      {/* Product Info */}
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
        <p className="text-blue-600 font-bold">${item.price.toFixed(2)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrease}
          disabled={item.quantity <= 1}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <FaMinus size={12} />
        </button>

        <span className="w-10 text-center font-semibold">{item.quantity}</span>

        <button
          onClick={handleIncrease}
          disabled={item.quantity >= item.product.stock}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <FaPlus size={12} />
        </button>
      </div>

      {/* Item Total */}
      <div className="text-right min-w-[80px]">
        <p className="font-bold text-gray-800">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;