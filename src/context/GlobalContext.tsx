import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../data/products';
import { api } from '../api';

export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  zipCode: string;
  phone: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: CartItem[];
}

interface Toast {
  show: boolean;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface GlobalContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size?: string, shape?: string, color?: string, qty?: number) => void;
  updateCartQuantity: (index: number, newQty: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  
  // Wishlist
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Auth
  user: { name: string, email: string, token: string, role: string } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;

  // Addresses
  addresses: Address[];
  addAddress: (address: Address) => void;

  // Toast
  toast: Toast;
  triggerToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  closeToast: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobal must be used within a GlobalProvider");
  return context;
};

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart State (using localStorage instead of sessionStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('nails_world_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.every(item => item?.product?.id)) {
          return parsed;
        }
      }
      return [];
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
      return [];
    }
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const savedWishlist = localStorage.getItem('nails_world_wishlist');
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch (e) {
      console.error("Failed to parse wishlist from localStorage", e);
      return [];
    }
  });

  // Auth State
  const [user, setUser] = useState<{ name: string, email: string, token: string, role: string } | null>(() => {
    try {
      const savedUser = localStorage.getItem('nails_world_user_obj');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      return null;
    }
  });

  // Toast State
  const [toast, setToast] = useState<Toast>({ show: false, message: '', type: 'success' });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const savedOrders = localStorage.getItem('nails_world_orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  // Addresses State
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const savedAddresses = localStorage.getItem('nails_world_addresses');
      if (savedAddresses) {
        const parsed = JSON.parse(savedAddresses);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('nails_world_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('nails_world_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('nails_world_user_obj', JSON.stringify(user));
    } else {
      localStorage.removeItem('nails_world_user_obj');
    }
  }, [user]);

  // Sync orders to localStorage
  useEffect(() => {
    localStorage.setItem('nails_world_orders', JSON.stringify(orders));
  }, [orders]);

  // Sync addresses to localStorage
  useEffect(() => {
    localStorage.setItem('nails_world_addresses', JSON.stringify(addresses));
  }, [addresses]);

  // --- Orders & Addresses Methods ---
  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const addAddress = (address: Address) => {
    setAddresses(prev => {
      // Check if duplicate address exists
      const exists = prev.some(a => a.street === address.street && a.zipCode === address.zipCode);
      if (exists) return prev;
      
      // If it's the first address, make it default
      const newAddress = { ...address, isDefault: prev.length === 0 };
      return [...prev, newAddress];
    });
  };

  // --- Cart Methods ---
  const addToCart = (product: Product, size?: string, shape?: string, color?: string, qty: number = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => 
          item.product.id === product.id && 
          item.selectedSize === size && 
          item.selectedShape === shape && 
          item.selectedColor === color
      );

      let updatedCart = [...prev];
      if (existingIndex > -1) {
        updatedCart[existingIndex].quantity += qty;
      } else {
        updatedCart.push({
          product,
          quantity: qty,
          selectedSize: size,
          selectedShape: shape,
          selectedColor: color,
        });
      }
      return updatedCart;
    });
    triggerToast(`Added ${qty}x ${product.name} to your shopping bag!`, 'success');
  };

  const updateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    const itemName = cart[index]?.product.name;
    setCart(prev => prev.filter((_, idx) => idx !== index));
    triggerToast(`Removed ${itemName} from shopping bag.`, 'info');
  };

  const clearCart = () => setCart([]);

  // --- Wishlist Methods ---
  const addToWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });
    triggerToast('Added to your wishlist! 💖', 'success');
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(id => id !== productId));
    triggerToast('Removed from wishlist.', 'info');
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // --- Auth Methods ---
  const login = async (email: string, password: string) => {
    try {
      const data = await api.login(email, password);
      setUser({ name: data.name, email: data.email, token: data.token, role: data.role });
      triggerToast(`Welcome back, ${data.name}! Access granted.`, 'success');
    } catch (error: any) {
      triggerToast(error.message || 'Login failed', 'error');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await api.register(name, email, password);
      setUser({ name: data.name, email: data.email, token: data.token, role: data.role });
      triggerToast(`Welcome to Zivora, ${data.name}!`, 'success');
    } catch (error: any) {
      triggerToast(error.message || 'Registration failed', 'error');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    triggerToast('Logged out successfully. See you soon!', 'info');
  };

  // --- Toast Methods ---
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const closeToast = () => setToast(prev => ({ ...prev, show: false }));

  return (
    <GlobalContext.Provider value={{
      cart, addToCart, updateCartQuantity, removeFromCart, clearCart,
      wishlist, addToWishlist, removeFromWishlist, isInWishlist,
      user, login, register, logout,
      orders,
      addOrder,
      addresses,
      addAddress,
      toast, triggerToast, closeToast
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
