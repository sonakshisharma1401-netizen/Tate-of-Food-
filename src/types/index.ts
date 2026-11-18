export type MealCategory = 'All' | 'Thali' | 'Meals' | 'Snacks' | 'Beverages' | 'Combos';

export type DietaryType = 'veg' | 'non-veg';

export interface MenuItem {
  id: string;
  name: string;
  hindiName?: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: MealCategory;
  dietary: DietaryType;
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
  isSpecialStudentOffer?: boolean;
  calories?: number;
  portionSize: string;
  includedItems: string[];
  spiceLevel: 'Mild' | 'Medium' | 'Spicy';
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus = 'Placed' | 'Kitchen Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export type PaymentMethod = 'cod' | 'upi_demo';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  email: string;
  hostelName: string;
  address: string;
  area: string;
  deliveryInstructions?: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid (Razorpay)' | 'Cash on Delivery' | 'Payment Failed' | 'Paid (Demo)';
  transactionId?: string;
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime?: string;
}

export type SubscriptionPlanType = 'weekly' | 'monthly' | 'custom';
export type MealSlot = 'lunch' | 'dinner' | 'both';

export interface Subscription {
  id: string;
  userId: string;
  customerName: string;
  planType: SubscriptionPlanType;
  planTitle: string;
  mealSlot: MealSlot;
  dietary: DietaryType;
  startDate: string;
  endDate: string;
  totalDays: number;
  remainingDays: number;
  pricePerDay: number;
  totalAmount: number;
  status: 'Active' | 'Paused' | 'Expired';
  pausedDates?: string[];
  deliveryAddress: string;
  area: string;
  hostelName: string;
  phone: string;
}

export type CateringPackageType = 'Basic' | 'Standard' | 'Premium' | 'Custom';
export type CateringStatus = 'Enquiry Received' | 'Quotation Sent' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface CateringBooking {
  id: string;
  userId: string;
  clientName: string;
  phone: string;
  email: string;
  packageType: CateringPackageType;
  packageTitle: string;
  guestCount: number;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventType: 'Birthday Party' | 'Hostel College Fest' | 'Farewell / Freshers' | 'Other Celebration';
  selectedStarters: string[];
  selectedMains: string[];
  selectedBreads: string[];
  selectedDesserts: string[];
  specialRequests?: string;
  estimatedBudget: number;
  status: CateringStatus;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  collegeOrHostel: string;
  area: string;
  deliveryAddress: string;
  role: 'student' | 'admin';
  avatarUrl?: string;
  referralCode?: string;
  savedAddresses?: {
    id: string;
    label: string; // e.g. "Hostel Room", "Library Gate", "Friend's PG"
    address: string;
    area: string;
  }[];
}

export interface ReviewFeedback {
  id: string;
  userId?: string;
  userName: string;
  college: string;
  rating: number;
  comment: string;
  date: string;
  dishName?: string;
  verifiedStudent: boolean;
}

export const OWNER_INFO = {
  name: 'Sonakshi Sharma',
  mobile: '6396049872',
  email: 'sonakshisharma1401@gmail.com',
  location: 'Dehradun, Uttarakhand, India',
  whatsappUrl: 'https://wa.me/916396049872',
  telUrl: 'tel:+916396049872',
  mailUrl: 'mailto:sonakshisharma1401@gmail.com',
  currency: 'INR (₹)'
};
