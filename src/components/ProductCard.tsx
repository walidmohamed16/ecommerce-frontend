
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/products/${product._id}`} className="block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 h-full flex flex-col">
        {/* Product Image */}
        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={product.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category Badge */}
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full self-start mb-2 capitalize">
            {product.category}
          </span>

          {/* Name */}
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-gray-500 text-sm mb-3 line-clamp-2 flex-grow">
            {product.description}
          </p>

          {/* Rating */}
          <StarRating rating={product.ratings} numReviews={product.numReviews} size="sm" />

          {/* Price & Stock */}
          <div className="flex justify-between items-center mt-3">
            <span className="text-xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
            {product.stock > 0 ? (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                In Stock
              </span>
            ) : (
              <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;