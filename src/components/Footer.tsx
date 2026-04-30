import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">🛒 MyStore</h3>
            <p className="text-gray-400">
              Your one-stop shop for everything you need. Quality products at great prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <Link to="/products" className="hover:text-white transition">Products</Link>
              <Link to="/cart" className="hover:text-white transition">Cart</Link>
              <Link to="/orders" className="hover:text-white transition">My Orders</Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Categories</h4>
            <div className="flex flex-col gap-2">
              <Link to="/products?category=electronics" className="hover:text-white transition">Electronics</Link>
              <Link to="/products?category=clothing" className="hover:text-white transition">Clothing</Link>
              <Link to="/products?category=books" className="hover:text-white transition">Books</Link>
              <Link to="/products?category=sports" className="hover:text-white transition">Sports</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} MyStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;