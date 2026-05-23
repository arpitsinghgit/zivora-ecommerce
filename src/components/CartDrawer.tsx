import { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Minus, Plus, Tag, Check } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateCartQuantity, removeFromCart, triggerToast } = useGlobal();
  const navigate = useNavigate();
  
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  if (!isOpen) return null;

  // Calculate math
  const itemsSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Promo code verification
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === 'WELCOME15') {
      setPromoDiscount(0.15);
      triggerToast('Success! 15% discount has been applied.', 'success');
    } else if (cleanCode === 'FREESHIP') {
      triggerToast('Success! Free shipping applied to this order.', 'success');
      // Handled in shipping cost calc
      setPromoDiscount(promoDiscount || 0.01); // Trigger small flag
    } else {
      triggerToast('Invalid promo code. Try WELCOME15 for 15% off.', 'error');
    }
  };

  const discountAmount = itemsSubtotal * (promoDiscount === 0.01 ? 0 : promoDiscount);
  const isFreeShipping = itemsSubtotal >= 999 || promoCode.trim().toUpperCase() === 'FREESHIP';
  const shippingCost = itemsSubtotal === 0 ? 0 : (isFreeShipping ? 0 : 79);
  const remainingForFreeShipping = Math.max(0, 999 - itemsSubtotal);
  
  const orderTotal = itemsSubtotal - discountAmount + shippingCost;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        
        {/* Backdrop overlay */}
        <div 
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300" 
        />

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-in-out">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-rose-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-amber-700" />
                <h2 className="font-serif text-lg font-bold text-zinc-950 uppercase tracking-wider">
                  Your Bag ({cart.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-zinc-800 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress bar */}
            {itemsSubtotal > 0 && (
              <div className="px-6 py-3.5 bg-rose-50/50 border-b border-rose-100 text-xs">
                {isFreeShipping ? (
                  <div className="flex items-center space-x-1.5 text-emerald-800 font-semibold animate-pulse">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Congratulations! You've unlocked Free Shipping 📦</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-zinc-600 text-[11px]">
                      Add <strong className="text-amber-800">₹{remainingForFreeShipping.toFixed(0)}</strong> more to get <strong>FREE SHIPPING!</strong>
                    </p>
                    <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-700 h-full transition-all duration-500 rounded-full"
                        style={{ width: `${Math.min(100, (itemsSubtotal / 999) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-zinc-100">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-900/60">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-zinc-900">Your bag is empty</h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-[240px]">
                      Add some beautiful press-on nails or luxury polishes to get started.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/shop');
                    }}
                    className="px-6 py-2.5 bg-zinc-950 text-white font-medium text-xs tracking-wider uppercase rounded-lg hover:bg-zinc-850 transition-all cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="py-4 flex space-x-4">
                    
                    {/* Item Thumbnail */}
                    <div className="w-20 aspect-[3/4] bg-zinc-50 rounded-lg overflow-hidden border border-zinc-100 flex-shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover object-center" />
                    </div>

                    {/* Item Configuration */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <h4 className="text-xs font-semibold text-zinc-900 line-clamp-2">
                            {item.product.name}
                          </h4>
                          <span className="text-xs font-bold text-zinc-900 ml-2">
                            ₹{(item.product.price * item.quantity).toFixed(0)}
                          </span>
                        </div>
                        
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                          {item.product.categoryLabel}
                        </p>

                        {/* Press-on specs */}
                        {(item.selectedShape || item.selectedSize) && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {item.selectedShape && (
                              <span className="text-[9px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded uppercase">
                                Shape: {item.selectedShape}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="text-[9px] font-semibold text-rose-900 bg-rose-50 px-2 py-0.5 rounded uppercase">
                                Size: {item.selectedSize}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Gel Polish specs */}
                        {item.selectedColor && (
                          <div className="flex items-center space-x-1.5 mt-1.5">
                            <span className="text-[9px] font-medium text-zinc-500">Shade:</span>
                            <span className="text-[9px] font-bold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded uppercase">
                              {item.selectedColor}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls & Delete */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-zinc-200 rounded bg-zinc-50">
                          <button
                            onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                            className="p-1 text-zinc-500 hover:text-zinc-900 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-[11px] font-bold text-zinc-800 w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                            className="p-1 text-zinc-500 hover:text-zinc-900 cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(idx)}
                          className="p-1 text-zinc-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Calculator Summary */}
            {cart.length > 0 && (
              <div className="border-t border-rose-100 p-6 bg-zinc-50/50 space-y-4">
                
                {/* Coupon input */}
                <form onSubmit={handleApplyPromo} className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Promo Code (WELCOME15)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full text-xs pl-8 pr-2 py-2 border border-zinc-200 rounded-md bg-white uppercase focus:outline-none focus:border-amber-700"
                    />
                    <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs uppercase tracking-wider rounded-md transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {/* Subtotal, discounts, total details */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-zinc-900">₹{itemsSubtotal.toFixed(0)}</span>
                  </div>
                  
                  {promoDiscount > 0 && promoDiscount !== 0.01 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span className="flex items-center">
                        <Tag className="w-3 h-3 mr-1" />
                        Discount (WELCOME15)
                      </span>
                      <span>-₹{discountAmount.toFixed(0)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-zinc-900">
                      {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(0)}`}
                    </span>
                  </div>

                  <div className="border-t border-zinc-200 pt-2 flex justify-between text-sm font-bold text-zinc-900">
                    <span>Estimated Total</span>
                    <span>₹{orderTotal.toFixed(0)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => {
                    onClose();
                    navigate('/checkout');
                  }}
                  className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-850 text-white font-medium text-xs tracking-widest uppercase rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <p className="text-[10px] text-center text-zinc-400 font-light">
                  Tax calculated at checkout. Safe and secure checkout processing.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
