import { useState } from 'react';
import { Search, ShoppingBag, User, LogOut, Menu, X, Sparkles, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenCart: () => void;
}

export default function Navbar({
  onOpenAuth,
  onOpenCart,
}: NavbarProps) {
  const { user, logout, cart } = useGlobal();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cart.reduce((sum, item) => sum + (item?.quantity || 0), 0);

  const handleNavClick = (category: 'all' | 'press-on' | 'polish' | 'art-care') => {
    if (category === 'all') {
      navigate('/shop');
    } else {
      navigate(`/shop?category=${category}`);
    }
    setMobileMenuOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim()) {
      navigate(`/shop?search=${encodeURIComponent(val)}`);
    } else {
      navigate(`/shop`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100">
      {/* Top Banner */}
      <div className="bg-rose-950 text-rose-50 text-[11px] font-medium tracking-widest text-center py-2 px-4 uppercase relative overflow-hidden flex items-center justify-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>Free Shipping on orders over ₹2000</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Icon */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-zinc-700 hover:text-zinc-950 hover:bg-rose-50 rounded-lg cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Links (Left side - Desktop) */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold uppercase tracking-widest text-zinc-600">
            <button
              onClick={() => navigate('/')}
              className="hover:text-amber-700 hover:underline hover:underline-offset-4 cursor-pointer transition-colors duration-150"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('all')}
              className="hover:text-amber-700 hover:underline hover:underline-offset-4 cursor-pointer transition-colors duration-150"
            >
              Shop All
            </button>
            <button
              onClick={() => handleNavClick('press-on')}
              className="hover:text-amber-700 hover:underline hover:underline-offset-4 cursor-pointer transition-colors duration-150"
            >
              Press-Ons
            </button>
            <button
              onClick={() => handleNavClick('polish')}
              className="hover:text-amber-700 hover:underline hover:underline-offset-4 cursor-pointer transition-colors duration-150"
            >
              Gel Polish
            </button>
            <button
              onClick={() => handleNavClick('art-care')}
              className="hover:text-amber-700 hover:underline hover:underline-offset-4 cursor-pointer transition-colors duration-150"
            >
              Care & Art
            </button>
          </nav>

          {/* Logo (Center) */}
          <div className="flex-1 flex justify-center lg:flex-none">
            <button
              onClick={() => navigate('/')}
              className="flex flex-col items-center group cursor-pointer focus:outline-none"
            >
              <span className="font-serif tracking-[0.25em] text-2xl font-bold text-zinc-950 group-hover:text-amber-800 transition-colors uppercase">
                Zivora
              </span>
              <span className="text-[9px] uppercase tracking-[0.4em] font-medium text-amber-700/80 -mt-1 block">
                Couture Artistry
              </span>
            </button>
          </div>

          {/* Search, Account, Cart (Right side) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Search Input (Desktop) */}
            <div className="relative hidden md:flex items-center">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className={`text-xs pl-8 pr-3 py-2 border rounded-full bg-zinc-50 border-zinc-200 outline-none transition-all duration-300 ${
                  searchFocused ? 'w-52 border-amber-600/50 ring-2 ring-rose-50' : 'w-36'
                }`}
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>

            {/* Account Info */}
            {user ? (
              <div className="flex items-center space-x-1.5 group relative">
                <button
                  onClick={() => navigate('/account')}
                  className="hidden sm:inline-block text-xs font-semibold text-zinc-700 hover:text-amber-800 cursor-pointer"
                >
                  Hi, {user.name}
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="hidden sm:inline-block text-xs font-semibold text-amber-700 hover:text-amber-900 cursor-pointer px-2"
                  >
                    [Admin]
                  </button>
                )}
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-zinc-500 hover:text-red-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="p-2 text-zinc-600 hover:text-amber-800 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                aria-label="User account"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            {/* Wishlist / Hearts indicator */}
            <button
              onClick={() => navigate('/wishlist')}
              className="p-2 text-zinc-600 hover:text-amber-800 hover:bg-rose-50 rounded-full transition-colors hidden sm:block cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* Shopping Cart Icon */}
            <button
              onClick={onOpenCart}
              className="p-2 relative text-zinc-700 hover:text-amber-800 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-700 text-[10px] font-bold text-white animate-scale">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Search Input (Mobile Only - Under Nav bar) */}
      <div className="md:hidden px-4 pb-3 border-t border-rose-50/50 pt-2 bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search Press-ons, Polishes..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full text-xs pl-9 pr-3 py-2.5 border border-zinc-200 rounded-lg bg-zinc-50 outline-none"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Mobile Drawer Navigation (Slide-in) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Drawer content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white pt-5 pb-4 transition-transform duration-300">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-zinc-950/20"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="px-6 flex items-center justify-between border-b border-rose-50 pb-4">
              <div>
                <span className="font-serif tracking-widest text-lg font-bold text-zinc-950">
                  Zivora
                </span>
                <span className="block text-[8px] uppercase tracking-[0.3em] font-medium text-amber-700 -mt-1">
                  Couture Artistry
                </span>
              </div>
            </div>

            <div className="mt-5 flex-1 h-0 overflow-y-auto px-6">
              <nav className="flex flex-col space-y-4">
                <button
                  onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
                  className="text-left text-sm font-semibold uppercase tracking-wider text-zinc-800 hover:text-amber-700 py-2 border-b border-neutral-100"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavClick('all')}
                  className="text-left text-sm font-semibold uppercase tracking-wider text-zinc-800 hover:text-amber-700 py-2 border-b border-neutral-100"
                >
                  Shop All Products
                </button>
                <button
                  onClick={() => handleNavClick('press-on')}
                  className="text-left text-sm font-semibold uppercase tracking-wider text-zinc-800 hover:text-amber-700 py-2 border-b border-neutral-100 animate-slide-in"
                >
                  Press-On Nails
                </button>
                <button
                  onClick={() => handleNavClick('polish')}
                  className="text-left text-sm font-semibold uppercase tracking-wider text-zinc-800 hover:text-amber-700 py-2 border-b border-neutral-100"
                >
                  Gel Polish & Shades
                </button>
                <button
                  onClick={() => handleNavClick('art-care')}
                  className="text-left text-sm font-semibold uppercase tracking-wider text-zinc-800 hover:text-amber-700 py-2 border-b border-neutral-100"
                >
                  Nail Care & Accessories
                </button>
              </nav>

              <div className="mt-8 pt-6 border-t border-rose-50 text-xs text-zinc-500">
                <p className="font-semibold text-zinc-800 uppercase tracking-wider mb-2">Our Guarantees</p>
                <ul className="space-y-2">
                  <li>✨ Vegan & Cruelty-Free</li>
                  <li>🛡️ 14-Day Stay Adhesive</li>
                  <li>📦 Free Shipping Over $50</li>
                </ul>
              </div>
            </div>
            
            {user && (
              <div className="px-6 py-4 border-t border-rose-50 bg-rose-50/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-800">
                    Logged in: <strong>{user.name}</strong>
                  </span>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="text-xs text-red-600 font-semibold uppercase flex items-center space-x-1 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> <span>Sign Out</span>
                  </button>
                </div>
                {user.role === 'admin' && (
                  <button
                    onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
                    className="mt-3 w-full text-center py-2 bg-amber-700 text-white rounded text-xs uppercase font-bold tracking-widest cursor-pointer"
                  >
                    Admin Dashboard
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
