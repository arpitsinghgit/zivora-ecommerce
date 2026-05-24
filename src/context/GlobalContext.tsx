import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../data/products';
import { api } from '../api';

export interface Address {
  _id?: string;
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
  _id?: string;
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
  updateProfile: (profileData: any) => Promise<void>;

  // Orders
  orders: Order[];
  fetchOrders: () => Promise<void>;

  // Addresses
  addresses: Address[];
  addAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;

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
  const [user, setUser] = useState<{ name: string, email: string, token: string, role: string } | null>(() => {
    try {
      const savedUser = localStorage.getItem('nails_world_user_obj');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('nails_world_cart') || '[]'); } catch { return []; }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('nails_world_wishlist') || '[]'); } catch { return []; }
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [toast, setToast] = useState<Toast>({ show: false, message: '', type: 'success' });

  // Sync state from backend when user logs in or app loads with existing user
  useEffect(() => {
    if (user && user.token) {
      Promise.all([
        api.getCart(user.token),
        api.getWishlist(user.token),
        api.getAddresses(user.token),
        api.getMyOrders(user.token)
      ]).then(([dbCart, dbWishlist, dbAddresses, dbOrders]) => {
        if (dbCart && Array.isArray(dbCart)) setCart(dbCart);
        if (dbWishlist && Array.isArray(dbWishlist)) setWishlist(dbWishlist);
        if (dbAddresses && Array.isArray(dbAddresses)) setAddresses(dbAddresses);
        if (dbOrders && Array.isArray(dbOrders)) {
          // Format orders from backend to match frontend interface
          const formattedOrders = dbOrders.map((o: any) => ({
            id: o._id,
            date: new Date(o.createdAt).toLocaleDateString(),
            total: o.totalPrice,
            status: o.isDelivered ? 'Delivered' : (o.status || 'Processing'),
            items: o.orderItems.map((item: any) => ({
              product: { id: item.product, name: item.name, images: [item.image], price: item.price },
              quantity: item.quantity,
              selectedSize: item.selectedSize,
              selectedShape: item.selectedShape
            }))
          }));
          setOrders(formattedOrders);
        }
      }).catch(console.error);
    }
  }, [user?.token]);

  // Sync to local storage
  useEffect(() => { localStorage.setItem('nails_world_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('nails_world_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { 
    if (user) localStorage.setItem('nails_world_user_obj', JSON.stringify(user)); 
    else localStorage.removeItem('nails_world_user_obj');
  }, [user]);

  // Sync to backend when state changes
  useEffect(() => {
    if (user) api.updateCart(cart, user.token).catch(console.error);
  }, [cart, user]);

  useEffect(() => {
    if (user) api.updateWishlist(wishlist, user.token).catch(console.error);
  }, [wishlist, user]);

  useEffect(() => {
    if (user) api.updateAddresses(addresses, user.token).catch(console.error);
  }, [addresses, user]);

  // --- Profile Methods ---
  const updateProfile = async (profileData: any) => {
    if (!user) return;
    try {
      const updatedUser = await api.updateProfile(profileData, user.token);
      setUser({ ...user, name: updatedUser.name });
      triggerToast('Profile updated successfully', 'success');
    } catch (error: any) {
      triggerToast(error.message || 'Failed to update profile', 'error');
      throw error;
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const dbOrders = await api.getMyOrders(user.token);
      const formattedOrders = dbOrders.map((o: any) => ({
        id: o._id,
        date: new Date(o.createdAt).toLocaleDateString(),
        total: o.totalPrice,
        status: o.isDelivered ? 'Delivered' : (o.status || 'Processing'),
        items: o.orderItems.map((item: any) => ({
          product: { id: item.product, name: item.name, images: [item.image], price: item.price },
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedShape: item.selectedShape
        }))
      }));
      setOrders(formattedOrders);
    } catch (e) {
      console.error(e);
    }
  };

  // --- Addresses Methods ---
  const addAddress = (address: Address) => {
    setAddresses(prev => {
      const newAddress = { ...address, isDefault: prev.length === 0, _id: Date.now().toString() };
      return [...prev, newAddress];
    });
    triggerToast('Address saved', 'success');
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a._id !== id));
    triggerToast('Address deleted', 'info');
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
    setCart([]);
    setWishlist([]);
    setOrders([]);
    setAddresses([]);
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
      user, login, register, logout, updateProfile,
      orders, fetchOrders,
      addresses, addAddress, deleteAddress,
      toast, triggerToast, closeToast
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
