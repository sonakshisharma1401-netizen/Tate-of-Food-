import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Info,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Flame,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodCard } from '../components/FoodCard';
import { MealCategory, DietaryType } from '../types';

const CATEGORIES: MealCategory[] = [
  'All',
  'Thali',
  'Meals',
  'Snacks',
  'Beverages',
  'Combos'
];

export const MenuPage: React.FC = () => {
  const { menuItems, cartCount, cartTotal } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('All');
  const [selectedDiet, setSelectedDiet] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');

  // Filtered and sorted menu items
  const filteredItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        // Search
        const matchesSearch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.hindiName && item.hindiName.includes(searchTerm)) ||
          item.includedItems.some((inc) => inc.toLowerCase().includes(searchTerm.toLowerCase()));

        // Category
        const matchesCategory =
          selectedCategory === 'All' || item.category === selectedCategory;

        // Diet
        const matchesDiet =
          selectedDiet === 'all' || item.dietary === selectedDiet;

        return matchesSearch && matchesCategory && matchesDiet;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // default popular
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      });
  }, [menuItems, searchTerm, selectedCategory, selectedDiet, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>FSSAI Standards Compliant Kitchen • Dehradun</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Our Homestyle Food Menu
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-xl">
            Pure, nutritious meals prepared freshly everyday. No artificial additives, no high-cholesterol vanaspati, just authentic ghar ka swad.
          </p>
        </div>

        {/* Demo Data Disclaimer Badge */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-start gap-2.5 max-w-md text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Illustrative Sample Menu:</span> Prices and items shown are demo menu data until updated by the central kitchen admin. Fully orderable for demonstration!
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-4">
        {/* Top search & Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search thalis, parathas, rajma chawal..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-hidden bg-stone-50/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-xs text-stone-400 hover:text-stone-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Diet filters & Sorting */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Pure Veg / Non-veg selector */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setSelectedDiet('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedDiet === 'all'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedDiet('veg')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  selectedDiet === 'veg'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-emerald-700 hover:text-emerald-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300" />
                Pure Veg
              </button>
              <button
                onClick={() => setSelectedDiet('non-veg')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  selectedDiet === 'non-veg'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-rose-700 hover:text-rose-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-300" />
                Non-Veg
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-700 outline-hidden focus:border-orange-500"
            >
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-2xl">
            🍽️
          </div>
          <h3 className="text-lg font-black text-stone-900">No dishes match your filter</h3>
          <p className="text-xs text-stone-500">
            Try resetting your search query or choosing "All" categories to view all delicious meals.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedDiet('all');
            }}
            className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Floating Cart Sticky Bar on Mobile & Desktop if items in cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-8 sm:w-96 z-40 animate-in slide-in-from-bottom duration-300">
          <div className="bg-stone-900 text-white p-4 rounded-3xl shadow-2xl border border-stone-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-black text-sm">
                {cartCount}
              </div>
              <div>
                <p className="text-xs text-stone-400 font-semibold">{cartCount} items in cart</p>
                <p className="text-base font-black text-white">₹{cartTotal}</p>
              </div>
            </div>
            <Link
              to="/cart"
              className="px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black flex items-center gap-1.5 transition-colors shadow-md"
            >
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
