import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import type { Product, ProductCategory } from '../types';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const categories: { name: ProductCategory; emoji: string }[] = [
  { name: 'electronics', emoji: '💻' },
  { name: 'clothing', emoji: '👕' },
  { name: 'books', emoji: '📚' },
  { name: 'food', emoji: '🍔' },
  { name: 'furniture', emoji: '🪑' },
  { name: 'sports', emoji: '⚽' },
  { name: 'beauty', emoji: '💄' },
  { name: 'other', emoji: '📦' },
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await productsAPI.getAll({ limit: 8, sort: 'rating' });
        setFeaturedProducts(response.data.data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to MyStore
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl">
            Discover amazing products at unbeatable prices. Shop the latest trends today!
          </p>
          <Link
            to="/products"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
          >
            Shop Now →
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg hover:-translate-y-1 transition duration-300"
            >
              <span className="text-4xl">{cat.emoji}</span>
              <p className="mt-3 font-semibold text-gray-700 capitalize">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gray-50">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Top Rated Products</h2>
          <Link
            to="/products"
            className="text-blue-600 font-medium hover:underline"
          >
            View All →
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;