import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Check,
  Sparkles,
  ShieldCheck,
  Clock,
  Coffee,
  Sun,
  Moon,
  Info,
  ArrowRight,
  PauseCircle,
  HelpCircle,
  Award,
  Zap,
  TrendingDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MealSlot, DietaryType, SubscriptionPlanType } from '../types';
import { DEHRADUN_CAMPUS_AREAS } from '../data/mockData';

export const SubscriptionsPage: React.FC = () => {
  const { user, subscriptions, createSubscription, showToast } = useApp();
  const navigate = useNavigate();

  // Selected configurators
  const [activePlan, setActivePlan] = useState<SubscriptionPlanType>('monthly');
  const [selectedSlot, setSelectedSlot] = useState<MealSlot>('both');
  const [selectedDiet, setSelectedDiet] = useState<DietaryType>('veg');
  const [customDays, setCustomDays] = useState<number>(15);

  // Subscribe modal state
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '');
  const [hostelName, setHostelName] = useState(user?.collegeOrHostel || '');
  const [area, setArea] = useState(user?.area || DEHRADUN_CAMPUS_AREAS[0]);
  const [deliveryAddress, setDeliveryAddress] = useState(user?.deliveryAddress || '');

  // Calculate pricing based on slot and days
  // Base daily rate:
  // Lunch only: ₹75/meal (Veg), ₹95 (Non-Veg)
  // Dinner only: ₹75/meal (Veg), ₹95 (Non-Veg)
  // Both: ₹130/day (Veg) instead of 150, ₹170 (Non-Veg)
  const getDailyRate = (slot: MealSlot, diet: DietaryType) => {
    if (slot === 'both') {
      return diet === 'veg' ? 130 : 170;
    }
    return diet === 'veg' ? 75 : 95;
  };

  const currentDailyRate = getDailyRate(selectedSlot, selectedDiet);

  const getPlanDays = (plan: SubscriptionPlanType) => {
    if (plan === 'weekly') return 7;
    if (plan === 'monthly') return 30;
    return customDays;
  };

  const totalDays = getPlanDays(activePlan);
  const totalAmount = currentDailyRate * totalDays;

  // Comparison with outside food (avg outside meal is ₹120 each, so ₹240 for 2 meals)
  const outsideCostPerDay = selectedSlot === 'both' ? 240 : 120;
  const totalOutsideCost = outsideCostPerDay * totalDays;
  const studentSavings = Math.max(0, totalOutsideCost - totalAmount);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !hostelName || !deliveryAddress) {
      showToast('Please fill in your phone number and hostel address');
      return;
    }

    const title =
      activePlan === 'weekly'
        ? 'Weekly Homestyle Tiffin Plan'
        : activePlan === 'monthly'
        ? 'Monthly Student Champion Plan'
        : `Custom ${customDays}-Day Flexible Plan`;

    createSubscription({
      planType: activePlan,
      planTitle: title,
      mealSlot: selectedSlot,
      dietary: selectedDiet,
      totalDays,
      pricePerDay: currentDailyRate,
      deliveryAddress,
      area,
      hostelName,
      phone
    });

    setSubscribeModalOpen(false);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
          <CalendarCheck className="w-3.5 h-3.5 text-orange-600" />
          <span>No-Lockin Hostel Tiffin Plans</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
          Student Meal Subscriptions
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Nutritious home-cooked lunch and dinner delivered hot every day to your hostel gate in Dehradun.
          Enjoy pure desi ghee rotis, fresh seasonal sabzis, and the freedom to pause anytime.
        </p>

        {/* Demo data notice */}
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-xs text-amber-900 font-medium">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Illustrative Sample Pricing:</strong> Rates shown are sample estimates until confirmed by Taste of Food central management.
          </span>
        </div>
      </div>

      {/* Plan Preference Selectors: Slot & Diet */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Meal Slot Selector */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-stone-500 mb-2">
              Step 1: Select Meal Timing
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedSlot('lunch')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedSlot === 'lunch'
                    ? 'border-orange-600 bg-orange-50/70 text-orange-950 font-black shadow-xs'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Sun className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                <span className="text-xs block font-bold">Lunch Only</span>
                <span className="text-[10px] text-stone-500">12:30 PM</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSlot('dinner')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedSlot === 'dinner'
                    ? 'border-orange-600 bg-orange-50/70 text-orange-950 font-black shadow-xs'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Moon className="w-5 h-5 mx-auto text-indigo-500 mb-1" />
                <span className="text-xs block font-bold">Dinner Only</span>
                <span className="text-[10px] text-stone-500">8:00 PM</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSlot('both')}
                className={`p-3 rounded-2xl border text-center transition-all relative ${
                  selectedSlot === 'both'
                    ? 'border-orange-600 bg-orange-50/70 text-orange-950 font-black shadow-xs'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span className="absolute -top-2 right-2 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                  Best Value
                </span>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <Moon className="w-4 h-4 text-indigo-500" />
                </div>
                <span className="text-xs block font-bold">Both Meals</span>
                <span className="text-[10px] text-emerald-700 font-bold">Lunch + Dinner</span>
              </button>
            </div>
          </div>

          {/* Dietary Choice */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-stone-500 mb-2">
              Step 2: Dietary Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedDiet('veg')}
                className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition-all ${
                  selectedDiet === 'veg'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-xs'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-xs border-2 border-emerald-600 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                </span>
                <div className="text-left">
                  <span className="text-xs block font-bold">100% Pure Veg</span>
                  <span className="text-[10px] text-stone-500">Paneer, Dal, Sabzi</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDiet('non-veg')}
                className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition-all ${
                  selectedDiet === 'non-veg'
                    ? 'border-rose-600 bg-rose-50 text-rose-950 font-black shadow-xs'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-xs border-2 border-rose-600 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                </span>
                <div className="text-left">
                  <span className="text-xs block font-bold">Non-Veg Included</span>
                  <span className="text-[10px] text-stone-500">Chicken/Egg 3x week</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Live Savings Calculator Banner */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-950 text-xs">
          <div className="flex items-center gap-2.5">
            <TrendingDown className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <p className="font-black text-emerald-900">
                You save estimated ₹{studentSavings} every {totalDays} days compared to outside food!
              </p>
              <p className="text-emerald-700 text-[11px]">
                Plus 100% freedom from greasy stomach aches and irregular digestion.
              </p>
            </div>
          </div>
          <span className="bg-emerald-700 text-white font-black px-3 py-1 rounded-xl text-[11px] whitespace-nowrap">
            ₹{currentDailyRate}/day effective rate
          </span>
        </div>
      </div>

      {/* The 3 Core Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Plan 1: Weekly */}
        <div
          onClick={() => setActivePlan('weekly')}
          className={`cursor-pointer bg-white rounded-3xl p-8 border-2 transition-all duration-200 flex flex-col justify-between relative ${
            activePlan === 'weekly'
              ? 'border-orange-600 shadow-xl ring-4 ring-orange-500/10'
              : 'border-stone-200 hover:border-stone-300 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                7 Days Trial
              </span>
              <span className="text-xs text-stone-500 font-semibold">Weekly Plan</span>
            </div>

            <h3 className="text-2xl font-black text-stone-900">Weekly Meal Pass</h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Ideal for new college joiners testing our food quality and delivery punctuality.
            </p>

            <div className="my-6 pt-4 border-t border-stone-100">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-stone-900">
                  ₹{currentDailyRate * 7}
                </span>
                <span className="text-xs text-stone-500 font-medium">/ 7 days</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                (Equivalent to ₹{currentDailyRate} per day for {selectedSlot === 'both' ? '2 meals' : '1 meal'})
              </p>
            </div>

            <ul className="space-y-3 text-xs text-stone-700">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hot delivery directly at hostel gate</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fresh rotating menu daily</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero soda, pure desi ghee phulkas</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pause up to 2 days anytime</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActivePlan('weekly');
                setSubscribeModalOpen(true);
              }}
              className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-orange-600 text-white font-extrabold text-xs transition-colors shadow-md"
            >
              Subscribe Weekly Plan
            </button>
          </div>
        </div>

        {/* Plan 2: Monthly (Highlighted) */}
        <div
          onClick={() => setActivePlan('monthly')}
          className={`cursor-pointer bg-gradient-to-b from-orange-50/70 via-white to-white rounded-3xl p-8 border-2 transition-all duration-200 flex flex-col justify-between relative ${
            activePlan === 'monthly'
              ? 'border-orange-600 shadow-2xl ring-4 ring-orange-500/20'
              : 'border-orange-300 shadow-md'
          }`}
        >
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Most Popular Choice</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                30 Days Pass
              </span>
              <span className="text-xs text-stone-500 font-semibold">Maximum Savings</span>
            </div>

            <h3 className="text-2xl font-black text-stone-900">Student Champion Plan</h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Complete semester meal peace of mind. Highest savings, free Sunday special desserts, and VIP student priority support.
            </p>

            <div className="my-6 pt-4 border-t border-stone-100">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-orange-600">
                  ₹{currentDailyRate * 30}
                </span>
                <span className="text-xs text-stone-500 font-medium">/ 30 days</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                (Only ₹{currentDailyRate} per day • Save up to ₹2,500/mo)
              </p>
            </div>

            <ul className="space-y-3 text-xs text-stone-700">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Everything in Weekly, plus:</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Free Sunday Dessert:</strong> Gulab jamun / kheer</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Flexible Pause:</strong> Pause up to 8 days when visiting home</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Free stainless steel tiffin container exchange</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActivePlan('monthly');
                setSubscribeModalOpen(true);
              }}
              className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs transition-colors shadow-lg shadow-orange-600/30"
            >
              Subscribe Monthly Pass
            </button>
          </div>
        </div>

        {/* Plan 3: Custom Flexi Plan */}
        <div
          onClick={() => setActivePlan('custom')}
          className={`cursor-pointer bg-white rounded-3xl p-8 border-2 transition-all duration-200 flex flex-col justify-between relative ${
            activePlan === 'custom'
              ? 'border-orange-600 shadow-xl ring-4 ring-orange-500/10'
              : 'border-stone-200 hover:border-stone-300 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Custom Duration
              </span>
              <span className="text-xs text-stone-500 font-semibold">Exam & Prep Days</span>
            </div>

            <h3 className="text-2xl font-black text-stone-900">Custom Meal Plan</h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Customize your exact number of days for mid-terms, final exams, or specific stay periods.
            </p>

            {/* Day slider / picker */}
            <div className="my-5 p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                <span>Select Days:</span>
                <span className="text-orange-600 text-sm font-black">{customDays} Days</span>
              </div>
              <input
                type="range"
                min={5}
                max={45}
                value={customDays}
                onChange={(e) => setCustomDays(Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-medium">
                <span>5 Days</span>
                <span>15 Days</span>
                <span>30 Days</span>
                <span>45 Days</span>
              </div>
            </div>

            <div className="my-4 pt-2 border-t border-stone-100">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-stone-900">
                  ₹{currentDailyRate * customDays}
                </span>
                <span className="text-xs text-stone-500 font-medium">/ {customDays} days</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-stone-700">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pick your own exact day count</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full pause control for exam study leaves</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Same daily rate with zero commitment</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActivePlan('custom');
                setSubscribeModalOpen(true);
              }}
              className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-orange-600 text-white font-extrabold text-xs transition-colors shadow-md"
            >
              Subscribe Custom Plan
            </button>
          </div>
        </div>
      </div>

      {/* Subscription FAQ & Pause Policy Section */}
      <div className="bg-[#FAF6EE] rounded-3xl p-8 sm:p-10 border border-stone-200 space-y-6">
        <h3 className="text-2xl font-black text-stone-900 text-center">
          How Student Subscriptions Work
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-700">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="text-sm font-black text-stone-900">How do I pause meals when going home?</h4>
            <p className="leading-relaxed text-stone-600">
              Simply log in to your Student Dashboard and tap the "Pause" toggle at least 3 hours before lunch or dinner. Your day gets carried forward automatically.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="text-sm font-black text-stone-900">How is food delivered to hostel?</h4>
            <p className="leading-relaxed text-stone-600">
              Our delivery partners carry thermal insulated hot-bags. You receive an SMS & WhatsApp alert 10 minutes prior to delivery at your hostel gate.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="text-sm font-black text-stone-900">Can I change address mid-plan?</h4>
            <p className="leading-relaxed text-stone-600">
              Yes! If you shift PGs or change hostels in Dehradun, update your address in your profile and the next day's meal will arrive at your new residence.
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Checkout Modal */}
      {subscribeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 relative max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-stone-900 px-2 py-0.5 rounded-full">
                Confirm Subscription
              </span>
              <h3 className="text-2xl font-black mt-1">
                {activePlan === 'weekly'
                  ? '7-Day Weekly Trial'
                  : activePlan === 'monthly'
                  ? '30-Day Monthly Pass'
                  : `${customDays}-Day Custom Plan`}
              </h3>
              <p className="text-xs text-amber-100 mt-1">
                {selectedSlot === 'both' ? 'Lunch + Dinner' : selectedSlot === 'lunch' ? 'Lunch Only' : 'Dinner Only'} • {selectedDiet === 'veg' ? 'Pure Veg' : 'Non-Veg'} • ₹{totalAmount} Total
              </p>
            </div>

            <form onSubmit={handleSubscribeSubmit} className="p-6 overflow-y-auto space-y-4">
              {subscriptions.some((s) => s.status === 'Active' && s.userId === user?.id) && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Existing Active Plan Notice</span>
                  </p>
                  <p className="text-[11px] text-amber-800">
                    You already have an active subscription in your account. Subscribing again will register a second concurrent meal plan (for a roommate or extra shift).
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  10-Digit Mobile Number (For Meal Call) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Dehradun Campus Zone *
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden bg-white"
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
                  Hostel / PG Name *
                </label>
                <input
                  type="text"
                  required
                  value={hostelName}
                  onChange={(e) => setHostelName(e.target.value)}
                  placeholder="e.g. Shree Krishna Boys Hostel, Bidholi"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Gate / Room Delivery Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Room 204, Block B, Near UPES Bidholi Gate No. 2"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden resize-none"
                />
              </div>

              {/* Payment note */}
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
                Payment mode: <strong>Pay on 1st Day Delivery (Cash or UPI)</strong>. No prepayment risk!
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSubscribeModalOpen(false)}
                  className="w-1/3 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="grow py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-lg shadow-orange-600/30 flex items-center justify-center gap-1.5"
                >
                  <span>Confirm Subscription • ₹{totalAmount}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
