import { useState } from 'react';
import { Send, Sparkles, ShieldAlert, FileText, Heart, Smile, Globe } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  const handleExplore = (category: string) => {
    if (category === 'all') navigate('/shop');
    else navigate(`/shop?category=${category}`);
  };

  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-rose-900/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Newsletter subscription & brand statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-zinc-800">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <span className="font-serif tracking-widest text-lg font-bold uppercase">Zivora</span>
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-amber-500">• Couture Artistry</span>
            </div>
            <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-md">
              Zivora is a premium e-commerce sanctuary dedicated to everyday luxury. We curate handcrafted jewelry and salon-grade manicure essentials designed for fashion enthusiasts and nail artists alike.
            </p>
            
            {/* Social media shortcuts */}
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-amber-600 hover:text-white transition-colors text-zinc-400" aria-label="Instagram">
                <Smile className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-amber-600 hover:text-white transition-colors text-zinc-400" aria-label="Pinterest">
                <Send className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-amber-600 hover:text-white transition-colors text-zinc-400" aria-label="TikTok">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-amber-600 hover:text-white transition-colors text-zinc-400" aria-label="Youtube">
                <Heart className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center">
              <Sparkles className="w-4 h-4 text-amber-500 mr-1.5 animate-pulse" />
              Subscribe to the Zivora Style Newsletter
            </h3>
            <p className="text-xs text-zinc-400 font-light">
              Receive <strong>15% OFF</strong> code, priority access to new collections, and DIY nail art tutorials.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-lg animate-fade-in font-medium">
                ✨ Subscribed successfully! Check your inbox for your 15% discount code: <strong>WELCOME15</strong>.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 text-xs px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-l-lg focus:outline-none focus:border-amber-600 text-white placeholder-zinc-500"
                  required
                />
                <button
                  type="submit"
                  className="px-6 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-r-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Middle Section: Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-12 text-xs">
          
          <div className="space-y-4">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Shop Categories</h4>
            <ul className="space-y-2 text-zinc-400 font-light">
              <li>
                <button 
                  onClick={() => handleExplore('all')} 
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left block w-full"
                >
                  View All Products
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleExplore('press-on')} 
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left block w-full"
                >
                  Luxury Press-On Nails
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleExplore('polish')} 
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left block w-full"
                >
                  HEMA-Free Gel Polishes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleExplore('art-care')} 
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left block w-full"
                >
                  Care Oils & LED Lamps
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleExplore('accessories')} 
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left block w-full"
                >
                  Jewelry & Accessories
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Sizing & Fitting</h4>
            <ul className="space-y-2 text-zinc-400 font-light">
              <li>
                <Link 
                  to="/page/sizing-chart"
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left block"
                >
                  Press-On Sizing Chart
                </Link>
              </li>
              <li>
                <Link 
                  to="/page/how-to-measure"
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left block"
                >
                  How to Measure Nails
                </Link>
              </li>
              <li>
                <Link 
                  to="/page/application-removal"
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left block"
                >
                  Application & Removal Guides
                </Link>
              </li>
              <li>
                <Link 
                  to="/page/free-sizing-kit"
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left block"
                >
                  Free Sizing Kit Program
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Support & FAQs</h4>
            <ul className="space-y-2 text-zinc-400 font-light">
              <li>
                <Link 
                  to="/page/shipping"
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left block"
                >
                  Shipping & Customs Details
                </Link>
              </li>
              <li>
                <Link 
                  to="/page/returns"
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left block"
                >
                  Return Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/page/support-ticket"
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left block"
                >
                  Submit a Support Ticket
                </Link>
              </li>
              <li>
                <Link 
                  to="/page/faqs"
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left block"
                >
                  Support & FAQs
                </Link>
              </li>
              <li>
                <Link 
                  to="/page/wholesale"
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left block"
                >
                  Wholesale & Salon Partners
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Brand Sanctuary</h4>
            <ul className="space-y-2 text-zinc-400 font-light">
              <li>
                <Link 
                  to="/page/about"
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left block"
                >
                  About Zivora
                </Link>
              </li>
              <li>
                <Link 
                  to="/page/leaping-bunny"
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left block"
                >
                  Leaping Bunny Certification
                </Link>
              </li>
              <li>
                <Link 
                  to="/page/carbon-neutral"
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left block"
                >
                  Carbon Neutral Shipments
                </Link>
              </li>
              <li>
                <Link 
                  to="/page/press"
                  className="hover:text-amber-500 transition-colors cursor-pointer text-left block"
                >
                  Press & Media Enquiries
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright & Badges */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] text-zinc-550 font-light">
          <div>
            &copy; {new Date().getFullYear()} Zivora Couture. All rights reserved. Designed for everyday luxury and salon-quality manicures.
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1 hover:text-zinc-300">
              <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" />
              <Link to="/page/privacy-policy" className="cursor-pointer hover:underline">
                Privacy Policy
              </Link>
            </div>
            <div className="flex items-center space-x-1 hover:text-zinc-300">
              <FileText className="w-3.5 h-3.5 text-zinc-500" />
              <Link to="/page/terms-of-service" className="cursor-pointer hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
