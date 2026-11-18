import React from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Phone,
  Mail,
  MapPin,
  Clock,
  Heart,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Cake
} from 'lucide-react';
import { OWNER_INFO } from '../types';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t-4 border-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight">
                  Taste of <span className="text-orange-500">Food</span>
                </span>
                <p className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
                  Ghar Jaisa Khana & Event Catering
                </p>
              </div>
            </div>

            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Founded and operated by <strong>{OWNER_INFO.name}</strong> in {OWNER_INFO.location}.
              Dedicated student tiffin service, wholesome thalis, and full birthday party catering
              packages delivered across Dehradun.
            </p>

            {/* Direct owner badge */}
            <div className="p-3 bg-stone-800/80 rounded-2xl border border-stone-700/60 max-w-sm space-y-1 text-xs">
              <p className="text-stone-300 font-bold">
                Owner & Head: <span className="text-white">{OWNER_INFO.name}</span>
              </p>
              <p className="text-stone-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <a href={OWNER_INFO.telUrl} className="hover:text-amber-300 underline font-semibold">
                  +91 {OWNER_INFO.mobile}
                </a>
              </p>
              <p className="text-stone-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <a href={OWNER_INFO.mailUrl} className="hover:text-amber-300 underline">
                  {OWNER_INFO.email}
                </a>
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Zero Palm Oil / Zero Soda
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-700/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                Pure Desi Ghee
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white text-base font-bold tracking-wide uppercase text-xs">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/menu" className="hover:text-orange-400 transition-colors">
                  Daily Homestyle Menu
                </Link>
              </li>
              <li>
                <Link to="/subscriptions" className="hover:text-orange-400 transition-colors">
                  Student Thali Subscriptions
                </Link>
              </li>
              <li>
                <Link to="/catering" className="hover:text-orange-400 transition-colors text-amber-300 font-bold flex items-center gap-1">
                  <Cake className="w-3.5 h-3.5" />
                  Birthday & Catering
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-400 transition-colors">
                  Our Story & Mission
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition-colors">
                  Contact Sonakshi Sharma
                </Link>
              </li>
            </ul>
          </div>

          {/* Dehradun Campus Hubs */}
          <div className="space-y-3">
            <h4 className="text-white text-base font-bold tracking-wide uppercase text-xs">
              Dehradun Areas Served
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li className="flex items-center gap-1.5 text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                UPES Bidholi & Kandoli Hostels
              </li>
              <li className="flex items-center gap-1.5 text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                Graphic Era (Clement Town)
              </li>
              <li className="flex items-center gap-1.5 text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                DIT Univ & Mussoorie Diversion
              </li>
              <li className="flex items-center gap-1.5 text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                Premnagar (Uttaranchal & DBIT)
              </li>
              <li className="flex items-center gap-1.5 text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                Rajpur Road, Jakhan & Central Hub
              </li>
            </ul>
          </div>

          {/* Student Support & Timings */}
          <div className="space-y-3">
            <h4 className="text-white text-base font-bold tracking-wide uppercase text-xs">
              Direct Contact & Booking
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-stone-300">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Lunch: 11:30 AM - 3:00 PM</p>
                  <p className="font-semibold text-white">Dinner: 7:00 PM - 10:30 PM</p>
                </div>
              </div>

              <a
                href={`https://wa.me/91${OWNER_INFO.mobile}?text=Hi%20Sonakshi,%20I%20want%20to%20order%20food%20or%20inquire%20about%20catering`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md text-xs"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp: {OWNER_INFO.mobile}
              </a>

              <div className="pt-1 flex items-center gap-2 text-stone-400">
                <Mail className="w-3.5 h-3.5 text-stone-500" />
                <a href={OWNER_INFO.mailUrl} className="hover:underline">
                  {OWNER_INFO.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Taste of Food. Owned by {OWNER_INFO.name}. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="text-amber-500/80 bg-stone-800 px-3 py-1 rounded-full text-[11px]">
              Currency: {OWNER_INFO.currency}
            </span>
            <Link to="/admin" className="hover:text-stone-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              Kitchen Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
