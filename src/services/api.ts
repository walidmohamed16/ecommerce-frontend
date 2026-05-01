import axios from 'axios';
import type {
    AuthResponse,
    ApiResponse,
    PaginatedResponse,
    Product,
    Cart,
    Order,
    Review,
    ReviewStats,
    User,
    ProductFilters,
} from '../types';

// ═══════════════ SETUP ═══════════════

const API = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://ecommerce-api-ts-production.up.railway.app/api' 
    : 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: بيحط الـ Token في كل request تلقائياً
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: لو الـ token expired، بنعمل logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // لو مش في صفحة login، وجّهه هناك
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ═══════════════ AUTH API ═══════════════

export const authAPI = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => API.post<AuthResponse>('/auth/register', data),

  login: (data: {
    email: string;
    password: string;
  }) => API.post<AuthResponse>('/auth/login', data),

  getMe: () => API.get<ApiResponse<{ user: User }>>('/auth/me'),

  updateProfile: (data: {
    name?: string;
    phone?: string;
    address?: { street: string; city: string; country: string };
  }) => API.put<ApiResponse<{ user: User }>>('/auth/me', data),
};

// ═══════════════ PRODUCTS API ═══════════════

export const productsAPI = {
  getAll: (filters?: ProductFilters) =>
    API.get<PaginatedResponse<{ products: Product[] }>>('/products', {
      params: filters,
    }),

  getById: (id: string) =>
    API.get<ApiResponse<{ product: Product }>>(`/products/${id}`),

  getByCategory: (category: string) =>
    API.get<ApiResponse<{ products: Product[] }>>(
      `/products/category/${category}`
    ),

  getMyProducts: () =>
    API.get<ApiResponse<{ products: Product[] }>>('/products/seller/me'),

  // Admin only
  create: (data: {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    images?: string[];
  }) => API.post<ApiResponse<{ product: Product }>>('/products', data),

  update: (id: string, data: Partial<Product>) =>
    API.put<ApiResponse<{ product: Product }>>(`/products/${id}`, data),

  delete: (id: string) => API.delete(`/products/${id}`),
};

// ═══════════════ CART API ═══════════════

export const cartAPI = {
  get: () => API.get<ApiResponse<{ cart: Cart }>>('/cart'),

  addItem: (productId: string, quantity: number) =>
    API.post<ApiResponse<{ cart: Cart }>>('/cart/add', {
      productId,
      quantity,
    }),

  updateItem: (productId: string, quantity: number) =>
    API.put<ApiResponse<{ cart: Cart }>>(`/cart/update/${productId}`, {
      quantity,
    }),

  removeItem: (productId: string) =>
    API.delete<ApiResponse<{ cart: Cart }>>(`/cart/remove/${productId}`),

  clear: () => API.delete<ApiResponse<{ cart: Cart }>>('/cart/clear'),
};

// ═══════════════ ORDERS API ═══════════════

export const ordersAPI = {
  create: (shippingAddress: {
    street: string;
    city: string;
    country: string;
    phone: string;
  }) =>
    API.post<ApiResponse<{ order: Order }>>('/orders', {
      shippingAddress,
    }),

  getMyOrders: (params?: { status?: string; page?: number; limit?: number }) =>
    API.get<
      PaginatedResponse<{ orders: Order[] }>
    >('/orders/me', { params }),

  getById: (id: string) =>
    API.get<ApiResponse<{ order: Order }>>(`/orders/${id}`),

  cancel: (id: string) =>
    API.put<ApiResponse<{ order: Order }>>(`/orders/${id}/cancel`),

  // Admin only
  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    API.get<
      PaginatedResponse<{ orders: Order[] }> & {
        stats: { totalRevenue: number; totalOrders: number };
      }
    >('/orders', { params }),

  updateStatus: (id: string, orderStatus: string) =>
    API.put<ApiResponse<{ order: Order }>>(`/orders/${id}/status`, {
      orderStatus,
    }),
};

// ═══════════════ REVIEWS API ═══════════════

export const reviewsAPI = {
  getProductReviews: (
    productId: string,
    params?: { page?: number; limit?: number }
  ) =>
    API.get<
      PaginatedResponse<{ reviews: Review[] }> & { stats: ReviewStats }
    >(`/reviews/product/${productId}`, { params }),

  create: (data: {
    productId: string;
    orderId: string;
    rating: number;
    comment: string;
  }) => API.post<ApiResponse<{ review: Review }>>('/reviews', data),

  getMyReviews: () =>
    API.get<ApiResponse<{ reviews: Review[] }>>('/reviews/me'),

  update: (id: string, data: { rating?: number; comment?: string }) =>
    API.put<ApiResponse<{ review: Review }>>(`/reviews/${id}`, data),

  delete: (id: string) => API.delete(`/reviews/${id}`),
};

export default API;