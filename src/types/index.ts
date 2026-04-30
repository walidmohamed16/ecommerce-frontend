
// ═══════════════ USER ═══════════════
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: {
    street: string;
    city: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ═══════════════ PRODUCT ═══════════════
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  stock: number;
  images: string[];
  seller: {
    _id: string;
    name: string;
    email: string;
  };
  ratings: number;
  numReviews: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory =
  | 'electronics'
  | 'clothing'
  | 'books'
  | 'food'
  | 'furniture'
  | 'sports'
  | 'beauty'
  | 'other';

export type SortOption = 'price_asc' | 'price_desc' | 'rating' | 'newest';

export interface ProductFilters {
  search?: string;
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

// ═══════════════ CART ═══════════════
export interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════ ORDER ═══════════════
export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalPrice: number;
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    phone: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  cancelledAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════ REVIEW ═══════════════
export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  product: {
    _id: string;
    name: string;
  };
  order: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  rating5: number;
  rating4: number;
  rating3: number;
  rating2: number;
  rating1: number;
}

// ═══════════════ API RESPONSES ═══════════════
export interface ApiResponse<T> {
  status: 'success';
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  status: 'success';
  results: number;
  totalPages: number;
  currentPage: number;
  data: T;
}

export interface AuthResponse {
  status: 'success';
  token: string;
  data: {
    user: User;
  };
}

export interface ApiError {
  status: 'fail' | 'error';
  message: string;
  errors?: string[];
}