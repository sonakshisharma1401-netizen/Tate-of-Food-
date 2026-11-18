import React, { useState } from 'react';
import {
  Star,
  Plus,
  Minus,
  Check,
  Flame,
  Info,
  Sparkles,
  X,
  AlertCircle
} from 'lucide-react';
import { MenuItem } from '../types';
import { useApp } from '../context/AppContext';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { cart, addToCart, updateCartQuantity } = useApp();
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const cartItem = cart.find((ci) => ci.item.id === item.id);
  const currentQuantity = cartItem?.quantity || 0;

  return (
    <>
      <div className="group bg-white rounded-3xl border border-stone-200/80 hover:border-orange-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
        {/* Special student discount or popular badge */}
        {item.isSpecialStudentOffer && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-200" />
            <span>₹99 DEAL</span>
          </div>
        )}

        {item.isPopular && !item.isSpecialStudentOffer && (
          <div className="absolute top-3 left-3 z-10 bg-emerald-700 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
            Hostel Favorite
          </div>
        )}

        {/* Food Image with Veg/Non-veg indicator overlay */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
          <img
            src={item.image}
            alt={item.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              !item.isAvailable ? 'grayscale opacity-60' : ''
            }`}
            loading="lazy"
          />

          {!item.isAvailable && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-red-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-lg">
                Sold Out Today
              </span>
            </div>
          )}

          {/* Veg / Non-Veg badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-1.5 rounded-xl shadow-md flex items-center gap-1.5">
            <span
              className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center ${
                item.dietary === 'veg' ? 'border-emerald-600' : 'border-rose-600'
              }`}
              title={item.dietary === 'veg' ? '100% Pure Vegetarian' : 'Non-Vegetarian'}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  item.dietary === 'veg' ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 pr-1">
              {item.dietary === 'veg' ? 'Veg' : 'Non-Veg'}
            </span>
          </div>

          {/* Quick info icon */}
          <button
            onClick={() => setDetailModalOpen(true)}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-orange-600 shadow-md flex items-center justify-center transition-colors"
            title="View Meal Details & Nutrition"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Category & Hindi Name */}
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                {item.category}
              </span>
              {item.hindiName && (
                <span className="text-stone-700 font-medium font-serif">
                  {item.hindiName}
                </span>
              )}
            </div>

            {/* Name */}
            <h3 className="font-extrabold text-stone-900 text-lg group-hover:text-orange-600 transition-colors line-clamp-1">
              {item.name}
            </h3>

            {/* Description */}
            <p className="text-xs text-stone-700 mt-1 line-clamp-2 leading-relaxed">
              {item.description}
            </p>

            {/* Inclusions pills */}
            <div className="flex flex-wrap gap-1 mt-3">
              {item.includedItems.slice(0, 3).map((inc, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium"
                >
                  {inc}
                </span>
              ))}
              {item.includedItems.length > 3 && (
                <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md font-bold">
                  +{item.includedItems.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Footer: Price & Add to Cart */}
          <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-stone-900">
                  ₹{item.price}
                </span>
                {item.originalPrice && (
                  <span className="text-xs text-stone-600 line-through">
                    ₹{item.originalPrice}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-stone-600 font-medium">
                {item.portionSize}
              </p>
            </div>

            {/* Cart Controller */}
            {currentQuantity > 0 ? (
              <div className="flex items-center bg-orange-600 text-white rounded-2xl shadow-md p-1">
                <button
                  onClick={() => updateCartQuantity(item.id, -1)}
                  className="w-7 h-7 rounded-xl hover:bg-orange-700 flex items-center justify-center transition-colors active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 font-black text-sm">{currentQuantity}</span>
                <button
                  onClick={() => updateCartQuantity(item.id, 1)}
                  className="w-7 h-7 rounded-xl hover:bg-orange-700 flex items-center justify-center transition-colors active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(item, 1)}
                disabled={!item.isAvailable}
                className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all ${
                  item.isAvailable
                    ? 'bg-amber-100 hover:bg-orange-600 text-orange-900 hover:text-white active:scale-95'
                    : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 relative max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-16/9 w-full">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setDetailModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl font-bold text-xs text-stone-800 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{item.rating} ({item.reviewCount} student ratings)</span>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-stone-900">{item.name}</h3>
                  <span className="text-xl font-extrabold text-orange-600">₹{item.price}</span>
                </div>
                {item.hindiName && (
                  <p className="text-stone-500 font-serif text-sm">{item.hindiName}</p>
                )}
                <p className="text-sm text-stone-600 mt-2 leading-relaxed">{item.description}</p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-100 text-center">
                <div className="bg-amber-50 p-2.5 rounded-xl">
                  <p className="text-[10px] text-stone-500 font-bold uppercase">Portion</p>
                  <p className="text-xs font-bold text-stone-900 mt-0.5">{item.portionSize}</p>
                </div>
                <div className="bg-orange-50 p-2.5 rounded-xl">
                  <p className="text-[10px] text-stone-500 font-bold uppercase">Calories</p>
                  <p className="text-xs font-bold text-stone-900 mt-0.5">{item.calories || 520} kcal</p>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl">
                  <p className="text-[10px] text-stone-500 font-bold uppercase">Spice</p>
                  <p className="text-xs font-bold text-emerald-800 mt-0.5 flex items-center justify-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    {item.spiceLevel}
                  </p>
                </div>
              </div>

              {/* Included Items */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-2">
                  What's included in this meal:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {item.includedItems.map((inc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs font-medium text-stone-700 bg-stone-50 p-2 rounded-xl"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hygiene guarantee */}
              <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-900 leading-relaxed">
                  <strong>Zero-Soda & Low Oil Commitment:</strong> Made fresh every meal time in our FSSAI-compliant cloud kitchen with pure RO water, fresh Himalayan ingredients, and motherly hygiene standards.
                </p>
              </div>

              {/* Modal action */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    addToCart(item, 1);
                    setDetailModalOpen(false);
                  }}
                  disabled={!item.isAvailable}
                  className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-transform active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  Add to Cart • ₹{item.price}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
