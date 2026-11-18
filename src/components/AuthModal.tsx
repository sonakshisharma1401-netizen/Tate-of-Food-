import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEHRADUN_CAMPUS_AREAS } from '../data/mockData';
import { OWNER_INFO } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, sendPasswordReset, loginAsStudent, loginAsAdmin } = useApp();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot_password'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [collegeOrHostel, setCollegeOrHostel] = useState('');
  const [area, setArea] = useState(DEHRADUN_CAMPUS_AREAS[0]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setIsSubmitting(true);
    try {
      const success = await loginWithEmail(email, password);
      if (success) {
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!email) {
      setError('Please enter your email address to receive the reset link');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await sendPasswordReset(email);
      if (res.success) {
        setSuccessMsg(res.message);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send password reset link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !phone) {
      setError('Please fill in your name, email and mobile number');
      return;
    }
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);
    try {
      await signupWithEmail({
        name,
        email,
        phone,
        collegeOrHostel,
        area,
        deliveryAddress,
        password
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header banner */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest bg-amber-400 text-stone-900 px-2 py-0.5 rounded-full">
              Firebase Authentication
            </span>
          </div>
          <h3 className="text-2xl font-black text-white">
            {mode === 'login' ? 'Welcome Back!' : mode === 'signup' ? 'Join Taste of Food' : 'Reset Your Password'}
          </h3>
          <p className="text-xs text-amber-100 mt-1">
            {mode === 'login'
              ? 'Sign in to access your tiffin subscription, orders & catering bookings.'
              : mode === 'signup'
              ? 'Sign up to get fresh, home-cooked food delivered to your hostel gate.'
              : 'Enter your registered email and we will send you a secure password reset link.'}
          </p>

          {/* Quick Demo Logins Bar */}
          <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                loginAsStudent();
                onClose();
              }}
              className="text-xs font-bold bg-white text-orange-700 hover:bg-amber-50 px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-transform hover:scale-102"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              ⚡ Student Test Account
            </button>
            <button
              type="button"
              onClick={() => {
                loginAsAdmin();
                onClose();
              }}
              className="text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-transform hover:scale-102"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              🔑 Admin ({OWNER_INFO.name})
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-100 bg-stone-50 px-6 pt-3">
          <button
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors mr-6 ${
              mode === 'login'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-stone-600 hover:text-stone-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              mode === 'signup'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-stone-600 hover:text-stone-800'
            }`}
          >
            Create Customer Account
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200">
              {successMsg}
            </div>
          )}

          {mode !== 'forgot_password' && (
            <>
              {/* Google Auth Button */}
              <button
                type="button"
                onClick={async () => {
                  await loginWithGoogle();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-sm font-bold shadow-xs transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                Continue with Google (Firebase)
              </button>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-stone-200"></div>
                <span className="shrink mx-4 text-stone-600 text-[11px] uppercase font-bold tracking-wider">
                  Or with email & password
                </span>
                <div className="grow border-t border-stone-200"></div>
              </div>
            </>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. aryan.upes@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot_password');
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : mode === 'forgot_password' ? (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Your Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. aryan.upes@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm outline-hidden"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  We'll send you an official Firebase password reset link right away.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? 'Sending link...' : 'Send Password Reset Link'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setSuccessMsg('');
                }}
                className="w-full py-2.5 text-center text-xs font-bold text-stone-600 hover:text-stone-900 border border-stone-200 rounded-xl"
              >
                ← Back to Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rohan Sharma"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit number"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Dehradun Campus Area
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden bg-white"
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
                  Hostel / PG / Residence Name
                </label>
                <input
                  type="text"
                  value={collegeOrHostel}
                  onChange={(e) => setCollegeOrHostel(e.target.value)}
                  placeholder="e.g. Royal Boys PG / Campus Hostel Block 2"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Delivery Address
                </label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Room 304, Near Gate No. 2, Bidholi"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
