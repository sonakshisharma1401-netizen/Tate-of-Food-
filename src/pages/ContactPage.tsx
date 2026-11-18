import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  Building,
  HelpCircle,
  UserCheck,
  Cake
} from 'lucide-react';
import { DEHRADUN_CAMPUS_AREAS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { OWNER_INFO } from '../types';

export const ContactPage: React.FC = () => {
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hostel, setHostel] = useState('');
  const [inquiryType, setInquiryType] = useState('Daily Student Tiffin Subscription');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill in required fields');
      return;
    }
    setSubmitted(true);
    showToast('Your message has been sent directly to Sonakshi Sharma!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-black uppercase tracking-wider bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
          Direct Owner Helpline
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
          Connect With Sonakshi Sharma
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Questions about student subscriptions, hostel gate timings, or custom birthday party catering packages?
          Get in touch directly with our business owner.
        </p>
      </div>

      {/* Main Grid: Info & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Methods & Coverage */}
        <div className="lg:col-span-5 space-y-6">
          {/* Owner Profile Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-4 border-b border-stone-100 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                SS
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Business Owner
                </span>
                <h3 className="text-lg font-black text-stone-900 mt-0.5">
                  {OWNER_INFO.name}
                </h3>
                <p className="text-xs text-stone-500">{OWNER_INFO.location}</p>
              </div>
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/91${OWNER_INFO.mobile}?text=Hi%20Sonakshi,%20I%20have%20an%20enquiry%20regarding%20Taste%20of%20Food`}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-950">WhatsApp Direct Chat</p>
                  <p className="text-sm font-black text-emerald-900">+91 {OWNER_INFO.mobile}</p>
                  <p className="text-[10px] text-emerald-700">Instant response from Sonakshi</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-emerald-800 bg-white px-2.5 py-1 rounded-lg shadow-2xs group-hover:translate-x-1 transition-transform">
                Chat →
              </span>
            </a>

            {/* Phone Call */}
            <a
              href={OWNER_INFO.telUrl}
              className="p-4 rounded-2xl bg-stone-50 hover:bg-orange-50 border border-stone-200 hover:border-orange-200 flex items-center gap-3 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-700">Direct Phone Helpline</p>
                <p className="text-sm font-black text-stone-900 group-hover:text-orange-600 transition-colors">
                  +91 {OWNER_INFO.mobile}
                </p>
                <p className="text-[10px] text-stone-500">Available 9:00 AM - 10:30 PM daily</p>
              </div>
            </a>

            {/* Email */}
            <a
              href={OWNER_INFO.mailUrl}
              className="p-4 rounded-2xl bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-200 flex items-center gap-3 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-700">Official Email</p>
                <p className="text-sm font-black text-stone-900 group-hover:text-orange-600 transition-colors truncate max-w-[220px]">
                  {OWNER_INFO.email}
                </p>
                <p className="text-[10px] text-stone-500">For student groups & catering tenders</p>
              </div>
            </a>
          </div>

          {/* Dehradun Kitchen & Zones */}
          <div className="bg-[#FAF6EE] rounded-3xl border border-stone-200 p-6 space-y-4">
            <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              <span>Dehradun Campus Coverage Zones</span>
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We deliver fresh thalis and full catering buffets to every corner of Dehradun:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {DEHRADUN_CAMPUS_AREAS.map((a, i) => (
                <div key={i} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-stone-200 text-stone-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="truncate">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="text-xl font-black text-stone-900">Send an Enquiry to Sonakshi</h3>
              <p className="text-xs text-stone-500">
                Interested in student thali subscriptions, roommate discounts, or custom catering?
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-emerald-950">Thank You, {name}!</h4>
                <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
                  Your message has been directly received by Sonakshi Sharma. She will call or WhatsApp you at +91 {phone} shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-emerald-800 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aryan Verma"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Mobile Number (WhatsApp) *
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@college.edu"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Hostel / College / Area in Dehradun
                    </label>
                    <input
                      type="text"
                      value={hostel}
                      onChange={(e) => setHostel(e.target.value)}
                      placeholder="e.g. UPES Bidholi Girls PG"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Enquiry Subject
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden bg-white"
                  >
                    <option value="Daily Student Tiffin Subscription">Daily Student Tiffin Subscription</option>
                    <option value="Birthday Party & Catering Package">Birthday Party & Catering Package</option>
                    <option value="Hostel Roommates Group Discount (3+ Students)">Hostel Roommates Group Discount (3+ Students)</option>
                    <option value="Special Dietary Requirement (Gym / Jain)">Special Dietary Requirement (Gym / Jain)</option>
                    <option value="General Feedback or Suggestion">General Feedback or Suggestion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Message / Requirement *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell Sonakshi about your preferred meal timings, food taste, guest count, or questions..."
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 text-sm outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-101 active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Sonakshi</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
