import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  User,
  Building2,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Banknote,
  QrCode,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEHRADUN_CAMPUS_AREAS } from '../data/mockData';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, deliveryCharge, discountAmount, cartTotal, placeOrder, user } = useApp();
  const navigate = useNavigate();

  // Form states initialized with logged in student profile if available
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [hostelName, setHostelName] = useState(user?.collegeOrHostel || '');
  const [area, setArea] = useState(user?.area || DEHRADUN_CAMPUS_AREAS[0]);
  const [address, setAddress] = useState(user?.deliveryAddress || '');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi_demo'>('cod');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect to menu
  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-stone-900">No items to checkout</h2>
        <p className="text-xs text-stone-600">Your cart is currently empty. Please add some food items first.</p>
        <Link
          to="/menu"
          className="inline-block px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs"
        >
          Go to Menu
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please provide a valid 10-digit mobile number for delivery delivery boy call');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }
    if (!hostelName.trim()) {
      setError('Please specify your Hostel, PG, or Apartment name');
      return;
    }
    if (!address.trim()) {
      setError('Please provide your room or gate delivery address');
      return;
    }

    // Payment Gateway Verification
    if (paymentMethod === 'upi_demo') {
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        setError(
          'Online Payment Gateway is not configured (missing VITE_RAZORPAY_KEY_ID in environment). To ensure complete financial audit compliance, unverified transactions cannot be marked as Paid. Please select "Cash on Delivery (COD)" to place your order.'
        );
        return;
      }

      setIsSubmitting(true);
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setError('Failed to load Razorpay payment gateway. Please check your internet connection or choose Cash on Delivery (COD).');
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: Math.round(cartTotal * 100),
        currency: 'INR',
        name: 'Taste of Food Dehradun',
        description: `Student Meal Order (${cart.length} items)`,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=128&q=80',
        prefill: {
          name: customerName,
          email: email,
          contact: phone
        },
        theme: {
          color: '#ea580c'
        },
        handler: async (response: any) => {
          try {
            const order = await placeOrder({
              customerName,
              phone,
              email,
              hostelName,
              address,
              area,
              deliveryInstructions,
              paymentMethod: 'upi_demo',
              paymentStatus: 'Paid (Razorpay)',
              transactionId: response.razorpay_payment_id
            });
            try {
              confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            } catch {}
            setIsSubmitting(false);
            navigate('/dashboard', { state: { newOrderPlaced: true, orderId: order.id } });
          } catch (err: any) {
            setError(`Order creation error after payment: ${err?.message || err}`);
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setError('Payment cancelled or closed. Your order was not placed.');
            setIsSubmitting(false);
          }
        }
      };

      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (resp: any) => {
          setError(`Payment failed: ${resp.error?.description || 'Transaction declined'}. Unverified transactions are not placed.`);
          setIsSubmitting(false);
        });
        rzp.open();
      } catch (err: any) {
        setError(`Gateway initialization error: ${err?.message || err}`);
        setIsSubmitting(false);
      }
      return;
    }

    // COD Execution
    setIsSubmitting(true);
    setTimeout(async () => {
      const order = await placeOrder({
        customerName,
        phone,
        email,
        hostelName,
        address,
        area,
        deliveryInstructions,
        paymentMethod: 'cod',
        paymentStatus: 'Cash on Delivery'
      });

      // Fire celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }

      setIsSubmitting(false);
      navigate('/dashboard', { state: { newOrderPlaced: true, orderId: order.id } });
    }, 600);
  };

  const loadRazorpayScript = (): Promise<boolean> => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-stone-900">Hostel Delivery Checkout</h1>
        <p className="text-xs text-stone-600 mt-1">
          Enter your Dehradun campus residence details to receive your meal hot and fresh.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Delivery Information */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Student Profile Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-black text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-600" />
              1. Student Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Aryan Verma"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Mobile Number (For Gate Call) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aryan.upes@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Campus Location Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                2. Dehradun Campus & Hostel Address
              </h3>
              {user?.savedAddresses && user.savedAddresses.length > 0 && (
                <span className="text-[11px] font-bold text-stone-500">
                  {user.savedAddresses.length} Saved Address{user.savedAddresses.length > 1 ? 'es' : ''}
                </span>
              )}
            </div>

            {/* Quick Saved Address Chips */}
            {user?.savedAddresses && user.savedAddresses.length > 0 && (
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/80 space-y-2">
                <p className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Quick Fill From Saved Addresses:
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.savedAddresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => {
                        setAddress(addr.address);
                        if (addr.area) setArea(addr.area);
                        setHostelName(addr.label);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 hover:border-orange-300 border border-stone-200 text-stone-800 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
                    >
                      <MapPin className="w-3 h-3 text-orange-600" />
                      <span>{addr.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Select Dehradun Campus Zone *
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden bg-white"
                >
                  {DEHRADUN_CAMPUS_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Hostel / PG / Apartment Name *
                </label>
                <input
                  type="text"
                  required
                  value={hostelName}
                  onChange={(e) => setHostelName(e.target.value)}
                  placeholder="e.g. Shree Krishna Boys Hostel / Shivani PG / Flat 302"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Complete Address & Landmark *
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Room 204, Block B, Near UPES Bidholi Gate No. 2"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g. Please call when outside guard gate / leave with warden"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-black text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-orange-600" />
              3. Payment Method
            </h3>

            {/* Note banner */}
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p>
                <strong>Hostel Delivery Protection:</strong> Cash on Delivery is active for all Dehradun campus locations. You pay upon receiving hot food from the delivery executive.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-orange-600 bg-orange-50/50 ring-2 ring-orange-500/10'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 font-black text-stone-900 text-sm">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                </div>
                <p className="text-xs text-stone-600 mt-2">
                  ✓ Verified Active. Pay via Cash or UPI QR on delivery boy's phone at your hostel gate.
                </p>
              </label>

              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'upi_demo'
                    ? 'border-orange-600 bg-orange-50/50 ring-2 ring-orange-500/10'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 font-black text-stone-900 text-sm">
                    <QrCode className="w-5 h-5 text-orange-600" />
                    <span>Online UPI Gateway</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'upi_demo'}
                    onChange={() => setPaymentMethod('upi_demo')}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                </div>
                <p className="text-xs text-stone-500 mt-2">
                  Razorpay / UPI gateway integration (requires API Key configuration in env).
                </p>
              </label>
            </div>

            {paymentMethod === 'upi_demo' && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Gateway Credentials Configuration Notice</span>
                </p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Live online UPI transactions require <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">VITE_RAZORPAY_KEY_ID</code> in environment variables.
                  If not configured, please select <strong>Cash on Delivery (COD)</strong> above for seamless testing and instant Firestore order creation.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4 sticky top-28">
            <h3 className="text-base font-black text-stone-900 border-b border-stone-100 pb-3">
              Order Items Summary ({cart.length})
            </h3>

            <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto space-y-2 pr-1">
              {cart.map((ci) => (
                <div key={ci.item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <p className="font-extrabold text-stone-900 truncate">
                      {ci.quantity}x {ci.item.name}
                    </p>
                    <p className="text-[10px] text-stone-500">{ci.item.category}</p>
                  </div>
                  <span className="font-black text-stone-900 shrink-0">
                    ₹{ci.item.price * ci.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Hostel Delivery</span>
                <span className={deliveryCharge === 0 ? 'text-emerald-700 font-bold' : 'font-bold text-stone-900'}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Student Coupon</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-base font-black text-stone-900">Total Due</span>
                <span className="text-2xl font-black text-orange-600">₹{cartTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-102 active:scale-98 disabled:opacity-70"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Place Order • ₹{cartTotal}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-1 flex items-center justify-center gap-2 text-[11px] text-stone-500">
              <Clock className="w-3.5 h-3.5 text-orange-600" />
              <span>Estimated delivery time: 30 - 40 mins</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
