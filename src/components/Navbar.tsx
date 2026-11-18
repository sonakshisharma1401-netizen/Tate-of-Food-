import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  UtensilsCrossed,
  ShoppingBag,
  User,
  Menu as MenuIcon,
  X,
  MapPin,
  ShieldCheck,
  CalendarCheck,
  Sparkles,
  LogIn,
  LogOut,
  ChevronDown,
  Cake,
  Phone,
  Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OWNER_INFO } from '../types';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { user, logout, cartCount, loginAsStudent, loginAsAdmin } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Food Menu', path: '/menu' },
    { name: 'Student Thalis', path: '/subscriptions' },
    { name: 'Birthday & Catering', path: '/catering', badge: 'Special' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
      {/* Top student announcement bar */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-emerald-800 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-amber-950 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide">
              Dehradun Hub
            </span>
            <span className="hidden sm:inline">
              Serving UPES, Graphic Era, DIT & All Dehradun PGs • Owner: {OWNER_INFO.name}
            </span>
            <span className="sm:hidden">Dehradun Student Tiffin & Catering</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={OWNER_INFO.telUrl}
              className="flex items-center gap-1 text-white hover:text-amber-200 transition-colors font-bold"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span>+91 {OWNER_INFO.mobile}</span>
            </a>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-stone-900">
                  Taste of <span className="text-orange-600">Food</span>
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-600" />
              </div>
              <p className="text-[11px] font-semibold text-stone-700 tracking-wider uppercase">
                Ghar Jaisa Khana & Catering • Dehradun
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors relative ${
                  isActive(link.path)
                    ? 'bg-orange-50 text-orange-600 font-bold'
                    : 'text-stone-700 hover:text-orange-600 hover:bg-stone-50'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="ml-1 bg-orange-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="ml-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* Actions: Notifications, Cart, User Profile, Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                title="Campus Notifications & Alerts"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-stone-700" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange-600 rounded-full ring-2 ring-white animate-pulse" />
              </button>

              {notificationsOpen && (
                <div
                  className="absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-stone-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <div className="flex items-center gap-1.5 font-black text-xs text-stone-900">
                      <Bell className="w-3.5 h-3.5 text-orange-600" />
                      <span>Campus Food Announcements</span>
                    </div>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="text-stone-400 hover:text-stone-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-2 text-xs divide-y divide-stone-100">
                    <div className="pt-2 first:pt-0 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="font-bold text-stone-900">STUDENT99 Promo Code Live</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Get 20% off up to ₹40 on your first homestyle thali order using code <strong>STUDENT99</strong>.
                      </p>
                    </div>

                    <div className="pt-2 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="font-bold text-stone-900">Hostel Tiffin Delivery Schedule</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Lunch boxes leave kitchen at 12:15 PM (Arrive 12:45-1:30 PM). Dinner arrives 7:45-8:45 PM.
                      </p>
                    </div>

                    <div className="pt-2 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        <span className="font-bold text-stone-900">Birthday Catering Booking</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Planning a hostel or PG birthday? Free warmers and cutlery included for 20+ guests!
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 text-center">
                    <Link
                      to="/menu"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[11px] text-orange-600 font-bold hover:underline"
                    >
                      Explore Today's Specials →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-amber-50 text-stone-800 hover:bg-orange-100 transition-colors border border-amber-200/60 flex items-center gap-2"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <span className="hidden sm:inline text-xs font-bold text-stone-800">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-medium transition-colors"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-orange-500/30"
                  />
                  <span className="max-w-[100px] truncate hidden sm:inline font-bold">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-stone-100">
                      <p className="text-xs text-stone-600">Signed in as</p>
                      <p className="text-sm font-bold text-stone-900 truncate">{user.name}</p>
                      <p className="text-xs text-stone-500 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{user.area || 'Dehradun'}</span>
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-orange-50 hover:text-orange-700 font-medium"
                    >
                      <User className="w-4 h-4 text-orange-600" />
                      Dashboard & Orders
                    </Link>

                    <Link
                      to="/catering"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-orange-50 hover:text-orange-700 font-medium"
                    >
                      <Cake className="w-4 h-4 text-purple-600" />
                      Birthday & Catering
                    </Link>

                    <Link
                      to="/subscriptions"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-orange-50 hover:text-orange-700 font-medium"
                    >
                      <CalendarCheck className="w-4 h-4 text-emerald-600" />
                      Meal Subscriptions
                    </Link>

                    {user.role === 'admin' ? (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        Admin Dashboard
                      </Link>
                    ) : (
                      <button
                        onClick={loginAsAdmin}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-stone-600 hover:bg-amber-50 hover:text-amber-800"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                        Switch to Admin ({OWNER_INFO.name})
                      </button>
                    )}

                    {user.role === 'admin' && (
                      <button
                        onClick={loginAsStudent}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-stone-600 hover:bg-amber-50 hover:text-amber-800"
                      >
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        Switch to Student Demo
                      </button>
                    )}

                    <div className="border-t border-stone-100 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all hover:scale-102"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-[#FFFDF9] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-semibold ${
                isActive(link.path)
                  ? 'bg-orange-500 text-white'
                  : 'text-stone-800 hover:bg-orange-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{link.name}</span>
                {link.badge && (
                  <span className="bg-amber-400 text-stone-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    {link.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}

          {user && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-base font-semibold text-stone-800 hover:bg-orange-50 flex items-center gap-2"
            >
              <User className="w-5 h-5 text-orange-600" />
              Student Dashboard
            </Link>
          )}

          <Link
            to="/admin"
            onClick={() => {
              if (user?.role !== 'admin') loginAsAdmin();
              setMobileMenuOpen(false);
            }}
            className="block px-4 py-3 rounded-xl text-base font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 flex items-center gap-2"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            Kitchen Admin Portal
          </Link>

          {!user && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full mt-3 py-3 rounded-xl bg-orange-600 text-white font-bold text-center flex items-center justify-center gap-2 shadow-md"
            >
              <LogIn className="w-5 h-5" />
              Sign In / Register
            </button>
          )}
        </div>
      )}
    </header>
  );
};
