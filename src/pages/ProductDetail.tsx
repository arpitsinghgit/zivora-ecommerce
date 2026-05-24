import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Check, Plus, Minus, Heart, Sparkles } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Product } from '../data/products';
import { useGlobal } from '../context/GlobalContext';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, wishlist, addToWishlist, removeFromWishlist } = useGlobal();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedShape, setSelectedShape] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customMeasurements, setCustomMeasurements] = useState('');
  const [addedStatus, setAddedStatus] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', content: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { user, triggerToast } = useGlobal();

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
      api.getProductById(id).then(data => {
        if (data) {
          setProduct(data);
          setSelectedShape(data.shapes?.[0] || '');
          setSelectedSize(data.sizes?.[0] || '');
          setSelectedColor(data.colors?.[0]?.name || '');
        }
      });
      api.getProducts().then(data => {
        setRelatedProducts(data.products ? data.products.filter((p: any) => p.id !== id).slice(0, 4) : []);
      });
      api.getReviews(id).then(data => {
        if (Array.isArray(data)) setReviews(data);
      });
    }
  }, [id]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      triggerToast('Please login to review', 'error');
      return;
    }
    try {
      await api.addReview(product!.id, reviewForm, user.token);
      triggerToast('Review submitted successfully', 'success');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', content: '' });
      const newReviews = await api.getReviews(product!.id);
      setReviews(newReviews);
    } catch (error: any) {
      triggerToast(error.message, 'error');
    }
  };

  if (!product) {
    return <div className="py-20 text-center">Loading...</div>;
  }



  const isWished = wishlist.includes(product.id);
  const handleWishlistToggle = () => {
    if (isWished) removeFromWishlist(product.id);
    else addToWishlist(product.id);
  };

  const handleAddToCart = () => {
    const sizeParam = product.category === 'press-on' ? selectedSize : undefined;
    const shapeParam = product.category === 'press-on' ? selectedShape : undefined;
    const colorParam = product.category === 'polish' ? selectedColor : undefined;
    
    const finalSize = selectedSize === 'Custom' && customMeasurements
      ? `Custom (${customMeasurements})`
      : sizeParam;

    addToCart(product, finalSize, shapeParam, colorParam, quantity);
    
    setAddedStatus(true);
    setTimeout(() => setAddedStatus(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate('/shop')} className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-950 mb-8 group cursor-pointer">
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" /> Back to shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Carousel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/5] bg-zinc-50 rounded-2xl overflow-hidden border border-rose-50/50">
            <img src={product.images[activeImageIndex]} alt={product.name} className="w-full h-full object-cover object-center transition-all duration-500" />
            {product.bestSeller && <span className="absolute top-4 left-4 text-[10px] font-bold tracking-widest uppercase bg-amber-700 text-white px-3.5 py-1.5 rounded-sm shadow-sm">Best Seller</span>}
            
            {/* Wishlist Button Overlay */}
            <button 
              onClick={handleWishlistToggle}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 hover:bg-white text-zinc-800 shadow-md cursor-pointer transition-all"
            >
              <Heart className={`w-5 h-5 ${isWished ? 'fill-rose-500 text-rose-500' : 'text-zinc-600'}`} />
            </button>

            {product.images.length > 1 && (
              <>
                <button onClick={() => setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-zinc-800 shadow-md cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setActiveImageIndex((prev) => (prev + 1) % product.images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-zinc-800 shadow-md cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
              </>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`aspect-[4/5] rounded-lg overflow-hidden bg-zinc-50 border-2 transition-all ${idx === activeImageIndex ? 'border-amber-700 scale-98 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover object-center" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Order Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-amber-700/90 uppercase block mb-1">{product.categoryLabel}</span>
            <h1 className="font-serif text-3xl font-semibold text-zinc-950">{product.name}</h1>
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />)}
              </div>
              <a href="#reviews" className="text-xs font-semibold text-zinc-500 hover:text-amber-800 underline cursor-pointer">{product.rating} / 5.0 (24 Reviews)</a>
            </div>
          </div>

          {/* Pricing */}
          <div className="py-4 border-y border-zinc-100 flex items-center justify-between">
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl font-bold text-zinc-950">₹{product.price.toFixed(0)}</span>

            </div>
            <div className="text-right">
              {product.inStock ? <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-sm">In Stock</span> : <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-sm">Sold Out</span>}
            </div>
          </div>

          <p className="text-sm text-zinc-600 leading-relaxed font-light">{product.description}</p>

          <div className="space-y-5 pt-2">
            {product.shapes && product.shapes.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-zinc-800 tracking-wider uppercase">Select Nail Shape</label>
                  <span className="text-xs text-zinc-500 font-medium italic">Selected: {selectedShape}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {product.shapes.map((shape) => (
                    <button key={shape} onClick={() => setSelectedShape(shape)} className={`py-2 px-3 text-xs font-semibold border rounded-lg transition-all ${selectedShape === shape ? 'border-amber-700 bg-amber-50/50 text-amber-950 shadow-xs' : 'border-zinc-200 hover:border-zinc-400 text-zinc-700 bg-white'}`}>{shape}</button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-zinc-800 tracking-wider uppercase">Select Nail Size</label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`min-w-12 py-2 px-3.5 text-xs font-semibold border rounded-lg transition-all ${selectedSize === size ? 'border-amber-700 bg-amber-50/50 text-amber-950 shadow-xs' : 'border-zinc-200 hover:border-zinc-400 text-zinc-700 bg-white'}`}>{size}</button>
                  ))}
                </div>
                {selectedSize === 'Custom' && (
                  <div className="mt-3 p-3 bg-zinc-50 border border-zinc-200 rounded-lg animate-fade-in">
                    <input type="text" placeholder="e.g. 15mm, 12mm, 13mm, 11mm, 9mm" value={customMeasurements} onChange={(e) => setCustomMeasurements(e.target.value)} className="w-full text-xs p-2 border border-zinc-200 rounded-md focus:outline-none focus:border-amber-700 bg-white" />
                  </div>
                )}
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-zinc-800 tracking-wider uppercase">Select Color Shade</label>
                  <span className="text-xs text-zinc-500 font-semibold">{selectedColor}</span>
                </div>
                <div className="flex items-center space-x-3.5">
                  {product.colors.map((color) => (
                    <button key={color.name} onClick={() => setSelectedColor(color.name)} className={`w-8 h-8 rounded-full border-2 transition-all relative flex items-center justify-center ${selectedColor === color.name ? 'border-zinc-950 scale-110 shadow-sm' : 'border-zinc-200 hover:scale-105'}`} style={{ backgroundColor: color.hex }} title={color.name}>
                      {selectedColor === color.name && <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 pt-4">
              <label className="text-xs font-bold text-zinc-800 tracking-wider uppercase block">Quantity</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50/50">
                  <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} className="p-2.5 text-zinc-500 hover:text-zinc-950 cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="px-4 text-xs font-bold text-zinc-850 w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity((prev) => prev + 1)} className="p-2.5 text-zinc-500 hover:text-zinc-950 cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
                </div>
                <button onClick={handleAddToCart} disabled={!product.inStock} className="flex-1 py-3 px-6 bg-zinc-950 hover:bg-zinc-850 text-white font-medium text-xs tracking-widest uppercase rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer disabled:bg-zinc-300">
                  {addedStatus ? <><Check className="w-4 h-4 text-emerald-400" /><span>Added to Bag!</span></> : <span>Add to Shopping Bag</span>}
                </button>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="pt-6 mt-6 border-t border-zinc-100">
              <div className="grid grid-cols-3 gap-2 text-center divide-x divide-zinc-100">
                <div className="px-2">
                  <Sparkles className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-[9px] font-bold uppercase text-zinc-500">Salon Quality</p>
                </div>
                <div className="px-2">
                  <svg className="w-5 h-5 mx-auto text-amber-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  <p className="text-[9px] font-bold uppercase text-zinc-500">Secure Pay</p>
                </div>
                <div className="px-2">
                  <svg className="w-5 h-5 mx-auto text-amber-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  <p className="text-[9px] font-bold uppercase text-zinc-500">Easy Returns</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div id="reviews" className="mt-20 pt-16 border-t border-zinc-200">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <h2 className="font-serif text-2xl font-bold text-zinc-900 mb-4">Customer Reviews</h2>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-4xl font-bold text-zinc-950">{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
              <div className="flex flex-col">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-current' : ''}`} />)}
                </div>
                <span className="text-xs text-zinc-500 mt-1">Based on {reviews.length} reviews</span>
              </div>
            </div>
            {user ? (
              <button onClick={() => setShowReviewForm(!showReviewForm)} className="w-full py-2.5 border-2 border-zinc-950 text-zinc-950 font-semibold text-xs tracking-wider uppercase rounded-lg hover:bg-zinc-950 hover:text-white transition-colors cursor-pointer">
                Write a Review
              </button>
            ) : (
              <p className="text-xs text-zinc-500">Please login to write a review.</p>
            )}
            
            {showReviewForm && (
              <form onSubmit={submitReview} className="mt-4 p-4 border border-zinc-200 rounded-lg space-y-3 bg-zinc-50">
                <div>
                  <label className="text-xs font-bold block mb-1">Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})} className="w-full p-2 border border-zinc-200 rounded text-xs" required />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Title</label>
                  <input type="text" value={reviewForm.title} onChange={e => setReviewForm({...reviewForm, title: e.target.value})} className="w-full p-2 border border-zinc-200 rounded text-xs" required />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Review</label>
                  <textarea value={reviewForm.content} onChange={e => setReviewForm({...reviewForm, content: e.target.value})} className="w-full p-2 border border-zinc-200 rounded text-xs" rows={3} required />
                </div>
                <button type="submit" className="w-full py-2 bg-amber-700 text-white rounded text-xs font-bold uppercase cursor-pointer hover:bg-amber-800">Submit</button>
              </form>
            )}
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            {reviews.length === 0 ? (
              <p className="text-zinc-500 text-sm">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review: any, idx: number) => (
                <div key={idx} className="pb-6 border-b border-zinc-100 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex text-amber-400 mb-1">
                        {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : ''}`} />)}
                      </div>
                      <span className="font-bold text-sm text-zinc-900">{review.title}</span>
                    </div>
                    <span className="text-xs text-zinc-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-zinc-600 mb-2">{review.content}</p>
                  <div className="flex items-center space-x-2 text-xs text-zinc-500">
                    <span className="font-semibold text-zinc-700">{review.name}</span>
                    <span className="flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider">
                      <Check className="w-2.5 h-2.5 mr-0.5" /> Verified Buyer
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-16 border-t border-zinc-200">
          <h2 className="font-serif text-2xl font-bold text-zinc-900 mb-8 text-center">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <div key={rel.id} className="group cursor-pointer" onClick={() => navigate(`/product/${rel.id}`)}>
                <div className="aspect-[4/5] bg-zinc-50 rounded-xl overflow-hidden mb-3">
                  <img src={rel.images[0]} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-xs font-bold text-zinc-900 line-clamp-1 group-hover:text-amber-700 transition-colors">{rel.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">₹{rel.price.toFixed(0)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
