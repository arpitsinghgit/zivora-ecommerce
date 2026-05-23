import { useState } from 'react';
import { Star, Heart, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../data/products';
import { useGlobal } from '../context/GlobalContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, shape?: string) => void;
}

export default function ProductCard({ product, onSelect, onAddToCart }: ProductCardProps) {
  const { wishlist, addToWishlist, removeFromWishlist } = useGlobal();
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [addedMessage, setAddedMessage] = useState(false);

  const isLiked = wishlist.includes(product.id);

  const discountAmount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.category === 'press-on') {
      // For press-ons, require size/shape default choice or pop options
      setShowQuickAdd(!showQuickAdd);
    } else {
      // For polish or accessories, just add immediately
      onAddToCart(product);
      triggerSuccessMessage();
    }
  };

  const handleSelectQuickSize = (e: React.MouseEvent, size: string, shape: string) => {
    e.stopPropagation();
    onAddToCart(product, size, shape);
    setShowQuickAdd(false);
    triggerSuccessMessage();
  };

  const triggerSuccessMessage = () => {
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickAdd(false);
      }}
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-zinc-100/60 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Gallery */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-50">
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
          {product.bestSeller && (
            <span className="text-[9px] font-bold tracking-widest uppercase bg-amber-700 text-white px-2.5 py-1 rounded-sm shadow-sm">
              Best Seller
            </span>
          )}
          {product.newArrival && (
            <span className="text-[9px] font-bold tracking-widest uppercase bg-zinc-950 text-white px-2.5 py-1 rounded-sm shadow-sm">
              New
            </span>
          )}
          {product.originalPrice && (
            <span className="text-[9px] font-bold tracking-widest uppercase bg-rose-600 text-white px-2.5 py-1 rounded-sm shadow-sm">
              -{discountAmount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isLiked) {
              removeFromWishlist(product.id);
            } else {
              addToWishlist(product.id);
            }
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors z-20 shadow-sm cursor-pointer ${
            isLiked 
              ? 'bg-rose-500 text-white hover:bg-rose-600' 
              : 'bg-white/80 text-zinc-600 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Success/Added Overlay */}
        {addedMessage && (
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-30 transition-opacity duration-200">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center mb-2">
              <Check className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider">Added to bag</span>
          </div>
        )}

        {/* Quick Add Shape/Size Popover */}
        {showQuickAdd && product.shapes && product.sizes && (
          <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md p-3 z-30 border-t border-rose-50 shadow-lg animate-slide-up" onClick={e => e.stopPropagation()}>
            <span className="block text-[10px] font-bold text-zinc-700 uppercase tracking-widest text-center mb-2">
              Select Shape & Size
            </span>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1 justify-center max-h-[70px] overflow-y-auto">
                {product.sizes.slice(0, 4).map((size) => (
                  <button
                    key={size}
                    onClick={(e) => handleSelectQuickSize(e, size, product.shapes?.[0] || 'Almond')}
                    className="text-[9px] font-semibold border border-zinc-200 hover:border-amber-700 hover:bg-amber-50 px-2 py-1.5 rounded-sm transition-colors text-zinc-800"
                  >
                    {size} ({product.shapes?.[0]})
                  </button>
                ))}
              </div>
              <button 
                onClick={() => onSelect(product)} 
                className="w-full text-center text-[9px] font-bold text-amber-700 hover:underline uppercase block tracking-wider"
              >
                More Sizes & Custom Customization
              </button>
            </div>
          </div>
        )}

        {/* Quick Add to Bag overlay trigger */}
        {!addedMessage && !showQuickAdd && (
          <div className="absolute inset-x-0 bottom-0 p-3 z-20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleQuickAddClick}
              className="w-full py-2.5 bg-zinc-950/90 hover:bg-zinc-950 text-white font-medium text-xs tracking-wider uppercase rounded-md shadow-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer backdrop-blur-xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{product.category === 'press-on' ? 'Quick Options' : 'Quick Add'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Info section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700/80">
            {product.categoryLabel}
          </span>
          <h3 className="font-serif text-sm font-semibold text-zinc-900 group-hover:text-amber-800 transition-colors mt-0.5 line-clamp-1">
            {product.name}
          </h3>
          
          {/* Reviews Star Rating */}
          <div className="flex items-center space-x-1 mt-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) ? 'fill-current' : ''
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-zinc-500 font-medium">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-3 flex items-baseline space-x-2 pt-2 border-t border-zinc-50">
          <span className="text-sm font-bold text-zinc-900">
            ₹{product.price.toFixed(0)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-zinc-400 line-through">
              ₹{product.originalPrice.toFixed(0)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
