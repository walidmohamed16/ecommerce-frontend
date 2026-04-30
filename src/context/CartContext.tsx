import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { cartAPI } from '../services/api';
import type { Cart } from '../types';
import { useAuth } from './AuthContext';

// ============ Types ============

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

// ============ Create Context ============

const CartContext = createContext<CartContextType | undefined>(undefined);

// ============ Provider Component ============

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Calculate total items in cart
  const itemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  // Fetch cart when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      // Clear cart when user logs out
      setCart(null);
    }
  }, [isAuthenticated]);

  // Refresh cart from API
  const refreshCart = async () => {
    try {
      setIsLoading(true);
      const response = await cartAPI.get();
      setCart(response.data.data.cart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId: string, quantity: number) => {
    const response = await cartAPI.addItem(productId, quantity);
    setCart(response.data.data.cart);
  };

  // Update item quantity
  const updateItem = async (productId: string, quantity: number) => {
    const response = await cartAPI.updateItem(productId, quantity);
    setCart(response.data.data.cart);
  };

  // Remove item from cart
  const removeItem = async (productId: string) => {
    const response = await cartAPI.removeItem(productId);
    setCart(response.data.data.cart);
  };

  // Clear entire cart
  const clearCart = async () => {
    const response = await cartAPI.clear();
    setCart(response.data.data.cart);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        itemCount,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ============ Custom Hook ============

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};