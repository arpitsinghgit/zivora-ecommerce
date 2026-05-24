import { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, RotateCcw, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Product } from '../data/products';
import { useGlobal } from '../context/GlobalContext';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useGlobal();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter States
  const [selectedShape, setSelectedShape] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);
  const [viewStyle, setViewStyle] = useState<'grid3' | 'grid4'>('grid3');
  const [isLoading, setIsLoading] = useState(false);

  const shapes = ['All', 'Almond', 'Coffin', 'Square', 'Oval', 'Stiletto'];
  const sizes = ['All', 'XS', 'S', 'M', 'L', 'Custom'];

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const filters = {
          category: selectedCategory,
          search: searchQuery,
          shape: selectedShape,
          size: selectedSize,
          priceRange,
          sortBy,
          page,
          limit: 12
        };
        const data = await api.getProducts(filters);
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
        setTotalProducts(data.total || 0);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategory, searchQuery, selectedShape, selectedSize, priceRange, sortBy, page]);

  const setCategory = (cat: string) => {
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
    handleResetFilters();
  };

  const handleResetFilters = () => {
    setSelectedShape('All');
    setSelectedSize('All');
    setPriceRange('All');
    setSortBy('featured');
    setPage(1);
    if (searchParams.has('search')) {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  };

  const onSelectProduct = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Header */}
      <div className="text-center mb-10">
        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-[0.25em] block mb-1">
          Zivora Premium Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-zinc-950 capitalize">
          {selectedCategory === 'all' ? 'The Whole Collection' : 
           selectedCategory === 'press-on' ? 'Designer Press-On Nails' : 
           selectedCategory === 'polish' ? 'High-Gloss Gel Shades' : 
           selectedCategory === 'accessories' ? 'Jewelry & Accessories' :
           'Prep & Care Tools'}
        </h1>
        <p className="text-xs text-zinc-500 font-light mt-2 max-w-lg mx-auto">
          Cruelty-free, vegan formulations and salon-tested durability. Achieve premium results at home in just minutes.
        </p>
      </div>

      {/* Category Switcher Tabs */}
      <div className="flex justify-center border-b border-zinc-100 mb-8 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex space-x-6 sm:space-x-10 text-xs font-semibold uppercase tracking-wider">
          {(['all', 'press-on', 'polish', 'accessories', 'art-care'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`py-3.5 border-b-2 px-1 transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'border-amber-700 text-amber-950 font-bold scale-102'
                  : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
            >
              {cat === 'all' ? 'All Products' : cat === 'press-on' ? 'Press-Ons' : cat === 'polish' ? 'Gel Polish' : cat === 'accessories' ? 'Jewelry' : 'Care & Tools'}
            </button>
          ))}
        </div>
      </div>

      {/* Filtering Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-zinc-100 mb-8">
        <div className="flex items-center justify-between md:justify-start gap-4">
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="flex items-center space-x-2 px-4 py-2 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-750 hover:bg-rose-50/50 hover:border-zinc-350 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {selectedShape !== 'All' || selectedSize !== 'All' || priceRange !== 'All' ? '(Active)' : ''}</span>
          </button>
          <span className="text-xs text-zinc-500 font-medium">
            Showing {products.length} of {totalProducts} items
          </span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3.5">
          <div className="hidden lg:flex items-center space-x-1.5 border-r border-zinc-200 pr-3.5">
            <button onClick={() => setViewStyle('grid3')} className={`p-1.5 rounded ${viewStyle === 'grid3' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400'}`}><Grid className="w-4 h-4" /></button>
            <button onClick={() => setViewStyle('grid4')} className={`p-1.5 rounded ${viewStyle === 'grid4' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400'}`}><List className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-zinc-500 font-medium">Sort by:</span>
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }} className="p-2 border border-zinc-200 rounded-lg">
              <option value="featured">Best Matches</option>
              <option value="rating">Top Customer Rated</option>
              <option value="newest">New Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFiltersMobile && (
        <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-down">
          {(selectedCategory === 'all' || selectedCategory === 'press-on') && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-800 uppercase block">Nail Shape</label>
              <select value={selectedShape} onChange={(e) => { setSelectedShape(e.target.value); setPage(1); }} className="w-full p-2.5 border border-zinc-200 rounded-lg">
                {shapes.map(s => <option key={s} value={s}>{s === 'All' ? 'All Shapes' : s}</option>)}
              </select>
            </div>
          )}
          {(selectedCategory === 'all' || selectedCategory === 'press-on') && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-800 uppercase block">Nail Size</label>
              <select value={selectedSize} onChange={(e) => { setSelectedSize(e.target.value); setPage(1); }} className="w-full p-2.5 border border-zinc-200 rounded-lg">
                {sizes.map(sz => <option key={sz} value={sz}>{sz === 'All' ? 'All Sizes' : sz}</option>)}
              </select>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-800 uppercase block">Price Range</label>
            <select value={priceRange} onChange={(e) => { setPriceRange(e.target.value); setPage(1); }} className="w-full p-2.5 border border-zinc-200 rounded-lg">
              <option value="All">All Prices</option>
              <option value="under-20">Under ₹300</option>
              <option value="20-40">₹300 to ₹800</option>
              <option value="over-40">Over ₹800</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handleResetFilters} className="w-full py-2.5 border border-dashed border-zinc-300 hover:border-amber-700 hover:text-amber-800 rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5" /><span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="text-center py-20 text-zinc-500">Loading premium products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
          <Filter className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="font-serif text-lg font-semibold text-zinc-900">No products match your criteria</h3>
        </div>
      ) : (
        <>
          <div className={`grid gap-6 ${viewStyle === 'grid4' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onAddToCart={addToCart}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center space-x-4">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-zinc-200 rounded-lg disabled:opacity-50 hover:bg-zinc-50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-zinc-700">
                Page {page} of {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-zinc-200 rounded-lg disabled:opacity-50 hover:bg-zinc-50 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
