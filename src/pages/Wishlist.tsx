import { useEffect, useState } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { api } from '../api';
import { Product } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Heart, HeartCrack } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const { wishlist, addToCart } = useGlobal();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all products and filter locally for simplicity, 
    // or fetch by IDs if the API supports it.
    api.getProducts().then(allProducts => {
      const wishlistProducts = allProducts.filter(p => wishlist.includes(p.id));
      setProducts(wishlistProducts);
      setLoading(false);
    });
  }, [wishlist]);

  const onSelectProduct = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[60vh]">
      <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-rose-50">
        <Heart className="w-6 h-6 text-amber-700 fill-amber-700" />
        <h1 className="font-serif text-3xl font-semibold text-zinc-950">My Wishlist</h1>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-500">Loading your favorites...</div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
          <HeartCrack className="w-12 h-12 text-zinc-300 mb-4" />
          <h3 className="font-serif text-xl font-semibold text-zinc-900">Your wishlist is empty</h3>
          <p className="text-zinc-500 text-sm mt-2 mb-6 max-w-sm text-center">
            Save items you love by clicking the heart icon on any product page or catalog.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-zinc-950 text-white font-medium text-xs tracking-wider uppercase rounded-lg hover:bg-zinc-850 transition-all cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
