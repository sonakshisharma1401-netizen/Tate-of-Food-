import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Heart,
  Award,
  CheckCircle2,
  CalendarCheck,
  Star,
  MapPin,
  UtensilsCrossed,
  ChefHat,
  Flame,
  Coffee,
  Leaf,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodCard } from '../components/FoodCard';
import { DEHRADUN_CAMPUS_AREAS } from '../data/mockData';

export const Home: React.FC = () => {
  const { menuItems, feedbacks, addToCart } = useApp();
  const navigate = useNavigate();

  // Featured meals (top 4 popular items)
  const featuredMeals = menuItems.filter((i) => i.isPopular).slice(0, 4);

  // Handle ₹99 First Meal Special Click
  const handleOrderFirstMeal = () => {
    const welcomeMeal = menuItems.find((i) => i.price === 99 || i.isSpecialStudentOffer) || menuItems[1];
    if (welcomeMeal) {
      addToCart(welcomeMeal, 1);
      navigate('/cart');
    } else {
      navigate('/menu');
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 md:py-20 bg-radial from-amber-100/60 via-[#FFFDF9] to-[#FFFDF9]">
        {/* Soft background ambient rings */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-orange-300/20 to-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-xs font-extrabold shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
                <span>Dehradun's Loved Student Food & Tiffin Service</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.12]">
                Ghar Jaisa Khana, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700">
                  Ab Aapke Paas!
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Tired of bland, greasy hostel mess food and overpriced canteen snacks?
                Taste of Food brings affordable, fresh, and hygienic home-cooked meals
                starting at just <strong className="text-stone-900 font-extrabold">₹89</strong>,
                delivered hot right to your PG and hostel gates in Dehradun.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/menu"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-base shadow-lg shadow-orange-600/30 flex items-center justify-center gap-3 transition-all hover:scale-102 active:scale-98"
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  Explore Daily Menu
                </Link>

                <button
                  onClick={handleOrderFirstMeal}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-base border-2 border-amber-300/80 flex items-center justify-center gap-2.5 transition-all hover:scale-102 active:scale-98 shadow-sm group"
                >
                  <Sparkles className="w-5 h-5 text-orange-600 group-hover:rotate-12 transition-transform" />
                  <span>Order First Meal for ₹99</span>
                  <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Save 30%
                  </span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="text-2xl font-black text-stone-900">10,000+</p>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">Hostel Meals Served</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-stone-900">₹89</p>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">Starting Price</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-stone-900">4.9 ★</p>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">From UPES & GEU Students</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Floating Dish Showcase */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
                  <img
                    src="https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=1000&q=80"
                    alt="Authentic Ghar Ki Thali"
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="bg-orange-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider w-fit mb-2">
                      Dehradun Student Bestseller
                    </span>
                    <h3 className="text-2xl font-black">Homestyle Maharaja Thali</h3>
                    <p className="text-xs text-stone-200 mt-1">
                      Soft phulkas, slow-cooked Arhar dal, paneer gravy, basmati rice & gulab jamun
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-2xl font-black text-amber-300">₹119</span>
                      <button
                        onClick={handleOrderFirstMeal}
                        className="bg-white text-stone-900 text-xs font-black px-4 py-2 rounded-xl hover:bg-orange-500 hover:text-white transition-colors"
                      >
                        Order Now →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Student Testimonial Pill */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-stone-200 hidden sm:flex items-center gap-3 max-w-xs animate-bounce duration-1000">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 font-black">
                    ✓
                  </div>
                  <div className="text-xs">
                    <p className="font-black text-stone-900">"Acidity & Mess headache gone!"</p>
                    <p className="text-stone-500 text-[11px]">Tanmay • UPES Bidholi Hosteler</p>
                  </div>
                </div>

                {/* Floating Fresh Delivery Badge */}
                <div className="absolute -top-4 -right-4 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-stone-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold">Hot Delivery @ Hostel Gate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CAMPUS RECOGNITION TICKER */}
      <section className="border-y border-stone-200 bg-amber-50/50 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
            Delivering 2 Times Daily to Students Across Dehradun
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-stone-700">
            {DEHRADUN_CAMPUS_AREAS.slice(0, 6).map((area, i) => (
              <span
                key={i}
                className="bg-white px-3 py-1.5 rounded-xl border border-stone-200/80 shadow-2xs flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED MEALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-orange-600 font-extrabold text-xs tracking-wider uppercase bg-orange-50 px-3 py-1 rounded-full">
              Hand-Cooked With Love
            </span>
            <h2 className="text-3xl font-black text-stone-900 mt-2">
              Today's Campus Favorites
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Pure homestyle comfort food. Cooked fresh twice a day using mountain-grown herbs and unadulterated spices.
            </p>
          </div>
          <Link
            to="/menu"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline"
          >
            <span>View Full Menu ({menuItems.length} Dishes)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMeals.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE TASTE OF FOOD (The Problem vs Solution) */}
      <section className="bg-gradient-to-b from-[#FAF6EE] to-[#FFFDF9] py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-orange-600 font-extrabold text-xs tracking-wider uppercase bg-orange-100 px-3 py-1 rounded-full">
              Why Dehradun Students Love Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 mt-2">
              We Solve The 4 Biggest Hostel Mess Struggles
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              Every student knows the pain of unhygienic oily curries, rubbery rotis, and sudden stomach upsets during exam weeks. Here is how Taste of Food is different:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-stone-900">Zero Excess Oil & Soda</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hostel mess adds baking soda to cook dal quickly, causing bloating and acidity. We cook slowly in traditional cookware with minimal oil and digestive cumin & hing.
              </p>
              <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block">
                ✓ 100% Light on Stomach
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center">
                <ChefHat className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-stone-900">Tawa-Fresh Phulkas</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                No cold, rubbery maida rotis. We prepare 100% whole wheat rotis brushed with pure desi ghee that remain soft even if you eat after your 5 PM practicals.
              </p>
              <div className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg inline-block">
                ✓ 100% Chakki Atta
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <CalendarCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-stone-900">Pause When You Go Home</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Visiting your hometown for Diwali, weekends, or fest week? Just tap "Pause" on your dashboard. Your unused days are saved and carried forward automatically.
              </p>
              <div className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg inline-block">
                ✓ Zero Money Wasted
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-stone-900">Student Pocket-Friendly</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Meals starting at ₹89, and full monthly meal subscriptions for just ₹130/day. Save ₹2,500+ every month compared to ordering from commercial restaurant apps.
              </p>
              <div className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg inline-block">
                ✓ Honest Student Pricing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-orange-600 font-extrabold text-xs tracking-wider uppercase bg-orange-50 px-3 py-1 rounded-full">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl font-black text-stone-900 mt-2">
            How Taste of Food Works
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Getting wholesome food delivered to your room is as easy as sending a WhatsApp message.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {[
            {
              step: '01',
              title: 'Choose Meal or Plan',
              desc: 'Select individual thalis for instant craving or subscribe to our Weekly/Monthly plans for lunch & dinner.'
            },
            {
              step: '02',
              title: 'Set Hostel Address',
              desc: 'Enter your PG name, hostel block, room number, or campus gate across Bidholi, Clement Town, DIT, etc.'
            },
            {
              step: '03',
              title: 'Cooked Homestyle',
              desc: 'Our experienced local chefs prepare your food using pure filtered water, desi ghee, and clean brass cookware.'
            },
            {
              step: '04',
              title: 'Hot Delivery at Gate',
              desc: 'Receive steaming hot tiffins right before lunch (12:30 PM) and dinner (8:00 PM) in insulated containers.'
            }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="text-5xl font-black text-stone-200 mb-3 select-none">
                {item.step}
              </div>
              <h3 className="text-lg font-black text-stone-900 mb-2">{item.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SUBSCRIPTION PLANS HIGHLIGHT TEASER */}
      <section className="bg-stone-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 p-8 md:p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <span className="bg-amber-400 text-stone-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Never Worry About Daily Mess Food Again
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Flexible Weekly & Monthly Meal Subscriptions
          </h2>
          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Choose Lunch, Dinner, or Both. Includes free doorstep delivery, weekly sweet treats,
            and the freedom to pause days whenever you go home or skip meals.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
            <div className="bg-stone-800/90 border border-stone-700 p-5 rounded-2xl">
              <span className="text-xs font-bold text-orange-400 uppercase">Trial Plan</span>
              <h4 className="text-lg font-bold text-white mt-1">7-Day Weekly Trial</h4>
              <p className="text-2xl font-black text-white mt-2">
                ₹890 <span className="text-xs text-stone-400 font-normal">/ 7 days</span>
              </p>
              <p className="text-[11px] text-stone-400 mt-2">Best for testing tiffin quality before taking a monthly plan.</p>
            </div>

            <div className="bg-gradient-to-b from-orange-950 to-stone-800 border-2 border-orange-500 p-5 rounded-2xl relative shadow-xl">
              <span className="absolute -top-3 right-4 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Most Popular
              </span>
              <span className="text-xs font-bold text-amber-400 uppercase">Student Champion</span>
              <h4 className="text-lg font-bold text-white mt-1">30-Day Monthly Pass</h4>
              <p className="text-2xl font-black text-white mt-2">
                ₹3,499 <span className="text-xs text-stone-400 font-normal">/ month</span>
              </p>
              <p className="text-[11px] text-stone-300 mt-2">Save ₹1,500+ every month. Includes free weekend desserts.</p>
            </div>

            <div className="bg-stone-800/90 border border-stone-700 p-5 rounded-2xl">
              <span className="text-xs font-bold text-emerald-400 uppercase">Custom Flexi</span>
              <h4 className="text-lg font-bold text-white mt-1">Dinner Only / Flexi</h4>
              <p className="text-2xl font-black text-white mt-2">
                ₹1,890 <span className="text-xs text-stone-400 font-normal">/ 15 days</span>
              </p>
              <p className="text-[11px] text-stone-400 mt-2">For college goers who only need evening ghar ka dinner.</p>
            </div>
          </div>

          <div className="pt-6">
            <Link
              to="/subscriptions"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm shadow-lg transition-transform hover:scale-105"
            >
              <span>Explore All Subscription Options & Customizer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6B. BIRTHDAY PARTY & CATERING SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-950 via-stone-900 to-stone-900 rounded-3xl p-8 sm:p-12 text-white border-2 border-purple-500/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md">
                🎂 Hostel & Campus Event Catering
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Planning a Birthday Party or Hostel Celebration?
              </h2>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl">
                Make your hostel terrace, PG hall, or farmhouse party unforgettable!
                Complete party catering packages starting at just <strong>₹299/person</strong> with live buffet warmers, customizable starter menus, and on-site staff.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                  <span className="text-amber-400 font-bold block">Basic Treat</span>
                  <p className="text-lg font-black text-white mt-0.5">₹299<span className="text-[10px] font-normal text-stone-300">/person</span></p>
                  <p className="text-[10px] text-stone-400 mt-1">2 Starters + 2 Mains + Dessert</p>
                </div>
                <div className="bg-purple-900/60 p-3 rounded-2xl border border-purple-400/50">
                  <span className="text-purple-300 font-bold block">Standard Feast</span>
                  <p className="text-lg font-black text-white mt-0.5">₹449<span className="text-[10px] font-normal text-stone-300">/person</span></p>
                  <p className="text-[10px] text-stone-300 mt-1">3 Starters + 3 Mains + 2 Desserts</p>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                  <span className="text-pink-400 font-bold block">Royal Banquet</span>
                  <p className="text-lg font-black text-white mt-0.5">₹649<span className="text-[10px] font-normal text-stone-300">/person</span></p>
                  <p className="text-[10px] text-stone-400 mt-1">Full lavish buffet + mocktails</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center gap-3">
              <Link
                to="/catering"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 text-center transition-transform hover:scale-102"
              >
                <span>Customize Party Menu & Book</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/916396049872?text=Hi%20Sonakshi,%20I%20want%20to%20inquire%20about%20birthday%20party%20catering%20in%20Dehradun"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition-colors"
              >
                Chat on WhatsApp (+91 6396049872)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-orange-600 font-extrabold text-xs tracking-wider uppercase bg-orange-50 px-3 py-1 rounded-full">
            Real Student Voices
          </span>
          <h2 className="text-3xl font-black text-stone-900 mt-2">
            Loved By 500+ Hostels & PGs in Dehradun
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            See what students from UPES, Graphic Era, DIT and IMS Unison say about their daily meals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {feedbacks.map((f) => (
            <div
              key={f.id}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(f.rating) ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-xs font-bold text-stone-700">{f.rating}</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed italic">
                  "{f.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{f.userName}</h4>
                  <p className="text-[10px] text-stone-500 line-clamp-1">{f.college}</p>
                </div>
                {f.verifiedStudent && (
                  <span
                    className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1"
                    title="Verified Dehradun Hosteler"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. PROMO BANNER: FIRST MEAL ₹99 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="bg-white text-orange-800 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Introductory Hosteler Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">
              Try Your First Ghar Jaisa Meal For Just ₹99
            </h2>
            <p className="text-sm text-amber-100 leading-relaxed">
              Experience the taste, softness of our phulkas, and fresh mountain dal. If you don't love it, we'll refund your ₹99 without questions.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleOrderFirstMeal}
              className="px-8 py-4 rounded-2xl bg-white hover:bg-amber-50 text-orange-800 font-black text-base shadow-xl flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>Claim ₹99 Meal Deal</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
