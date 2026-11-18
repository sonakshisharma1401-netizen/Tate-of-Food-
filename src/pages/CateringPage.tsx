import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PartyPopper,
  Sparkles,
  Users,
  Calendar,
  Clock,
  MapPin,
  Check,
  ShieldCheck,
  Phone,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  UtensilsCrossed,
  Cake,
  HeartHandshake,
  DollarSign,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CateringPackageType, OWNER_INFO } from '../types';
import { DEHRADUN_CAMPUS_AREAS } from '../data/mockData';
import confetti from 'canvas-confetti';

interface PackageOption {
  type: CateringPackageType;
  title: string;
  pricePerPerson: number;
  popular?: boolean;
  description: string;
  startersCount: number;
  mainsCount: number;
  breadsCount: number;
  dessertsCount: number;
  features: string[];
}

const PACKAGES: PackageOption[] = [
  {
    type: 'Basic',
    title: 'Basic Birthday Treat',
    pricePerPerson: 299,
    description: 'Perfect for casual hostel birthday bashes, room celebrations, and small get-togethers.',
    startersCount: 2,
    mainsCount: 2,
    breadsCount: 2,
    dessertsCount: 1,
    features: [
      '2 Chatpata Starters',
      '2 Main Course Gravies (Paneer + Dal/Sabzi)',
      'Steamed Basmati Rice & 2 Breads',
      '1 Warm Sweet Dessert',
      'High-grade biodegradable cutlery included',
      'Delivered hot in insulated chafing containers'
    ]
  },
  {
    type: 'Standard',
    title: 'Standard Campus Feast',
    pricePerPerson: 449,
    popular: true,
    description: 'Our most booked package for rooftop PG birthdays, department parties, and college club events.',
    startersCount: 3,
    mainsCount: 3,
    breadsCount: 3,
    dessertsCount: 2,
    features: [
      '3 Premium Starters (Tikka, Rolls, Manchurian)',
      '3 Deluxe Mains (Shahi Paneer, Dal Makhani, etc.)',
      'Matar Pulao + Butter Naan & Phulkas',
      '2 Desserts (Gulab Jamun with Ice Cream)',
      'Buffet table setup with food warmers',
      '1 Dedicated on-site serving staff included'
    ]
  },
  {
    type: 'Premium',
    title: 'Royal Celebration Banquet',
    pricePerPerson: 649,
    description: 'Complete lavish culinary spread for college fests, society farewells, and milestone 21st birthdays.',
    startersCount: 4,
    mainsCount: 4,
    breadsCount: 3,
    dessertsCount: 3,
    features: [
      '4 Starters (Veg & Non-Veg options)',
      '4 Royal Mains (Paneer Lababdar, Dal Bukhara, etc.)',
      'Dum Biryani + Raita + Assorted Tandoori Breads',
      '3 Desserts & Live Mocktail Station',
      'Full elegant buffet table decoration & chaffing dishes',
      '2 Uniformed catering captains on-site'
    ]
  }
];

const STARTER_OPTIONS = [
  'Paneer Tikka with Mint Chutney',
  'Crispy Corn Salt & Pepper',
  'Veg Spring Rolls with Sweet Chilli',
  'Hara Bhara Kabab',
  'Veg Manchurian Dry',
  'Crispy Honey Chilli Potatoes',
  'Chicken Malai Tikka (Non-Veg)',
  'Chilli Chicken Dry (Non-Veg)'
];

const MAIN_OPTIONS = [
  'Shahi Paneer with Cashew Gravy',
  'Kadhai Paneer Masala',
  'Slow Cooked Dal Makhani',
  'Yellow Arhar Dal Double Tadka',
  'Pahadi Soya Chaap Curry',
  'Seasonal Mixed Vegetable',
  'Homestyle Chicken Curry (Non-Veg)',
  'Butter Chicken Boneless (Non-Veg)'
];

const BREAD_RICE_OPTIONS = [
  'Tawa Phulkas with Pure Desi Ghee',
  'Butter Garlic Naan',
  'Crispy Tandoori Roti',
  'Laccha Paratha',
  'Steamed Basmati Rice',
  'Jeera Peas Pulao',
  'Hyderabadi Dum Biryani'
];

const DESSERT_OPTIONS = [
  'Hot Gulab Jamun with Vanilla Ice Cream',
  'Desi Ghee Moong Dal Halwa',
  'Kesar Pista Kheer',
  'Rasgulla in Rose Syrup',
  'Warm Chocolate Brownie with Fudge'
];

export const CateringPage: React.FC = () => {
  const { user, cateringBookings, createCateringBooking, showToast } = useApp();
  const navigate = useNavigate();

  // Enquiry status tracking state
  const [trackInput, setTrackInput] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [trackedBooking, setTrackedBooking] = useState<any>(null);

  // Form & customizer state
  const [selectedPackage, setSelectedPackage] = useState<CateringPackageType>('Standard');
  const [guestCount, setGuestCount] = useState<number>(25);
  const [eventType, setEventType] = useState<'Birthday Party' | 'Hostel College Fest' | 'Farewell / Freshers' | 'Other Celebration'>('Birthday Party');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('7:30 PM');
  const [eventLocation, setEventLocation] = useState(user?.deliveryAddress || '');
  const [clientName, setClientName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [specialRequests, setSpecialRequests] = useState('');

  // Selected menu item choices
  const [selectedStarters, setSelectedStarters] = useState<string[]>([
    'Paneer Tikka with Mint Chutney',
    'Crispy Corn Salt & Pepper'
  ]);
  const [selectedMains, setSelectedMains] = useState<string[]>([
    'Shahi Paneer with Cashew Gravy',
    'Slow Cooked Dal Makhani'
  ]);
  const [selectedBreads, setSelectedBreads] = useState<string[]>([
    'Tawa Phulkas with Pure Desi Ghee',
    'Jeera Peas Pulao'
  ]);
  const [selectedDesserts, setSelectedDesserts] = useState<string[]>([
    'Hot Gulab Jamun with Vanilla Ice Cream'
  ]);

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate pricing
  const currentPkg = PACKAGES.find((p) => p.type === selectedPackage) || PACKAGES[1];
  const estimatedBudget = currentPkg.pricePerPerson * guestCount;

  // Toggle item in array helper
  const toggleSelection = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !phone.trim() || !eventDate || !eventLocation.trim()) {
      showToast('Please fill in your name, contact phone, event date, and location');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      showToast('Please provide a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);
    try {
      await createCateringBooking({
        clientName,
        phone,
        email,
        packageType: selectedPackage,
        packageTitle: `${currentPkg.title} (₹${currentPkg.pricePerPerson}/person)`,
        guestCount,
        eventDate,
        eventTime,
        eventLocation,
        eventType,
        selectedStarters,
        selectedMains,
        selectedBreads,
        selectedDesserts,
        specialRequests,
        estimatedBudget
      });

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setBookingSuccess(true);
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-orange-100/60 via-[#FFFDF9] to-[#FFFDF9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600 text-white text-xs font-black shadow-md">
            <Cake className="w-4 h-4 text-amber-200" />
            <span>Dehradun Student Birthday Parties & Event Catering</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-tight">
            Celebrate In Your Hostel or PG With <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700">
              Mouth-Watering Feast & Full Setup!
            </span>
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Planning a birthday bash, wing party, farewell, or college fest celebration?
            Taste of Food provides hot, hygienic catering packages starting at just{' '}
            <strong className="text-stone-900 font-extrabold">₹299/person</strong> with free buffet chafing setups and customizable menus.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-stone-700">
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              10 to 500+ Guests
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Hot Chafing Food Warmers
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Zero Cleanup Hassle
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Managed by Sonakshi Sharma
            </span>
          </div>
        </div>
      </section>

      {/* 2. THE 3 CATERING PACKAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            Transparent Per-Head Pricing
          </span>
          <h2 className="text-3xl font-black text-stone-900 mt-2">
            Choose Your Party Package
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            All packages include live buffet heating, biodegradable dining plates, and delivery to your hostel or venue in Dehradun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.type}
              onClick={() => setSelectedPackage(pkg.type)}
              className={`cursor-pointer rounded-3xl p-7 border-2 transition-all flex flex-col justify-between relative ${
                selectedPackage === pkg.type
                  ? 'border-orange-600 bg-gradient-to-b from-orange-50/60 to-white shadow-xl ring-4 ring-orange-500/10'
                  : 'border-stone-200 bg-white hover:border-stone-300 shadow-xs'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-200" />
                  Most Popular for Birthdays
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-stone-500">
                    {pkg.type} Package
                  </span>
                  {selectedPackage === pkg.type && (
                    <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Selected
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black text-stone-900 mt-1">{pkg.title}</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{pkg.description}</p>

                <div className="my-6 pt-4 border-t border-stone-100 flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-stone-900">₹{pkg.pricePerPerson}</span>
                  <span className="text-xs text-stone-500 font-medium">/ person</span>
                </div>

                <div className="space-y-2.5 text-xs text-stone-700">
                  {pkg.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  className={`w-full py-3 rounded-2xl font-bold text-xs transition-colors ${
                    selectedPackage === pkg.type
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                  }`}
                >
                  {selectedPackage === pkg.type ? 'Package Configured' : 'Select This Package'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE MENU CUSTOMIZER & BOOKING FORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-lg space-y-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                Step 2 & 3
              </span>
              <span className="text-xs text-stone-500 font-bold">Customization & Booking</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
              Customize Food Menu & Reserve Event Date
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Pick your favorite starters, main gravies, and desserts. Our chef Sonakshi Sharma will tailor the cooking to your exact taste.
            </p>
          </div>

          {bookingSuccess ? (
            <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-3xl border border-emerald-200">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-emerald-950">
                Party Catering Enquiry Received!
              </h3>
              <p className="text-sm text-emerald-800 max-w-lg mx-auto leading-relaxed">
                Thank you, <strong>{clientName}</strong>! Your catering booking for <strong>{guestCount} guests</strong> on <strong>{eventDate}</strong> has been saved directly to our system.
              </p>
              <div className="bg-white p-4 rounded-2xl border border-emerald-200 max-w-md mx-auto text-xs text-stone-700 text-left space-y-1">
                <p><strong>Package:</strong> {currentPkg.title} (₹{currentPkg.pricePerPerson}/person)</p>
                <p><strong>Estimated Total Budget:</strong> ₹{estimatedBudget.toLocaleString('en-IN')}</p>
                <p><strong>Contact Person:</strong> Sonakshi Sharma (+91 6396049872)</p>
              </div>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <a
                  href={`https://wa.me/916396049872?text=Hi%20Sonakshi,%20I%20just%20submitted%20a%20catering%20enquiry%20for%20${guestCount}%20guests%20on%20${eventDate}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp with Sonakshi
                </a>
                <button
                  onClick={() => setBookingSuccess(false)}
                  className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs"
                >
                  Submit Another Booking
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-8">
              {/* Event basics row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-200">
                <div>
                  <label className="block text-xs font-black uppercase text-stone-600 mb-1">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-white outline-hidden focus:border-orange-500"
                  >
                    <option value="Birthday Party">Birthday Party</option>
                    <option value="Hostel College Fest">Hostel College Fest</option>
                    <option value="Farewell / Freshers">Farewell / Freshers Party</option>
                    <option value="Other Celebration">Other Celebration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-stone-600 mb-1">
                    Guest Count: {guestCount} People
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={250}
                    step={5}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full accent-orange-600 mt-2 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-semibold mt-0.5">
                    <span>10 guests</span>
                    <span>100</span>
                    <span>250+</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-stone-600 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-white outline-hidden focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-stone-600 mb-1">
                    Meal Timing
                  </label>
                  <select
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-white outline-hidden focus:border-orange-500"
                  >
                    <option value="1:00 PM (Lunch)">1:00 PM (Lunch)</option>
                    <option value="2:30 PM (Late Lunch)">2:30 PM (Late Lunch)</option>
                    <option value="7:30 PM (Dinner)">7:30 PM (Dinner)</option>
                    <option value="9:00 PM (Late Night Party)">9:00 PM (Late Night Party)</option>
                  </select>
                </div>
              </div>

              {/* Menu items selection accordion */}
              <div className="space-y-6">
                <h3 className="text-base font-black text-stone-900 border-b border-stone-100 pb-3 flex items-center justify-between">
                  <span>Custom Menu Item Selection</span>
                  <span className="text-xs font-normal text-stone-500">Click to select/unselect dishes</span>
                </h3>

                {/* Starters */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-stone-600 mb-2">
                    1. Party Starters ({selectedStarters.length} selected)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STARTER_OPTIONS.map((starter) => {
                      const isSelected = selectedStarters.includes(starter);
                      return (
                        <button
                          type="button"
                          key={starter}
                          onClick={() => toggleSelection(starter, selectedStarters, setSelectedStarters)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                            isSelected
                              ? 'border-orange-600 bg-orange-50 text-orange-950 font-bold shadow-2xs'
                              : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="line-clamp-2">{starter}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0 ml-1" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mains */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-stone-600 mb-2">
                    2. Main Course Gravies ({selectedMains.length} selected)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {MAIN_OPTIONS.map((main) => {
                      const isSelected = selectedMains.includes(main);
                      return (
                        <button
                          type="button"
                          key={main}
                          onClick={() => toggleSelection(main, selectedMains, setSelectedMains)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                            isSelected
                              ? 'border-orange-600 bg-orange-50 text-orange-950 font-bold shadow-2xs'
                              : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="line-clamp-2">{main}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0 ml-1" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Breads & Rice */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-stone-600 mb-2">
                    3. Breads & Fragrant Rice ({selectedBreads.length} selected)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {BREAD_RICE_OPTIONS.map((item) => {
                      const isSelected = selectedBreads.includes(item);
                      return (
                        <button
                          type="button"
                          key={item}
                          onClick={() => toggleSelection(item, selectedBreads, setSelectedBreads)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                            isSelected
                              ? 'border-orange-600 bg-orange-50 text-orange-950 font-bold shadow-2xs'
                              : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="line-clamp-2">{item}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0 ml-1" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Desserts */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-stone-600 mb-2">
                    4. Desserts & Sweets ({selectedDesserts.length} selected)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {DESSERT_OPTIONS.map((dessert) => {
                      const isSelected = selectedDesserts.includes(dessert);
                      return (
                        <button
                          type="button"
                          key={dessert}
                          onClick={() => toggleSelection(dessert, selectedDesserts, setSelectedDesserts)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                            isSelected
                              ? 'border-orange-600 bg-orange-50 text-orange-950 font-bold shadow-2xs'
                              : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="line-clamp-2">{dessert}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0 ml-1" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Contact and Location details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Aryan Verma"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-hidden focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    WhatsApp Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit number"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-hidden focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-hidden focus:border-orange-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Party Venue / Hostel Address in Dehradun *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Terrace of Royal PG, Bidholi / Farmhouse near Clement Town"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-hidden focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Extra napkins, birthday cake stand..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Price Calculation Summary & Submit Button */}
              <div className="bg-stone-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                    Live Estimated Total
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      ₹{estimatedBudget.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-stone-300">
                      ({guestCount} Guests × ₹{currentPkg.pricePerPerson})
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Includes food preparation, delivery, hot chaffing buffet setup & cutlery. No hidden charges!
                  </p>
                </div>

                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-102 active:scale-98 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span>Saving Booking...</span>
                    ) : (
                      <>
                        <PartyPopper className="w-4 h-4" />
                        <span>Submit Catering Enquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 4. TRACK EXISTING CATERING ENQUIRY */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <h3 className="text-xl font-black text-stone-900">
              Check Your Party Catering Booking Status
            </h3>
          </div>
          <p className="text-xs text-stone-600">
            Enter your 10-digit mobile number or Booking ID (e.g. CAT-1001) to view the real-time review and quotation status from Sonakshi Sharma.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setHasSearched(true);
              const q = trackInput.trim().toLowerCase();
              if (!q) {
                setTrackedBooking(null);
                return;
              }
              const found = cateringBookings.find(
                (b) =>
                  b.id.toLowerCase() === q ||
                  b.phone.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
                  (b.email && b.email.toLowerCase().includes(q))
              );
              setTrackedBooking(found || null);
            }}
            className="flex flex-col sm:flex-row gap-3 pt-1"
          >
            <div className="relative grow">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={trackInput}
                onChange={(e) => {
                  setTrackInput(e.target.value);
                  setHasSearched(false);
                }}
                placeholder="Enter Booking ID (e.g. CAT-1001) or Mobile Number"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-xs outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Booking</span>
            </button>
          </form>

          {hasSearched && (
            <div className="pt-2 animate-in fade-in duration-200">
              {trackedBooking ? (
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-100 pb-2">
                    <div>
                      <span className="font-extrabold text-stone-900 text-sm">
                        Booking #{trackedBooking.id} • {trackedBooking.clientName}
                      </span>
                      <p className="text-[11px] text-stone-500">
                        Event Date: <strong>{trackedBooking.eventDate}</strong> ({trackedBooking.eventTime})
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        trackedBooking.status === 'Confirmed'
                          ? 'bg-emerald-600 text-white'
                          : trackedBooking.status === 'Quotation Sent'
                          ? 'bg-blue-600 text-white'
                          : trackedBooking.status === 'Completed'
                          ? 'bg-stone-800 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {trackedBooking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div>
                      <span className="text-stone-500 block">Guests</span>
                      <span className="font-bold text-stone-800">{trackedBooking.guestCount} People</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Package</span>
                      <span className="font-bold text-stone-800">{trackedBooking.packageType}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Estimated Cost</span>
                      <span className="font-bold text-purple-900">₹{trackedBooking.estimatedBudget?.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Venue</span>
                      <span className="font-bold text-stone-800 truncate block">{trackedBooking.eventLocation}</span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between border-t border-purple-100/80 text-[11px]">
                    <span className="text-stone-500">
                      Need changes to this booking?
                    </span>
                    <a
                      href={`https://wa.me/916396049872?text=Hi%20Sonakshi,%20inquiring%20about%20Catering%20Booking%20%23${trackedBooking.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      Chat with Sonakshi on WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-600 text-xs text-center space-y-1">
                  <p className="font-bold text-stone-800">No catering booking found for "{trackInput}"</p>
                  <p className="text-[11px]">
                    Please verify your booking reference or contact Sonakshi directly at +91 6396049872.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 5. DIRECT OWNER CONTACT BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF6EE] p-6 sm:p-8 rounded-3xl border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-stone-900 text-base">
                Have Urgent or Custom Birthday Catering Requirements?
              </h4>
              <p className="text-stone-600 mt-0.5">
                Speak directly with owner <strong>{OWNER_INFO.name}</strong> at{' '}
                <a href={OWNER_INFO.telUrl} className="text-orange-600 font-bold hover:underline">
                  +91 {OWNER_INFO.mobile}
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href={`https://wa.me/91${OWNER_INFO.mobile}?text=Hi%20Sonakshi,%20I%20want%20to%20discuss%20a%20birthday%20party%20catering%20order`}
              target="_blank"
              rel="noreferrer"
              className="grow md:grow-0 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp {OWNER_INFO.mobile}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
