import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Users,
  Award,
  Leaf,
  Coffee,
  UtensilsCrossed,
  ArrowRight,
  MapPin
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-amber-100/50 via-[#FFFDF9] to-[#FFFDF9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-wider bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
            Our Mission & Purpose
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Nourishing Dehradun's College Students Like Family
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Taste of Food was born out of a simple, relatable struggle: young students moving miles away from home to Dehradun, only to face oily, tasteless, and unhygienic hostel mess food.
          </p>
        </div>
      </section>

      {/* Story & Origin */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
              The Genesis
            </span>
            <h2 className="text-3xl font-black text-stone-900">
              Started by Dehradun Alumni Who Missed Ghar Ka Khana
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              During our four years in Bidholi and Clement Town colleges, we survived on Maggi, cold canteens, and greasy takeout. Every weekend, at least one wing-mate in our hostel was sick with food poisoning or acidity.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              We realized that students don't want fancy restaurant cuisine everyday. What students truly crave is a warm plate of <strong>yellow arhar dal with jeera tadka</strong>, soft <strong>phulkas made with pure chakki atta</strong>, fresh seasonal sabzis, and steaming rice that feels like a hug from mom.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              Founded and led by <strong>Sonakshi Sharma</strong> in Dehradun, <strong>Taste of Food</strong> was created to bring genuine, healthy ghar ka khana and memorable birthday celebration feasts to students living in hostels, PGs, and rented flats across Uttarakhand.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <p className="text-2xl font-black text-stone-900">10,000+</p>
                <p className="text-xs text-stone-600 mt-0.5">Satisfied Tiffins Delivered</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <p className="text-2xl font-black text-stone-900">100%</p>
                <p className="text-xs text-stone-600 mt-0.5">Zero Palm Oil / Zero Soda</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80"
                alt="Central Kitchen Chefs"
                className="w-full h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                  Our Central Kitchen Hub
                </span>
                <h4 className="text-xl font-bold">Cooked Fresh Twice Daily in Dehradun</h4>
                <p className="text-xs text-stone-300 mt-1">
                  Rajpur Road Central Facility • Multi-stage RO water filtration • Daily fresh local produce
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="bg-stone-50 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
              Our 4 Pillars
            </span>
            <h2 className="text-3xl font-black text-stone-900 mt-2">
              The Taste of Food Promise
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Every single meal is prepared following these non-negotiable kitchen rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-stone-900">Certified Hygiene</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hospital-grade sanitary prep areas, hairnets, daily temperature checks, and triple-washed seasonal vegetables.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-stone-900">Ghar Ka Masala</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                No artificial food coloring, zero MSG, and zero heavy restaurant cream. We use pure ground turmeric, coriander, and desi ghee.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-stone-900">Student Affordability</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                We design meals for student pocket money. Wholesome full meals start at ₹89, with monthly plans lowering costs to ₹65/meal.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-stone-900">Hostel Punctuality</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hot tiffins delivered right before class breaks and hostel curfew hours, directly at your campus or PG gate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-5">
        <h3 className="text-3xl font-black text-stone-900">
          Ready for Healthier, Tastier College Life?
        </h3>
        <p className="text-sm text-stone-600 max-w-xl mx-auto">
          Join hundreds of UPES, Graphic Era, and DIT students who look forward to lunch and dinner every day.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/menu"
            className="px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md"
          >
            Explore Today's Menu
          </Link>
          <Link
            to="/subscriptions"
            className="px-8 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm"
          >
            Check Subscription Plans
          </Link>
        </div>
      </section>
    </div>
  );
};
