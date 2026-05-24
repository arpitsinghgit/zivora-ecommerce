import { Product, PRODUCTS } from '../data/products';

// Use relative path in production when served by Express, otherwise use localhost for dev
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

export const api = {
  /**
   * Fetches products with filtering and pagination
   */
  getProducts: async (filters: any = {}): Promise<{products: Product[], page: number, pages: number, total: number}> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category && filters.category !== 'all') queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.shape && filters.shape !== 'All') queryParams.append('shape', filters.shape);
      if (filters.size && filters.size !== 'All') queryParams.append('size', filters.size);
      if (filters.priceRange && filters.priceRange !== 'All') queryParams.append('priceRange', filters.priceRange);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const response = await fetch(`${API_URL}/products?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.warn("Backend API Error:", error);
      return { products: PRODUCTS, page: 1, pages: 1, total: PRODUCTS.length }; // Fallback
    }
  },

  /**
   * Fetches a specific product by ID.
   */
  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return await response.json();
    } catch (error) {
      console.warn(`Backend API Error for ${id}:`, error);
      return PRODUCTS.find(p => p.id === id) || null;
    }
  },

  /**
   * Submit an order to the backend
   */
  submitOrder: async (orderData: any, token?: string): Promise<{ success: boolean; orderId: string }> => {
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });
      if (!response.ok) throw new Error('Failed to submit order');
      const data = await response.json();
      return { success: true, orderId: data._id || data.id };
    } catch (error) {
      console.error("Order submission failed on backend:", error);
      throw error;
    }
  },

  /**
   * Create Razorpay Order
   */
  createRazorpayOrder: async (amount: number): Promise<any> => {
    const response = await fetch(`${API_URL}/create-razorpay-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to create Razorpay order');
    }
    return await response.json();
  },

  /**
   * Authentication & Profile
   */
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  updateProfile: async (profileData: any, token: string) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Update failed');
    return data;
  },

  /**
   * User Data Syncing
   */
  getCart: async (token: string) => {
    const response = await fetch(`${API_URL}/user/cart`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!response.ok) return [];
    return await response.json();
  },
  updateCart: async (cart: any, token: string) => {
    await fetch(`${API_URL}/user/cart`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ cart })
    });
  },
  getWishlist: async (token: string) => {
    const response = await fetch(`${API_URL}/user/wishlist`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!response.ok) return [];
    return await response.json();
  },
  updateWishlist: async (wishlist: any, token: string) => {
    await fetch(`${API_URL}/user/wishlist`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ wishlist })
    });
  },
  getAddresses: async (token: string) => {
    const response = await fetch(`${API_URL}/user/addresses`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!response.ok) return [];
    return await response.json();
  },
  updateAddresses: async (addresses: any, token: string) => {
    await fetch(`${API_URL}/user/addresses`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ addresses })
    });
  },
  getMyOrders: async (token: string) => {
    const response = await fetch(`${API_URL}/orders/myorders`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!response.ok) return [];
    return await response.json();
  },

  /**
   * Reviews
   */
  getReviews: async (productId: string) => {
    const response = await fetch(`${API_URL}/products/${productId}/reviews`);
    if (!response.ok) return [];
    return await response.json();
  },
  addReview: async (productId: string, reviewData: any, token: string) => {
    const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(reviewData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to submit review');
    return data;
  },

  /**
   * Admin Methods
   */
  uploadImage: async (formData: FormData, token: string) => {
    const response = await fetch(`${API_URL}/products/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData // No Content-Type header, let browser set it with boundary
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Image upload failed');
    return data;
  },

  createProduct: async (productData: any, token: string) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create product');
    return data;
  },

  updateProduct: async (id: string, productData: any, token: string) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update product');
    return data;
  },

  deleteProduct: async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete product');
    return data;
  },

  getAllOrders: async (token: string) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch all orders');
    return data;
  },

  deliverOrder: async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/orders/${id}/deliver`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update order');
    return data;
  }
};
