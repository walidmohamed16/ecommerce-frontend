import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            🛒 MyStore
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-blue-600 transition">
              Products
            </Link>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart */}
            {isAuthenticated && (
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition">
                <FaShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                >
                  <FaUser />
                  <span>{user?.name}</span>
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      My Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/products"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        Manage Products
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t">
            <div className="flex flex-col gap-2 pt-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Products
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    Cart ({itemCount})
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;