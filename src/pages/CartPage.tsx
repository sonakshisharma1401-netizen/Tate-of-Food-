import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Info,
  Clock,
  MapPin,
  Utensils
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryCharge,
    discountAmount,
    cartTotal,
    coupon,
    applyCoupon,
    removeCoupon
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [cookingNote, setCookingNote] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCode('');
    }
  };

  const freeDeliveryThreshold = 199;
  const freeDeliveryProgress = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-amber-100 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-stone-900">Your Food Cart is Empty</h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            You haven't added any warm homestyle dishes yet. Browse our daily tiffin menu and treat yourself to clean, homemade cooking!
          </p>
        </div>
        <div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-lg shadow-orange-600/30 transition-transform hover:scale-105"
          >
            <Utensils className="w-4 h-4" />
            Explore Daily Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-stone-900">Your Student Food Cart</h1>
          <p className="text-xs text-stone-600 mt-1">
            Review your selected homestyle items before proceeding to campus delivery.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 hover:underline"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="mb-8 bg-amber-50 rounded-2xl p-4 border border-amber-200">
        <div className="flex items-center justify-between text-xs font-bold text-amber-950 mb-2">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-600" />
            {deliveryCharge === 0 ? (
              <span className="text-emerald-700">🎉 Congratulations! You have unlocked FREE Delivery!</span>
            ) : (
              <span>Add ₹{amountNeededForFreeDelivery} more to get FREE Hostel Gate Delivery!</span>
            )}
          </span>
          <span>{freeDeliveryProgress}%</span>
        </div>
        <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-orange-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${freeDeliveryProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-base font-black text-stone-900 border-b border-stone-100 pb-3">
              Selected Dishes ({cart.length})
            </h3>

            <div className="divide-y divide-stone-100">
              {cart.map((cartItem) => (
                <div key={cartItem.item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center">
                  <img
                    src={cartItem.item.image}
                    alt={cartItem.item.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />

                  <div className="grow min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-xs border-2 flex items-center justify-center shrink-0 ${
                          cartItem.item.dietary === 'veg'
                            ? 'border-emerald-600'
                            : 'border-rose-600'
                        }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${
                            cartItem.item.dietary === 'veg'
                              ? 'bg-emerald-600'
                              : 'bg-rose-600'
                          }`}
                        />
                      </span>
                      <h4 className="font-extrabold text-stone-900 text-sm truncate">
                        {cartItem.item.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-stone-600 truncate mt-0.5">
                      {cartItem.item.portionSize}
                    </p>
                    <p className="text-sm font-black text-stone-900 mt-1">
                      ₹{cartItem.item.price}
                    </p>
                  </div>

                  {/* Quantity Changer */}
                  <div className="flex items-center bg-stone-100 rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => updateCartQuantity(cartItem.item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center shadow-xs transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-black text-sm text-stone-900">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(cartItem.item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center shadow-xs transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total for item & Delete */}
                  <div className="text-right shrink-0">
                    <p className="font-black text-stone-900 text-sm">
                      ₹{cartItem.item.price * cartItem.quantity}
                    </p>
                    <button
                      onClick={() => removeFromCart(cartItem.item.id)}
                      className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cooking instructions note */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              Special Cooking Instructions for Chef (Optional)
            </label>
            <textarea
              rows={2}
              value={cookingNote}
              onChange={(e) => setCookingNote(e.target.value)}
              placeholder="e.g. Less spicy dal, pack green chili salad separately, extra pickle..."
              className="w-full p-3 rounded-2xl border border-stone-200 text-xs focus:border-orange-500 outline-hidden resize-none bg-stone-50/50"
            />
          </div>
        </div>

        {/* Order Summary & Coupon */}
        <div className="lg:col-span-5 space-y-4">
          {/* Promo code box */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-orange-600" />
              Apply Student Promo Code
            </h4>

            {coupon ? (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 text-emerald-800 font-extrabold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Coupon '{coupon.code}' applied</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Saved ₹{discountAmount} on this order!
                  </p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. STUDENT99"
                  className="grow px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold uppercase tracking-wider focus:border-orange-500 outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors shrink-0"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && (
              <p className="text-xs text-red-600 font-semibold">{couponError}</p>
            )}

            {/* Quick suggested coupon tags */}
            {!coupon && (
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => applyCoupon('STUDENT99')}
                  className="text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 px-2.5 py-1 rounded-lg"
                >
                  STUDENT99 (20% off)
                </button>
                <button
                  onClick={() => applyCoupon('DEHRADUN50')}
                  className="text-[11px] font-bold bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-300/80 px-2.5 py-1 rounded-lg"
                >
                  DEHRADUN50 (₹50 off)
                </button>
              </div>
            )}
          </div>

          {/* Bill Breakdown */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-black text-stone-900 border-b border-stone-100 pb-3">
              Bill Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-stone-900">₹{cartSubtotal}</span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span className="flex items-center gap-1">
                  Hostel Gate Delivery
                  {deliveryCharge === 0 && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-sm font-bold">
                      FREE
                    </span>
                  )}
                </span>
                <span className={deliveryCharge === 0 ? 'text-emerald-700 font-bold' : 'font-bold text-stone-900'}>
                  {deliveryCharge === 0 ? '₹0' : `₹${deliveryCharge}`}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Student Promo Discount</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <div>
                  <span className="text-base font-black text-stone-900">Total Payable</span>
                  <p className="text-[10px] text-stone-500 font-medium">Includes all taxes & packaging</p>
                </div>
                <span className="text-2xl font-black text-orange-600">
                  ₹{cartTotal}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-102 active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-stone-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe Food • Contactless Delivery at Hostel Gate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
