import { useState } from 'react';
import { CreditCard, Truck, CheckCircle2, ChevronRight, Lock, Calendar } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const { cart, clearCart, triggerToast, addOrder, addAddress } = useGlobal();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [promoCode, _setPromoCode] = useState('');
  const [promoDiscount, _setPromoDiscount] = useState(0); // Optional logic
  
  // Shipping Form State
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingMethod, _setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [_cardNumber, _setCardNumber] = useState('');
  const [_cardName, _setCardName] = useState('');
  const [_cardExpiry, _setCardExpiry] = useState('');
  const [_cardCvv, _setCardCvv] = useState('');
  const [_upiId, _setUpiId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [_orderId, setOrderId] = useState('');

  const itemsSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = itemsSubtotal * (promoDiscount === 0.01 ? 0 : promoDiscount);
  const isFreeShipping = itemsSubtotal >= 999 || promoCode.trim().toUpperCase() === 'FREESHIP';
  const baseShippingCost = isFreeShipping ? 0 : 79;
  const shippingCost = shippingMethod === 'express' ? baseShippingCost + 120 : baseShippingCost;
  
  const estimatedTax = (itemsSubtotal - discountAmount) * 0.18;
  const orderTotal = itemsSubtotal - discountAmount + shippingCost + estimatedTax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !address || !city || !zipCode || !phone) {
      triggerToast('Please fill out all address details.', 'error');
      return;
    }
    setStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        triggerToast('Razorpay SDK failed to load. Please check your connection.', 'error');
        setSubmitting(false);
        return;
      }

      const order = await api.createRazorpayOrder(orderTotal);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key',
        amount: order.amount,
        currency: order.currency,
        name: "Zivora Couture",
        description: "Premium Press-On Nails Purchase",
        order_id: order.id,
        handler: async function (response: any) {
          setOrderId(response.razorpay_order_id);
          
          try {
            await api.submitOrder({
              orderItems: cart.map(item => ({
                product: item.product.id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
                image: item.product.images[0],
                selectedSize: item.selectedSize,
                selectedShape: item.selectedShape
              })),
              shippingAddress: {
                fullName: `${firstName} ${lastName}`,
                streetAddress: address,
                city,
                state: 'Default',
                pincode: zipCode,
                country: 'India'
              },
              paymentMethod: 'Razorpay',
              itemsPrice: itemsSubtotal,
              shippingPrice: shippingCost,
              totalPrice: orderTotal,
              guestEmail: email,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
          } catch (e) {
            console.error("Order save error", e);
          }

          addAddress({ firstName, lastName, street: address, city, zipCode, phone });
          addOrder({
            id: response.razorpay_order_id,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            total: orderTotal,
            status: 'Processing',
            items: [...cart],
          });
          setStep(3);
          clearCart();
          triggerToast('Payment Successful! Order Confirmed.', 'success');
        },
        prefill: {
          name: `${firstName} ${lastName}`,
          email: email,
          contact: phone
        },
        theme: { color: "#b45309" } // Amber 700
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        triggerToast(`Payment Failed: ${response.error.description}`, 'error');
      });
      paymentObject.open();
      
    } catch (e) {
      triggerToast('Failed to initialize payment gateway. Is the backend running?', 'error');
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 3) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mx-auto text-emerald-500 shadow-sm animate-scale">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-amber-700 tracking-widest uppercase">Order Confirmed</span>
          <h2 className="font-serif text-3xl font-bold text-zinc-950">Thank you for your purchase!</h2>
          <p className="text-sm text-zinc-500 font-light max-w-sm mx-auto">
            Your payment was processed successfully. We've sent a receipt and tracking confirmation details to <strong>{email}</strong>.
          </p>
        </div>
        <div className="pt-4 flex justify-center">
          <button onClick={() => navigate('/')} className="px-8 py-3 bg-zinc-950 text-white font-medium text-xs tracking-wider uppercase rounded-lg hover:bg-zinc-850 transition-colors shadow-sm cursor-pointer">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-serif text-3xl font-semibold text-zinc-950 mb-8 text-center sm:text-left">Checkout Securely</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center space-x-2 text-xs uppercase font-bold tracking-wider pb-4 border-b border-rose-50/50">
            <span className={step >= 1 ? 'text-amber-800' : 'text-zinc-400'}>1. Shipping</span>
            <ChevronRight className="w-4 h-4 text-zinc-300" />
            <span className={step >= 2 ? 'text-amber-800' : 'text-zinc-400'}>2. Payment</span>
            <ChevronRight className="w-4 h-4 text-zinc-300" />
            <span className="text-zinc-400">3. Confirmation</span>
          </div>

          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-3 flex items-center">
                <Truck className="w-4.5 h-4.5 text-amber-700 mr-2" />
                Delivery Information
              </h2>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full text-xs p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-amber-700 bg-zinc-50/30" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block">First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full text-xs p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-amber-700 bg-zinc-50/30" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block">Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full text-xs p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-amber-700 bg-zinc-50/30" required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block">Street Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full text-xs p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-amber-700 bg-zinc-50/30" required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block">City</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full text-xs p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-amber-700 bg-zinc-50/30" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block">PIN Code</label>
                  <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="w-full text-xs p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-amber-700 bg-zinc-50/30" required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block">Phone Number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full text-xs p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-amber-700 bg-zinc-50/30" required />
              </div>
              <button type="submit" className="w-full py-4 bg-zinc-950 hover:bg-zinc-850 text-white font-medium text-xs tracking-widest uppercase rounded-lg shadow-sm transition-colors mt-6 cursor-pointer">
                Continue to Payment
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center">
                  <Lock className="w-4 h-4 text-emerald-600 mr-2" />
                  Select Payment Method
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setPaymentMethod('card')} className={`flex items-center justify-center space-x-2 p-4 border rounded-xl transition-all cursor-pointer ${paymentMethod === 'card' ? 'border-amber-700 bg-amber-50/40 text-amber-950 shadow-sm' : 'border-zinc-200 hover:border-zinc-300 text-zinc-600 bg-white'}`}>
                    <CreditCard className="w-5 h-5" />
                    <div className="text-left"><span className="text-xs font-bold block">Credit / Debit Card</span></div>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('upi')} className={`flex items-center justify-center space-x-2 p-4 border rounded-xl transition-all cursor-pointer ${paymentMethod === 'upi' ? 'border-amber-700 bg-amber-50/40 text-amber-950 shadow-sm' : 'border-zinc-200 hover:border-zinc-300 text-zinc-600 bg-white'}`}>
                    <div className="text-left"><span className="text-xs font-bold block">UPI via Razorpay</span></div>
                  </button>
                </div>
              </div>
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-4 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold text-xs tracking-wider uppercase rounded-lg transition-colors cursor-pointer">
                  Back
                </button>
                <button type="submit" disabled={submitting} className="flex-1 py-4 bg-zinc-950 hover:bg-zinc-850 text-white font-medium text-xs tracking-widest uppercase rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer disabled:bg-zinc-400">
                  {submitting ? <span>Processing...</span> : <span>Submit Payment</span>}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="bg-zinc-50/50 border border-rose-100 rounded-2xl p-6 sticky top-28 space-y-6">
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest border-b border-zinc-200/60 pb-3 flex items-center">
              <Calendar className="w-4 h-4 text-amber-700 mr-2" />
              Order Summary
            </h2>
            <div className="border-t border-zinc-200 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600"><span>Subtotal</span><span>₹{itemsSubtotal.toFixed(0)}</span></div>
              <div className="flex justify-between text-zinc-600"><span>Shipping Cost</span><span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(0)}`}</span></div>
              <div className="flex justify-between text-zinc-600"><span>GST (18%)</span><span>₹{estimatedTax.toFixed(0)}</span></div>
              <div className="border-t border-zinc-200 pt-3 flex justify-between text-sm font-bold text-zinc-900"><span>Order Total</span><span>₹{orderTotal.toFixed(0)}</span></div>
            </div>
            <div className="pt-4 border-t border-zinc-200 space-y-3">
              <div className="flex items-center space-x-2 text-zinc-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs">256-bit SSL Secure Checkout</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs">14-Day Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
