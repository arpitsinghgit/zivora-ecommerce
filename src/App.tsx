import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useGlobal } from './context/GlobalContext';
import { Check } from 'lucide-react';

import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import InfoPage from './pages/InfoPage';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const { toast, closeToast } = useGlobal();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans flex flex-col selection:bg-rose-100 selection:text-zinc-950">
      <ScrollToTop />
      
      {/* Toast Notification Pop-up */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up max-w-sm">
          <div className={`p-4 rounded-xl shadow-xl flex items-center space-x-3 border ${
            toast.type === 'success' 
              ? 'bg-zinc-900 border-zinc-800 text-white' 
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}>
            {toast.type === 'success' ? (
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <Check className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-rose-200 flex items-center justify-center text-rose-900 font-bold text-xs">
                i
              </div>
            )}
            <p className="text-xs font-semibold">{toast.message}</p>
            <button 
              onClick={closeToast} 
              className="text-zinc-400 hover:text-white text-xs cursor-pointer ml-auto pl-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenCart={() => setCartDrawerOpen(true)}
      />

      {/* Content views */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Account />} />
          <Route path="/page/:slug" element={<InfoPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Main Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />
    </div>
  );
}
