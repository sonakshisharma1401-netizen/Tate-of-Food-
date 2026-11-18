import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  User,
  Package,
  CalendarCheck,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  Sparkles,
  UtensilsCrossed,
  ShieldCheck,
  Edit2,
  Save,
  MessageSquare,
  Cake,
  Copy,
  Plus,
  Trash2,
  Gift,
  Receipt,
  Printer,
  X,
  MessageCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEHRADUN_CAMPUS_AREAS } from '../data/mockData';
import { OrderStatus, OWNER_INFO, Order } from '../types';

export const DashboardPage: React.FC = () => {
  const {
    user,
    updateProfile,
    addSavedAddress,
    removeSavedAddress,
    getUserOrders,
    getUserSubscriptions,
    getUserCateringBookings,
    toggleSubscriptionPause,
    addToCart,
    addFeedback,
    showToast
  } = useApp();

  const location = useLocation();
  const initialOrderId = (location.state as any)?.orderId;

  // Selected Invoice Modal State
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'subscriptions' | 'catering' | 'profile' | 'feedback'>('orders');

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [collegeOrHostel, setCollegeOrHostel] = useState(user?.collegeOrHostel || '');
  const [area, setArea] = useState(user?.area || DEHRADUN_CAMPUS_AREAS[0]);
  const [deliveryAddress, setDeliveryAddress] = useState(user?.deliveryAddress || '');

  // Add Address State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('Hostel Room');
  const [newAddrText, setNewAddrText] = useState('');
  const [newAddrArea, setNewAddrArea] = useState(DEHRADUN_CAMPUS_AREAS[0]);

  // Feedback Modal State
  const [feedbackDish, setFeedbackDish] = useState('Ghar Ki Special Thali');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const orders = getUserOrders();
  const subscriptions = getUserSubscriptions();
  const cateringBookings = getUserCateringBookings();

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      phone,
      collegeOrHostel,
      area,
      deliveryAddress
    });
    setIsEditingProfile(false);
  };

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrText.trim()) return;
    await addSavedAddress(newAddrLabel, newAddrText, newAddrArea);
    setNewAddrText('');
    setShowAddAddress(false);
  };

  const copyReferralCode = () => {
    const code = user?.referralCode || 'TASTE99';
    navigator.clipboard?.writeText(code);
    showToast(`Referral code "${code}" copied to clipboard!`);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please write a brief comment');
      return;
    }
    await addFeedback({
      userName: user?.name || 'Student Customer',
      college: user?.collegeOrHostel || 'Dehradun College Hostel',
      rating,
      comment,
      dishName: feedbackDish,
      verifiedStudent: true
    });
    setComment('');
    setFeedbackSubmitted(true);
    setTimeout(() => setFeedbackSubmitted(false), 3000);
  };

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'Placed':
        return 1;
      case 'Kitchen Preparing':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner / Student Welcome Card */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={user?.name || 'Student'}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-orange-500/50"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-orange-600 text-white px-2.5 py-0.5 rounded-full">
                Hostel Member
              </span>
              <span className="text-xs text-amber-300 font-semibold">
                Dehradun Student Pass
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Namaste, {user?.name || 'Student'}!
            </h1>
            <p className="text-xs text-stone-300 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>{user?.collegeOrHostel || 'UPES Hostel, Bidholi'}</span>
            </p>
          </div>
        </div>

        {/* Quick actions in banner */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link
            to="/menu"
            className="px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md transition-colors text-center"
          >
            + Order Food
          </Link>
          <Link
            to="/catering"
            className="px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold shadow-md transition-colors text-center flex items-center gap-1"
          >
            <Cake className="w-3.5 h-3.5" />
            Book Birthday Party
          </Link>
          <Link
            to="/subscriptions"
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors text-center"
          >
            Tiffin Plans
          </Link>
        </div>
      </div>

      {/* Referral & Promo Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-stone-900">
              Refer a Hostel Roommate & Get ₹50 Discount On Your Next Meal!
            </p>
            <p className="text-stone-600">
              Your personal invite code: <span className="font-mono font-black text-orange-700">{user?.referralCode || 'SONAKSHI50'}</span>
            </p>
          </div>
        </div>

        <button
          onClick={copyReferralCode}
          className="px-4 py-2 rounded-xl bg-white hover:bg-amber-100 text-orange-700 border border-orange-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs shrink-0"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy Referral Code</span>
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-stone-200 overflow-x-auto no-scrollbar gap-2 sm:gap-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-2 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Food Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`pb-4 px-2 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'subscriptions'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Meal Subscriptions ({subscriptions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('catering')}
          className={`pb-4 px-2 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'catering'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Cake className="w-4 h-4 text-purple-600" />
          <span>Birthday Catering ({cateringBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 px-2 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Saved Addresses</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`pb-4 px-2 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'feedback'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Rate Meal & Reviews</span>
        </button>
      </div>

      {/* TAB 1: ORDERS & TRACKING */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto space-y-3">
              <Package className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-lg font-black text-stone-900">No orders yet</h3>
              <p className="text-xs text-stone-500">
                You haven't placed any meal orders yet. Order your first homestyle thali today!
              </p>
              <Link
                to="/menu"
                className="inline-block px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs"
              >
                Explore Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const step = getStatusStep(order.orderStatus);
                const isLive = order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled';

                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-3xl border p-6 shadow-xs space-y-6 transition-all ${
                      order.id === initialOrderId ? 'ring-2 ring-orange-500 border-orange-300' : 'border-stone-200/80'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-stone-900">
                            Order #{order.id}
                          </h3>
                          <span
                            className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                              order.orderStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.orderStatus === 'Out for Delivery'
                                ? 'bg-orange-100 text-orange-800 animate-pulse'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Placed {order.createdAt} • Payment: {order.paymentStatus}
                        </p>
                      </div>

                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                        <span className="text-xl font-black text-stone-900">
                          ₹{order.totalAmount}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium">
                          {order.items.reduce((s, ci) => s + ci.quantity, 0)} items total
                        </span>
                      </div>
                    </div>

                    {/* Live Tracker Stepper */}
                    {isLive && (
                      <div className="bg-orange-50/60 rounded-2xl p-5 border border-orange-100 space-y-4">
                        <div className="flex items-center justify-between text-xs font-bold text-orange-950">
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-600 animate-spin" />
                            Live Delivery Status
                          </span>
                          <span className="text-orange-700">
                            {order.estimatedDeliveryTime || 'Estimated 30-40 mins'}
                          </span>
                        </div>

                        {/* 4 Steps */}
                        <div className="grid grid-cols-4 gap-2 text-center relative pt-2">
                          {[
                            { label: 'Order Placed', num: 1 },
                            { label: 'Kitchen Cooking', num: 2 },
                            { label: 'Out for Delivery', num: 3 },
                            { label: 'Delivered', num: 4 }
                          ].map((st) => (
                            <div key={st.num} className="space-y-1 relative">
                              <div
                                className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-black text-xs transition-colors ${
                                  step >= st.num
                                    ? 'bg-orange-600 text-white shadow-md'
                                    : 'bg-stone-200 text-stone-500'
                                }`}
                              >
                                {step > st.num ? '✓' : st.num}
                              </div>
                              <p
                                className={`text-[10px] sm:text-xs font-bold ${
                                  step >= st.num ? 'text-stone-900' : 'text-stone-400'
                                }`}
                              >
                                {st.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Items List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.items.map((ci, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-100"
                        >
                          <img
                            src={ci.item.image}
                            alt={ci.item.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0 grow">
                            <p className="text-xs font-bold text-stone-900 truncate">
                              {ci.quantity}x {ci.item.name}
                            </p>
                            <p className="text-[10px] text-stone-500">₹{ci.item.price * ci.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery destination & Repeat Order */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
                      <div className="text-stone-600 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>
                          {order.hostelName}, {order.address} ({order.area})
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5 text-stone-600" />
                          <span>View Receipt</span>
                        </button>

                        {isLive && (
                          <a
                            href={`https://wa.me/916396049872?text=Hi%20Sonakshi,%20checking%20status%20of%20Order%20%23${order.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>WhatsApp Kitchen</span>
                          </a>
                        )}

                        <button
                          onClick={() => {
                            order.items.forEach((ci) => addToCart(ci.item, ci.quantity));
                            showToast('Items added to cart for quick re-order!');
                          }}
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Re-order Items</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY MEAL SUBSCRIPTIONS */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          {subscriptions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto space-y-3">
              <CalendarCheck className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-lg font-black text-stone-900">No active meal subscription</h3>
              <p className="text-xs text-stone-500">
                Subscribe to our Weekly or Monthly plans to save up to ₹2,500/month and get regular ghar ka khana!
              </p>
              <Link
                to="/subscriptions"
                className="inline-block px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs"
              >
                View Meal Plans
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                        {sub.planTitle}
                      </span>
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                          sub.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        ● {sub.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-stone-900">
                        {sub.mealSlot === 'both'
                          ? 'Lunch & Dinner Tiffin'
                          : sub.mealSlot === 'lunch'
                          ? 'Lunch Only Tiffin'
                          : 'Dinner Only Tiffin'}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Diet: {sub.dietary === 'veg' ? '100% Pure Vegetarian' : 'Non-Vegetarian'} • ID: {sub.id}
                      </p>
                    </div>

                    {/* Progress Bar for Remaining Days */}
                    <div className="space-y-1.5 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                      <div className="flex justify-between text-xs font-bold text-stone-800">
                        <span>Remaining Meals:</span>
                        <span className="text-orange-600">{sub.remainingDays} of {sub.totalDays} Days Left</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{
                            width: `${Math.round((sub.remainingDays / sub.totalDays) * 100)}%`
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-stone-500 pt-1">
                        <span>Started: {sub.startDate}</span>
                        <span>Valid till: {sub.endDate}</span>
                      </div>
                    </div>

                    <div className="text-xs text-stone-600 space-y-1">
                      <p className="font-semibold text-stone-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-600" />
                        {sub.hostelName}
                      </p>
                      <p className="pl-5 text-stone-500 text-[11px]">{sub.deliveryAddress}</p>
                    </div>
                  </div>

                  {/* Pause / Resume Controls */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-stone-400 font-bold uppercase block">
                        Weekend / Vacation Pause
                      </span>
                      <span className="text-xs text-stone-700">
                        {sub.status === 'Active' ? 'Tiffin arriving tomorrow' : 'Tiffin currently paused'}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSubscriptionPause(sub.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                        sub.status === 'Active'
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {sub.status === 'Active' ? (
                        <>
                          <PauseCircle className="w-4 h-4" />
                          <span>Pause Tiffin</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4" />
                          <span>Resume Tiffin</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BIRTHDAY PARTY CATERING BOOKINGS */}
      {activeTab === 'catering' && (
        <div className="space-y-6">
          {cateringBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto space-y-3">
              <Cake className="w-12 h-12 text-purple-300 mx-auto" />
              <h3 className="text-lg font-black text-stone-900">No catering bookings</h3>
              <p className="text-xs text-stone-500">
                Planning a birthday celebration or wing party in Dehradun? Book our food packages starting at ₹299/person!
              </p>
              <Link
                to="/catering"
                className="inline-block px-5 py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs"
              >
                Explore Catering Packages
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cateringBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-stone-900">Booking #{b.id}</span>
                        <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full">
                          {b.eventType}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">
                        <strong>Package:</strong> {b.packageTitle} • <strong>Guests:</strong> {b.guestCount}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-stone-900">
                        ₹{b.estimatedBudget.toLocaleString('en-IN')}
                      </span>
                      <p className="text-[10px] text-stone-500">Estimated Budget</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700 bg-stone-50 p-4 rounded-2xl">
                    <div>
                      <p><strong>Event Date:</strong> {b.eventDate} ({b.eventTime})</p>
                      <p><strong>Venue Address:</strong> {b.eventLocation}</p>
                    </div>
                    <div>
                      <p><strong>Starters:</strong> {b.selectedStarters?.join(', ') || 'Standard'}</p>
                      <p><strong>Main Dishes:</strong> {b.selectedMains?.join(', ') || 'Standard'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-stone-500">Contact Sonakshi Sharma for queries:</span>
                    <a
                      href={`https://wa.me/91${OWNER_INFO.mobile}?text=Hi%20Sonakshi,%20checking%20status%20of%20my%20catering%20booking%20%23${b.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      WhatsApp Owner (+91 {OWNER_INFO.mobile})
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PROFILE & SAVED ADDRESSES */}
      {activeTab === 'profile' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-stone-900">Student Profile Information</h3>
                <p className="text-xs text-stone-500">
                  Your primary contact details saved in Firestore.
                </p>
              </div>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 disabled:bg-stone-50 text-sm outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    disabled={!isEditingProfile}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 disabled:bg-stone-50 text-sm outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Dehradun Campus Area
                </label>
                <select
                  disabled={!isEditingProfile}
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 disabled:bg-stone-50 text-sm outline-hidden bg-white"
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
                  Hostel / PG Name
                </label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  value={collegeOrHostel}
                  onChange={(e) => setCollegeOrHostel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 disabled:bg-stone-50 text-sm outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Default Gate / Room Delivery Address
                </label>
                <textarea
                  rows={2}
                  disabled={!isEditingProfile}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 disabled:bg-stone-50 text-sm outline-hidden resize-none"
                />
              </div>

              {isEditingProfile && (
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Saved Delivery Addresses Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-stone-900">Saved Campus Addresses</h3>
                <p className="text-xs text-stone-500">Quickly pick between your room, friend's PG, or campus gate.</p>
              </div>
              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Address
              </button>
            </div>

            {/* Add Address Form */}
            {showAddAddress && (
              <form onSubmit={handleAddAddressSubmit} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Label</label>
                  <input
                    type="text"
                    required
                    value={newAddrLabel}
                    onChange={(e) => setNewAddrLabel(e.target.value)}
                    placeholder="e.g. Friend's PG / Main Gate / Library"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Area</label>
                  <select
                    value={newAddrArea}
                    onChange={(e) => setNewAddrArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    {DEHRADUN_CAMPUS_AREAS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Address Details</label>
                  <input
                    type="text"
                    required
                    value={newAddrText}
                    onChange={(e) => setNewAddrText(e.target.value)}
                    placeholder="e.g. Room 102, Block A, Shree Krishna PG"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="px-3 py-2 rounded-xl border border-stone-300 text-stone-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Addresses list */}
            <div className="space-y-2">
              {(user?.savedAddresses || []).map((addr) => (
                <div key={addr.id} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                      {addr.label}
                    </span>
                    <p className="text-stone-700 mt-1">{addr.address}</p>
                    <p className="text-[10px] text-stone-500">{addr.area}</p>
                  </div>
                  <button
                    onClick={() => removeSavedAddress(addr.id)}
                    className="text-stone-400 hover:text-red-600 p-1"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MEAL RATING & FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-xl font-black text-stone-900">How Was Your Recent Meal?</h3>
            <p className="text-xs text-stone-500">
              Your feedback is read directly by Sonakshi Sharma to maintain motherly food standards.
            </p>
          </div>

          {feedbackSubmitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Thank you! Your feedback has been saved and shared with our kitchen.</span>
            </div>
          )}

          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Select Dish or Service
              </label>
              <select
                value={feedbackDish}
                onChange={(e) => setFeedbackDish(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden bg-white"
              >
                <option value="Ghar Ki Special Thali">Ghar Ki Special Thali</option>
                <option value="Pahadi Style Rajma Chawal Bowl">Pahadi Style Rajma Chawal Bowl</option>
                <option value="Deluxe Shahi Paneer Maharaja Thali">Deluxe Shahi Paneer Maharaja Thali</option>
                <option value="Punjabi Kadhi Pakoda with Chawal">Punjabi Kadhi Pakoda with Chawal</option>
                <option value="Birthday Party & Event Catering">Birthday Party & Event Catering</option>
                <option value="First Meal Welcome Thali">First Meal Welcome Thali</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Overall Taste & Hygiene Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-black text-stone-700">{rating} out of 5</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Your Review & Suggestions
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the roti softness, salt, spice level, or delivery time? We read every student review!"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/30 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Submit Student Review
            </button>
          </form>
        </div>
      )}

      {/* INVOICE / RECEIPT MODAL */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 relative max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white p-6 relative">
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded-full">
                  Official Food Bill
                </span>
                <span className="text-[10px] text-amber-300 font-mono">
                  #{selectedInvoiceOrder.id}
                </span>
              </div>
              <h3 className="text-xl font-black">Taste of Food Dehradun</h3>
              <p className="text-xs text-stone-300 mt-0.5">
                Central Kitchen • Rajpur Road / Jakhan • FSSAI Food Safety Standards Compliant (Reg. In-Process)
              </p>
            </div>

            {/* Receipt Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Order Metadata */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
                <div>
                  <span className="text-[10px] text-stone-600 uppercase font-bold block">Billed To</span>
                  <span className="font-extrabold text-stone-900 text-sm block">
                    {selectedInvoiceOrder.customerName}
                  </span>
                  <span className="text-stone-600 text-[11px] block">
                    {selectedInvoiceOrder.phone}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-600 uppercase font-bold block">Hostel Delivery</span>
                  <span className="font-bold text-stone-800 text-[11px] block truncate">
                    {selectedInvoiceOrder.hostelName}
                  </span>
                  <span className="text-stone-600 text-[10px] block truncate">
                    {selectedInvoiceOrder.address} ({selectedInvoiceOrder.area})
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden">
                <div className="bg-stone-100 px-3 py-2 flex justify-between font-bold text-stone-700 text-[11px]">
                  <span>Item Description</span>
                  <span>Amount</span>
                </div>
                <div className="divide-y divide-stone-100">
                  {selectedInvoiceOrder.items.map((ci, idx) => (
                    <div key={idx} className="px-3 py-2.5 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-stone-900">
                          {ci.quantity}x {ci.item.name}
                        </p>
                        <p className="text-[10px] text-stone-600">
                          ₹{ci.item.price} each • {ci.item.portionSize}
                        </p>
                      </div>
                      <span className="font-black text-stone-900">
                        ₹{ci.item.price * ci.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="space-y-1.5 pt-2 border-t border-stone-200">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">₹{selectedInvoiceOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Hostel Gate Delivery</span>
                  <span className="font-bold text-stone-900">
                    {selectedInvoiceOrder.deliveryCharge === 0 ? 'FREE' : `₹${selectedInvoiceOrder.deliveryCharge}`}
                  </span>
                </div>
                {selectedInvoiceOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Student Discount Applied</span>
                    <span>- ₹{selectedInvoiceOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Amount Paid</span>
                  <span className="text-orange-600">₹{selectedInvoiceOrder.totalAmount}</span>
                </div>
                <div className="flex justify-between text-[11px] text-stone-500 pt-1">
                  <span>Payment Mode</span>
                  <span className="font-bold text-stone-700">{selectedInvoiceOrder.paymentStatus}</span>
                </div>
              </div>

              {/* Owner Note */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-stone-700 text-[11px] leading-relaxed">
                Thank you for choosing Taste of Food! We cook home-style meals with pure ingredients.
                For any query or tiffin queries, contact Sonakshi Sharma at <strong>+91 6396049872</strong>.
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
