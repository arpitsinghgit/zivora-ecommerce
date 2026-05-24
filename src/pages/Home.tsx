import { useState, useEffect } from 'react';
import { ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Product } from '../data/products';
import Hero from '../components/Hero';

export default function Home() {
  const navigate = useNavigate();
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    // Use API wrapper to fetch data
    api.getTrendingProducts().then(setBestSellers);
  }, []);

  const handleExploreCategory = (category: string) => {
    if (category === 'all') {
      navigate('/shop');
    } else {
      navigate(`/shop?category=${category}`);
    }
  };

  const handleSelectProduct = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Animated Hero Slider */}
      <Hero onExplore={handleExploreCategory} />

      {/* 2. Trending Premium Collections Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-[10px] font-bold text-amber-700 tracking-widest uppercase block mb-1">
            Season Lookbook
          </span>
          <h2 className="font-serif text-3xl font-semibold text-zinc-950">
            Trending Nail aesthetics
          </h2>
          <p className="text-xs text-zinc-500 font-light max-w-md mx-auto mt-2">
            Discover curations designed by master nail technicians for high-end boutique results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            onClick={() => handleExploreCategory('press-on')}
            className="group relative h-[380px] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-900/20 to-transparent z-10" />
            <img 
              src="https://images.pexels.com/photos/10609757/pexels-photo-10609757.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800" 
              alt="Glazed Donut Aesthetics" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute bottom-6 left-6 right-6 z-20 text-white space-y-1">
              <span className="text-[9px] font-bold tracking-widest uppercase text-amber-400">Best Seller</span>
              <h3 className="font-serif text-xl font-bold">The Glazed Pearl Finish</h3>
              <p className="text-xs text-zinc-300 font-light line-clamp-2">
                Get that signature chrome milky sheen. High gloss, reusable, and fits comfortable like a custom gel set.
              </p>
              <span className="inline-flex items-center space-x-1 text-xs text-white font-semibold pt-2 hover:underline">
                <span>Explore Press-ons</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          <div 
            onClick={() => handleExploreCategory('polish')}
            className="group relative h-[380px] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-900/20 to-transparent z-10" />
            <img 
              src="https://images.pexels.com/photos/2281695/pexels-photo-2281695.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800" 
              alt="Luxury Nudes & Cremes" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute bottom-6 left-6 right-6 z-20 text-white space-y-1">
              <span className="text-[9px] font-bold tracking-widest uppercase text-amber-400">HEMA-Free</span>
              <h3 className="font-serif text-xl font-bold">Velvety Mocha & Nudes</h3>
              <p className="text-xs text-zinc-300 font-light line-clamp-2">
                Elegant undertones designed to flatter all skin tones. 10-free certified toxin-free premium self-leveling gel.
              </p>
              <span className="inline-flex items-center space-x-1 text-xs text-white font-semibold pt-2 hover:underline">
                <span>Browse Shades</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          <div 
            onClick={() => handleExploreCategory('art-care')}
            className="group relative h-[380px] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-900/20 to-transparent z-10" />
            <img 
              src="https://images.pexels.com/photos/6135684/pexels-photo-6135684.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" 
              alt="Manicure Ritual Tools" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute bottom-6 left-6 right-6 z-20 text-white space-y-1">
              <span className="text-[9px] font-bold tracking-widest uppercase text-amber-400">Ritual Care</span>
              <h3 className="font-serif text-xl font-bold">Cuticle Repair & UV Curing</h3>
              <p className="text-xs text-zinc-300 font-light line-clamp-2">
                Elevate your manicure ritual with botanical cuticle oils and professional smart-sensor UV/LED lamps.
              </p>
              <span className="inline-flex items-center space-x-1 text-xs text-white font-semibold pt-2 hover:underline">
                <span>Shop Accessories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Promotional Highlight Banner */}
      <section className="bg-rose-50/40 border-y border-rose-100/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-center lg:text-left">
            <span className="text-[10px] font-bold tracking-widest text-amber-800 uppercase block">The Desi Press-On Advantage</span>
            <h2 className="font-serif text-2xl sm:text-3.5xl font-bold text-zinc-950">
              Salon-Perfect Nails. Ghar Pe. In Minutes.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed font-light">
              Why spend ₹2000-₹5000 every month at the parlour? Zivora press-on sets give you the same salon-finish manicure at a fraction of the cost. Reuse up to 5 times, apply in minutes, and look flawless for every shaadi, festival, and office day.
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-left pt-2">
              <div className="p-3.5 bg-white border border-rose-100/30 rounded-xl space-y-1">
                <h4 className="text-xs font-bold text-zinc-900 uppercase">Save Time & Money</h4>
                <p className="text-[11px] text-zinc-500 font-light">Apply in under 10 minutes at home. Skip the ₹2000 parlour bill.</p>
              </div>
              <div className="p-3.5 bg-white border border-rose-100/30 rounded-xl space-y-1">
                <h4 className="text-xs font-bold text-zinc-900 uppercase">Made for Indian Skin</h4>
                <p className="text-[11px] text-zinc-500 font-light">Shades curated for wheatish to dusky Indian skin tones. HEMA-free & safe.</p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => handleExploreCategory('all')}
                className="px-6 py-3 bg-zinc-950 text-white font-medium text-xs tracking-wider uppercase rounded-lg hover:bg-zinc-850 transition-colors inline-flex items-center space-x-2 cursor-pointer"
              >
                <span>Explore the Full Shop</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-rose-100 max-w-lg mx-auto lg:max-w-none">
            <img 
              src="https://images.pexels.com/photos/6135673/pexels-photo-6135673.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" 
              alt="Manicure setting" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs px-3.5 py-2 rounded-lg border border-rose-50 text-[10px] text-zinc-700 flex items-center space-x-1.5 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Certified Salon Standard</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Best Sellers Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 text-center sm:text-left">
          <div>
            <span className="text-[10px] font-bold text-amber-700 tracking-widest uppercase block mb-1">
              Bestselling Favorites
            </span>
            <h2 className="font-serif text-3xl font-semibold text-zinc-950">
              Loved By Our Community
            </h2>
          </div>
          <button
            onClick={() => handleExploreCategory('all')}
            className="mt-4 sm:mt-0 text-xs font-bold text-amber-800 hover:text-amber-950 underline underline-offset-4 uppercase tracking-wider block"
          >
            View All Best Sellers
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellers.slice(0, 3).map((product) => (
            <div
              key={product.id}
              onClick={() => handleSelectProduct(product)}
              className="group cursor-pointer relative bg-white border border-zinc-100 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="relative aspect-[3/4] bg-zinc-50 overflow-hidden">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600&auto=format&fit=crop'}
                  alt={product.name || 'Product'}
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-[9px] font-bold tracking-widest uppercase bg-amber-700 text-white px-2.5 py-1 rounded-sm">
                  Best Seller
                </span>
              </div>

              <div className="p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-amber-700">
                    {product.categoryLabel}
                  </span>
                  <h3 className="font-serif text-sm font-semibold text-zinc-900 mt-0.5 line-clamp-1">
                    {product.name || 'Unnamed Product'}
                  </h3>
                  
                  <div className="flex items-center space-x-1 mt-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating || 5) ? 'fill-current' : ''
                        }`}
                      />
                    ))}
                    <span className="text-[10px] text-zinc-400 ml-1">({product.reviewCount || 0})</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-50 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-zinc-900">₹{(product.price || 0).toFixed(0)}</span>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider group-hover:underline">
                    Select Options
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
