import { Product, PRODUCTS } from '../data/products';

// Use relative path in production when served by Express, otherwise use localhost for dev
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

export const api = {
  /**
   * Fetches all products from the local MongoDB Database.
   */
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      
      if (!data || data.length === 0) {
        console.warn("Backend API returned empty. Falling back to dummy PRODUCTS.");
        return PRODUCTS;
      }

      return data;
    } catch (error) {
      console.warn("Backend API Error (Fallback to dummy data):", error);
      return PRODUCTS;
    }
  },

  /**
   * Fetches best selling / trending products.
   */
  getTrendingProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch trending products');
      const data = await response.json();
      
      if (!data || data.length === 0) {
        console.warn("Backend API returned empty. Falling back to dummy PRODUCTS (bestSeller).");
        return PRODUCTS.filter(p => p.bestSeller);
      }

      return data.filter((p: Product) => p.bestSeller);
    } catch (error) {
      console.warn("Backend API Error (Fallback to dummy trending data):", error);
      return PRODUCTS.filter(p => p.bestSeller);
    }
  },

  /**
   * Fetches a specific product by ID.
   */
  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      
      if (!data) {
        console.warn(`Backend API returned empty for ${id}. Falling back to dummy PRODUCTS.`);
        return PRODUCTS.find(p => p.id === id) || null;
      }
      
      return data;
    } catch (error) {
      console.warn(`Backend API Error for ${id} (Fallback to dummy data):`, error);
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
   * Authentication
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

  getProfile: async (token: string) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
    return data;
  },

  /**
   * Admin Methods
   */
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
