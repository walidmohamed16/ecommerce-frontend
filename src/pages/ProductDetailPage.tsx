import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { productsAPI, reviewsAPI } from '../services/api';
import type { Product, Review, ReviewStats } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch product and reviews
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const [productRes, reviewsRes] = await Promise.all([
          productsAPI.getById(id),
          reviewsAPI.getProductReviews(id, { limit: 5 }),
        ]);
        setProduct(productRes.data.data.product);
        setReviews(reviewsRes.data.data.reviews);
        setReviewStats(reviewsRes.data.stats);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product) return;

    setIsAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
      setSuccessMessage('Added to cart!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div>
          <div className="bg-gray-100 rounded-xl overflow-hidden mb-4">
            <img
              src={product.images[selectedImage] || 'https://via.placeholder.com/500?text=No+Image'}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          {/* Image Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === index ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Category */}
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full capitalize">
            {product.category}
          </span>

          {/* Name */}
          <h1 className="text-3xl font-bold text-gray-800 mt-4">{product.name}</h1>

          {/* Rating */}
          <div className="mt-3">
            <StarRating rating={product.ratings} numReviews={product.numReviews} size="md" />
          </div>

          {/* Price */}
          <p className="text-4xl font-bold text-blue-600 mt-6">
            ${product.price.toFixed(2)}
          </p>

          {/* Description */}
          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

          {/* Stock Status */}
          <div className="mt-6">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">
                ✅ In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-600 font-medium">❌ Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
                >
                  <FaMinus />
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          {product.stock > 0 && (
            <div className="mt-8">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-blue-400 transition"
              >
                <FaShoppingCart />
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              {/* Success Message */}
              {successMessage && (
                <p className="text-green-600 text-center mt-2 font-medium">
                  {successMessage}
                </p>
              )}
            </div>
          )}

          {/* Seller Info */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-500">
              Sold by: <span className="font-medium text-gray-700">{product.seller.name}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Customer Reviews
          {reviewStats && (
            <span className="text-lg font-normal text-gray-500 ml-2">
              ({reviewStats.totalReviews} reviews)
            </span>
          )}
        </h2>

        {/* Rating Summary */}
        {reviewStats && reviewStats.totalReviews > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex items-center gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold text-gray-800">{reviewStats.averageRating}</p>
              <StarRating rating={reviewStats.averageRating} size="md" />
              <p className="text-gray-500 text-sm mt-1">{reviewStats.totalReviews} reviews</p>
            </div>
            <div className="flex-grow space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviewStats[`rating${star}` as keyof ReviewStats] as number;
                const percentage = reviewStats.totalReviews > 0
                  ? (count / reviewStats.totalReviews) * 100
                  : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm w-8">{star} ⭐</span>
                    <div className="flex-grow bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No reviews yet</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;