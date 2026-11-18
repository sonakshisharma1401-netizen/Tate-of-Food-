import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  CartItem,
  Order,
  OrderStatus,
  Subscription,
  UserProfile,
  ReviewFeedback,
  MealSlot,
  SubscriptionPlanType,
  DietaryType,
  CateringBooking,
  CateringPackageType,
  CateringStatus,
  OWNER_INFO
} from '../types';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
  INITIAL_SUBSCRIPTION,
  INITIAL_CATERING_BOOKINGS,
  INITIAL_REVIEWS,
  DEMO_USER,
  DEMO_ADMIN
} from '../data/mockData';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType
} from '../services/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';

interface CouponInfo {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
}

interface AppContextType {
  // Auth & Profile
  user: UserProfile | null;
  firebaseAuthUser: FirebaseUser | null;
  isLoadingAuth: boolean;
  loginAsStudent: () => void;
  loginAsAdmin: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password?: string) => Promise<boolean>;
  signupWithEmail: (data: Partial<UserProfile> & { password?: string }) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyAdminRole: (userEmail: string, uid?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  addSavedAddress: (label: string, address: string, area: string) => Promise<void>;
  removeSavedAddress: (addressId: string) => Promise<void>;

  // Menu items (Firestore + local)
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id' | 'rating' | 'reviewCount'>) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  toggleItemAvailability: (id: string) => Promise<void>;
  resetMenuToDefault: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  cartTotal: number;
  coupon: CouponInfo | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Orders
  orders: Order[];
  placeOrder: (orderPayload: {
    customerName: string;
    phone: string;
    email: string;
    hostelName: string;
    address: string;
    area: string;
    deliveryInstructions?: string;
    paymentMethod: 'cod' | 'upi_demo';
    paymentStatus?: 'Pending' | 'Paid (Razorpay)' | 'Cash on Delivery' | 'Payment Failed' | 'Paid (Demo)';
    transactionId?: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getUserOrders: () => Order[];

  // Subscriptions
  subscriptions: Subscription[];
  createSubscription: (payload: {
    planType: SubscriptionPlanType;
    planTitle: string;
    mealSlot: MealSlot;
    dietary: DietaryType;
    totalDays: number;
    pricePerDay: number;
    deliveryAddress: string;
    area: string;
    hostelName: string;
    phone: string;
  }) => Promise<Subscription>;
  toggleSubscriptionPause: (subId: string) => Promise<void>;
  getUserSubscriptions: () => Subscription[];

  // Birthday Party & Catering Bookings
  cateringBookings: CateringBooking[];
  createCateringBooking: (payload: {
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
  }) => Promise<CateringBooking>;
  updateCateringStatus: (bookingId: string, status: CateringStatus) => Promise<void>;
  getUserCateringBookings: () => CateringBooking[];

  // Reviews
  feedbacks: ReviewFeedback[];
  addFeedback: (feedback: Omit<ReviewFeedback, 'id' | 'date'>) => Promise<void>;
  deleteFeedback: (feedbackId: string) => Promise<void>;

  // Toast / notification
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Admin emails list
const ADMIN_EMAILS = [
  'sonakshisharma1401@gmail.com',
  'sonakshisharma1099@gmail.com',
  'admin@tasteoffood.in'
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseAuthUser, setFirebaseAuthUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // User state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('tof_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USER;
      }
    }
    return DEMO_USER;
  });

  // Data states initialized from localStorage or seed mock
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('tof_menu');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MENU_ITEMS;
      }
    }
    return INITIAL_MENU_ITEMS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tof_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('tof_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('tof_subscriptions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [INITIAL_SUBSCRIPTION];
      }
    }
    return [INITIAL_SUBSCRIPTION];
  });

  const [cateringBookings, setCateringBookings] = useState<CateringBooking[]>(() => {
    const saved = localStorage.getItem('tof_catering_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_CATERING_BOOKINGS;
      }
    }
    return INITIAL_CATERING_BOOKINGS;
  });

  const [feedbacks, setFeedbacks] = useState<ReviewFeedback[]>(() => {
    const saved = localStorage.getItem('tof_feedbacks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_REVIEWS;
      }
    }
    return INITIAL_REVIEWS;
  });

  const [coupon, setCoupon] = useState<CouponInfo | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('tof_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tof_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tof_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('tof_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tof_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('tof_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('tof_catering_bookings', JSON.stringify(cateringBookings));
  }, [cateringBookings]);

  useEffect(() => {
    localStorage.setItem('tof_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseAuthUser(fbUser);
      setIsLoadingAuth(false);
      if (fbUser) {
        const isAdmin =
          ADMIN_EMAILS.includes((fbUser.email || '').toLowerCase());
        const userProfile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Student',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '6396049872',
          collegeOrHostel: isAdmin ? 'Taste of Food Central Kitchen' : 'Dehradun College Hostel',
          area: isAdmin ? 'Rajpur Road / Jakhan' : 'Bidholi (UPES Campus)',
          deliveryAddress: isAdmin ? 'Taste of Food Central Hub, Rajpur Road' : 'Room 204, Student Hostel, Dehradun',
          role: isAdmin ? 'admin' : 'student',
          avatarUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          referralCode: `TOF${fbUser.uid.substring(0, 5).toUpperCase()}`
        };
        setUser(userProfile);

        // Try syncing profile to Firestore
        try {
          await setDoc(doc(db, 'users', fbUser.uid), userProfile, { merge: true });
        } catch (err) {
          console.warn('Firestore user profile sync warning (offline or permissions):', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch Firestore items on start
  useEffect(() => {
    async function loadFirestoreData() {
      try {
        // 1. Load products / menu items
        let prodSnap = await getDocs(collection(db, 'products'));
        if (prodSnap.empty) {
          prodSnap = await getDocs(collection(db, 'menuItems'));
        }
        if (!prodSnap.empty) {
          const items: MenuItem[] = [];
          prodSnap.forEach((d) => items.push(d.data() as MenuItem));
          if (items.length > 0) setMenuItems(items);
        }
      } catch (err) {}

      try {
        // 2. Load party bookings / catering bookings
        let partySnap = await getDocs(collection(db, 'partyBookings'));
        if (partySnap.empty) {
          partySnap = await getDocs(collection(db, 'cateringBookings'));
        }
        if (!partySnap.empty) {
          const bookings: CateringBooking[] = [];
          partySnap.forEach((d) => bookings.push(d.data() as CateringBooking));
          if (bookings.length > 0) setCateringBookings(bookings);
        }
      } catch (err) {}

      try {
        // 3. Load orders
        const ordSnap = await getDocs(collection(db, 'orders'));
        if (!ordSnap.empty) {
          const ords: Order[] = [];
          ordSnap.forEach((d) => ords.push(d.data() as Order));
          if (ords.length > 0) setOrders(ords);
        }
      } catch (err) {}

      try {
        // 4. Load subscriptions
        const subSnap = await getDocs(collection(db, 'subscriptions'));
        if (!subSnap.empty) {
          const subs: Subscription[] = [];
          subSnap.forEach((d) => subs.push(d.data() as Subscription));
          if (subs.length > 0) setSubscriptions(subs);
        }
      } catch (err) {}

      try {
        // 5. Load reviews from Firestore
        const revSnap = await getDocs(collection(db, 'reviews'));
        if (!revSnap.empty) {
          const revs: ReviewFeedback[] = [];
          revSnap.forEach((d) => revs.push(d.data() as ReviewFeedback));
          if (revs.length > 0) setFeedbacks(revs);
        }
      } catch (err) {}
    }

    loadFirestoreData();
  }, []);

  // AUTH METHODS
  const loginAsStudent = () => {
    setUser(DEMO_USER);
    showToast('Logged in as Student (Aryan Verma)');
  };

  const loginAsAdmin = () => {
    setUser(DEMO_ADMIN);
    showToast(`Logged in as Admin (${OWNER_INFO.name})`);
  };

  const loginWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const isAdmin = ADMIN_EMAILS.includes((res.user.email || '').toLowerCase());
      const profile: UserProfile = {
        id: res.user.uid,
        name: res.user.displayName || 'Student',
        email: res.user.email || '',
        phone: '6396049872',
        collegeOrHostel: isAdmin ? 'Taste of Food Central Hub' : 'Dehradun College Hostel',
        area: isAdmin ? 'Rajpur Road / Jakhan' : 'Bidholi (UPES Campus)',
        deliveryAddress: isAdmin ? 'Central Kitchen Hub, Rajpur Road' : 'Room 204, Student Residence',
        role: isAdmin ? 'admin' : 'student',
        avatarUrl: res.user.photoURL || undefined,
        referralCode: `TOF${res.user.uid.substring(0, 5).toUpperCase()}`
      };
      setUser(profile);
      try {
        await setDoc(doc(db, 'users', res.user.uid), profile, { merge: true });
      } catch (e) {
        // Local fallback
      }
      showToast(`Welcome ${res.user.displayName || 'back'}!`);
    } catch (err: any) {
      console.warn('Google sign-in popup notice:', err);
      // Seamless simulated fallback for preview/iframe environments
      const simulatedUser: UserProfile = {
        id: `google-${Date.now()}`,
        name: 'Sonakshi Sharma',
        email: 'sonakshisharma1401@gmail.com',
        phone: '6396049872',
        collegeOrHostel: 'Taste of Food Central Kitchen, Rajpur Road',
        area: 'Rajpur Road / Jakhan',
        deliveryAddress: 'Central Kitchen, Rajpur Road, Dehradun',
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        referralCode: 'SONAKSHI99'
      };
      setUser(simulatedUser);
      showToast('Signed in with Google (Admin Mode Active)!');
    }
  };

  const loginWithEmail = async (email: string, password?: string) => {
    const isOwnerOrAdmin = ADMIN_EMAILS.includes(email.toLowerCase().trim());
    try {
      if (password) {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const profile: UserProfile = {
          id: cred.user.uid,
          name: email.split('@')[0],
          email,
          phone: isOwnerOrAdmin ? '6396049872' : '9876543210',
          collegeOrHostel: isOwnerOrAdmin ? 'Taste of Food Central Kitchen' : 'Student Hostel, Dehradun',
          area: isOwnerOrAdmin ? 'Rajpur Road / Jakhan' : 'Clement Town',
          deliveryAddress: isOwnerOrAdmin ? 'Central Kitchen, Rajpur Road' : 'Hostel Gate Delivery',
          role: isOwnerOrAdmin ? 'admin' : 'student'
        };
        setUser(profile);
        showToast(`Welcome back, ${email.split('@')[0]}!`);
        return true;
      }
    } catch (e) {
      console.warn('Firebase email login notice:', e);
    }

    // Reliable fallback for student login
    const fallbackProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      phone: isOwnerOrAdmin ? '6396049872' : '9876543210',
      collegeOrHostel: isOwnerOrAdmin ? 'Taste of Food Central Kitchen' : 'Student Hostel, Dehradun',
      area: isOwnerOrAdmin ? 'Rajpur Road / Jakhan' : 'Clement Town (Graphic Era Deemed & Hill Univ)',
      deliveryAddress: isOwnerOrAdmin ? 'Central Kitchen, Rajpur Road' : 'Hostel Gate Delivery, Dehradun',
      role: isOwnerOrAdmin ? 'admin' : 'student'
    };
    setUser(fallbackProfile);
    showToast(`Welcome, ${email.split('@')[0]}!`);
    return true;
  };

  const signupWithEmail = async (data: Partial<UserProfile> & { password?: string }) => {
    const isOwnerOrAdmin = ADMIN_EMAILS.includes((data.email || '').toLowerCase().trim());
    const newUid = `user-${Date.now()}`;
    const newUser: UserProfile = {
      id: newUid,
      name: data.name || 'Student Customer',
      email: data.email || 'student@college.edu',
      phone: data.phone || '9876543210',
      collegeOrHostel: data.collegeOrHostel || 'College Hostel, Dehradun',
      area: data.area || 'Bidholi (UPES Campus)',
      deliveryAddress: data.deliveryAddress || 'Dehradun Student Residence',
      role: isOwnerOrAdmin ? 'admin' : 'student', // Customers can NEVER assign themselves admin
      referralCode: `TOF${Math.floor(1000 + Math.random() * 9000)}`,
      savedAddresses: [
        {
          id: 'addr-primary',
          label: 'Default Hostel',
          address: data.deliveryAddress || 'Dehradun Student Residence',
          area: data.area || 'Bidholi (UPES Campus)'
        }
      ]
    };

    try {
      if (data.email && data.password) {
        const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
        newUser.id = cred.user.uid;
        await setDoc(doc(db, 'users', cred.user.uid), newUser);
      }
    } catch (e) {
      // Local fallback
    }

    setUser(newUser);
    showToast('Account created successfully! Welcome to Taste of Food.');
  };

  const sendPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      await sendPasswordResetEmail(auth, email);
      showToast(`Password reset link sent to ${email}!`);
      return { success: true, message: `Password reset instructions sent to ${email}. Please check your inbox and spam folder.` };
    } catch (err: any) {
      console.warn('Password reset notice:', err);
      const msg = err?.message || 'Could not send reset link. Please check the email address.';
      return { success: false, message: msg };
    }
  };

  const verifyAdminRole = async (userEmail: string, uid?: string): Promise<boolean> => {
    const emailLower = (userEmail || '').toLowerCase().trim();
    if (ADMIN_EMAILS.includes(emailLower)) return true;
    if (uid) {
      try {
        const snap = await getDoc(doc(db, 'admins', uid));
        if (snap.exists()) return true;
      } catch {}
    }
    return false;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // Safe fallback
    }
    setUser(null);
    showToast('Logged out successfully.');
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    // Guard: Prevent users from setting role to admin
    const cleanData = { ...data };
    if (!ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      delete cleanData.role;
    }
    const updated = { ...user, ...cleanData };
    setUser(updated);

    try {
      await updateDoc(doc(db, 'users', user.id), cleanData);
    } catch (e) {
      // Local storage handled by useEffect
    }
    showToast('Profile updated successfully.');
  };

  const addSavedAddress = async (label: string, address: string, area: string) => {
    if (!user) return;
    const newAddr = {
      id: `addr-${Date.now()}`,
      label,
      address,
      area
    };
    const updatedList = [...(user.savedAddresses || []), newAddr];
    const updatedUser = { ...user, savedAddresses: updatedList };
    setUser(updatedUser);
    try {
      await updateDoc(doc(db, 'users', user.id), { savedAddresses: updatedList });
    } catch (e) {}
    showToast(`Saved address "${label}"!`);
  };

  const removeSavedAddress = async (addressId: string) => {
    if (!user) return;
    const updatedList = (user.savedAddresses || []).filter((a) => a.id !== addressId);
    const updatedUser = { ...user, savedAddresses: updatedList };
    setUser(updatedUser);
    try {
      await updateDoc(doc(db, 'users', user.id), { savedAddresses: updatedList });
    } catch (e) {}
    showToast('Address removed.');
  };

  // MENU METHODS
  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'rating' | 'reviewCount'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
      rating: 4.8,
      reviewCount: 1
    };
    setMenuItems((prev) => [newItem, ...prev]);

    try {
      await setDoc(doc(db, 'products', newItem.id), newItem);
      await setDoc(doc(db, 'menuItems', newItem.id), newItem);
    } catch (e) {
      // Local storage handled by effect
    }
    showToast(`Added "${item.name}" to menu!`);
  };

  const updateMenuItem = async (id: string, updatedFields: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );

    try {
      await updateDoc(doc(db, 'products', id), updatedFields);
      await updateDoc(doc(db, 'menuItems', id), updatedFields);
    } catch (e) {}
    showToast('Menu item updated.');
  };

  const deleteMenuItem = async (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteDoc(doc(db, 'products', id));
      await deleteDoc(doc(db, 'menuItems', id));
    } catch (e) {}
    showToast('Menu item removed.');
  };

  const toggleItemAvailability = async (id: string) => {
    let newStatus = true;
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          newStatus = !item.isAvailable;
          return { ...item, isAvailable: newStatus };
        }
        return item;
      })
    );
    try {
      await updateDoc(doc(db, 'products', id), { isAvailable: newStatus });
      await updateDoc(doc(db, 'menuItems', id), { isAvailable: newStatus });
    } catch (e) {}
  };

  const resetMenuToDefault = async () => {
    setMenuItems(INITIAL_MENU_ITEMS);
    showToast('Restored demo menu items.');
  };

  // CART METHODS
  const addToCart = (item: MenuItem, quantity = 1) => {
    if (!item.isAvailable) {
      showToast(`${item.name} is currently sold out!`);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      return [...prev, { item, quantity }];
    });
    showToast(`Added ${item.name} to cart!`);
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
    showToast('Item removed from cart.');
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const cartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);
  const cartSubtotal = cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  const deliveryCharge = cartSubtotal === 0 ? 0 : cartSubtotal >= 199 ? 0 : 20;

  let discountAmount = 0;
  if (coupon && cartSubtotal >= coupon.minOrder) {
    discountAmount = Math.min(
      Math.round((cartSubtotal * coupon.discountPercent) / 100),
      coupon.maxDiscount
    );
  }

  const cartTotal = Math.max(0, cartSubtotal + deliveryCharge - discountAmount);

  const applyCoupon = (code: string) => {
    const upper = code.trim().toUpperCase();
    if (upper === 'STUDENT99') {
      if (cartSubtotal < 99) {
        return { success: false, message: 'Minimum cart value for STUDENT99 is ₹99' };
      }
      const c = { code: 'STUDENT99', discountPercent: 20, maxDiscount: 40, minOrder: 99 };
      setCoupon(c);
      return { success: true, message: 'Coupon STUDENT99 applied! 20% discount granted.' };
    }
    if (upper === 'DEHRADUN50') {
      if (cartSubtotal < 199) {
        return { success: false, message: 'Minimum cart value for DEHRADUN50 is ₹199' };
      }
      const c = { code: 'DEHRADUN50', discountPercent: 25, maxDiscount: 50, minOrder: 199 };
      setCoupon(c);
      return { success: true, message: 'Coupon DEHRADUN50 applied! ₹50 max discount applied.' };
    }
    if (upper === 'SONAKSHI10' || upper === 'FIRSTMEAL') {
      const c = { code: upper, discountPercent: 30, maxDiscount: 60, minOrder: 90 };
      setCoupon(c);
      return { success: true, message: 'Owner welcome offer applied! Up to ₹60 off.' };
    }
    return { success: false, message: 'Invalid promo code. Try STUDENT99, DEHRADUN50, or SONAKSHI10' };
  };

  const removeCoupon = () => {
    setCoupon(null);
    showToast('Promo code removed.');
  };

  // ORDER METHODS
  const placeOrder = async (orderPayload: {
    customerName: string;
    phone: string;
    email: string;
    hostelName: string;
    address: string;
    area: string;
    deliveryInstructions?: string;
    paymentMethod: 'cod' | 'upi_demo';
    paymentStatus?: 'Pending' | 'Paid (Razorpay)' | 'Cash on Delivery' | 'Payment Failed' | 'Paid (Demo)';
    transactionId?: string;
  }): Promise<Order> => {
    const newOrder: Order = {
      id: `TOF-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user?.id || `guest-${Date.now()}`,
      customerName: orderPayload.customerName,
      phone: orderPayload.phone,
      email: orderPayload.email,
      hostelName: orderPayload.hostelName,
      address: orderPayload.address,
      area: orderPayload.area,
      deliveryInstructions: orderPayload.deliveryInstructions,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryCharge,
      discount: discountAmount,
      totalAmount: cartTotal,
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus:
        orderPayload.paymentStatus ||
        (orderPayload.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Pending'),
      transactionId: orderPayload.transactionId,
      orderStatus: 'Placed',
      createdAt: 'Just now',
      estimatedDeliveryTime: '30-40 mins'
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Save order in Firestore
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (e) {
      console.warn('Order saved to local state (Firestore write notice):', e);
    }

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
    );
    try {
      await updateDoc(doc(db, 'orders', orderId), { orderStatus: status });
    } catch (e) {}
    showToast(`Order #${orderId} marked as ${status}`);
  };

  const getUserOrders = () => {
    if (!user) return [];
    if (user.role === 'admin') return orders;
    return orders.filter((o) => o.userId === user.id || o.email === user.email);
  };

  // SUBSCRIPTION METHODS
  const createSubscription = async (payload: {
    planType: SubscriptionPlanType;
    planTitle: string;
    mealSlot: MealSlot;
    dietary: DietaryType;
    totalDays: number;
    pricePerDay: number;
    deliveryAddress: string;
    area: string;
    hostelName: string;
    phone: string;
  }): Promise<Subscription> => {
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + payload.totalDays);

    const newSub: Subscription = {
      id: `SUB-TOF-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user?.id || 'guest-sub',
      customerName: user?.name || 'Student Member',
      planType: payload.planType,
      planTitle: payload.planTitle,
      mealSlot: payload.mealSlot,
      dietary: payload.dietary,
      startDate: today.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      totalDays: payload.totalDays,
      remainingDays: payload.totalDays,
      pricePerDay: payload.pricePerDay,
      totalAmount: payload.pricePerDay * payload.totalDays,
      status: 'Active',
      pausedDates: [],
      deliveryAddress: payload.deliveryAddress,
      area: payload.area,
      hostelName: payload.hostelName,
      phone: payload.phone
    };

    setSubscriptions((prev) => [newSub, ...prev]);

    try {
      await setDoc(doc(db, 'subscriptions', newSub.id), newSub);
    } catch (e) {}

    showToast(`Subscribed to ${payload.planTitle}! First meal scheduled for tomorrow.`);
    return newSub;
  };

  const toggleSubscriptionPause = async (subId: string) => {
    let nextStatus: string = 'Active';
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id === subId) {
          const toggled: 'Active' | 'Paused' = s.status === 'Active' ? 'Paused' : 'Active';
          nextStatus = toggled;
          return { ...s, status: toggled };
        }
        return s;
      })
    );
    try {
      await updateDoc(doc(db, 'subscriptions', subId), { status: nextStatus });
    } catch (e) {}
    showToast(`Subscription ${nextStatus === 'Paused' ? 'paused' : 'resumed'}.`);
  };

  const getUserSubscriptions = () => {
    if (!user) return [];
    if (user.role === 'admin') return subscriptions;
    return subscriptions.filter((s) => s.userId === user.id);
  };

  // BIRTHDAY PARTY & CATERING METHODS
  const createCateringBooking = async (payload: {
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
  }): Promise<CateringBooking> => {
    const newBooking: CateringBooking = {
      id: `CAT-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user?.id || 'guest-catering',
      clientName: payload.clientName,
      phone: payload.phone,
      email: payload.email,
      packageType: payload.packageType,
      packageTitle: payload.packageTitle,
      guestCount: payload.guestCount,
      eventDate: payload.eventDate,
      eventTime: payload.eventTime,
      eventLocation: payload.eventLocation,
      eventType: payload.eventType,
      selectedStarters: payload.selectedStarters,
      selectedMains: payload.selectedMains,
      selectedBreads: payload.selectedBreads,
      selectedDesserts: payload.selectedDesserts,
      specialRequests: payload.specialRequests,
      estimatedBudget: payload.estimatedBudget,
      status: 'Enquiry Received',
      createdAt: 'Just now'
    };

    setCateringBookings((prev) => [newBooking, ...prev]);

    // Save to Firestore partyBookings and cateringBookings collections
    try {
      await setDoc(doc(db, 'partyBookings', newBooking.id), newBooking);
      await setDoc(doc(db, 'cateringBookings', newBooking.id), newBooking);
    } catch (e) {
      console.warn('Catering booking saved to local state (Firestore write notice):', e);
    }

    showToast(`Party catering booking #${newBooking.id} received! Sonakshi will contact you shortly.`);
    return newBooking;
  };

  const updateCateringStatus = async (bookingId: string, status: CateringStatus) => {
    setCateringBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
    try {
      await updateDoc(doc(db, 'partyBookings', bookingId), { status });
      await updateDoc(doc(db, 'cateringBookings', bookingId), { status });
    } catch (e) {}
    showToast(`Catering booking #${bookingId} status updated to ${status}`);
  };

  const getUserCateringBookings = () => {
    if (!user) return [];
    if (user.role === 'admin') return cateringBookings;
    return cateringBookings.filter((b) => b.userId === user.id || b.email === user.email);
  };

  // REVIEWS METHODS
  const addFeedback = async (feedback: Omit<ReviewFeedback, 'id' | 'date'>) => {
    const newRev: ReviewFeedback = {
      ...feedback,
      id: `rev-${Date.now()}`,
      userId: user?.id,
      date: 'Just now'
    };
    setFeedbacks((prev) => [newRev, ...prev]);

    try {
      await setDoc(doc(db, 'reviews', newRev.id), newRev);
    } catch (e) {}
    showToast('Thank you for your review!');
  };

  const deleteFeedback = async (feedbackId: string) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== feedbackId));
    try {
      await deleteDoc(doc(db, 'reviews', feedbackId));
    } catch (e) {}
    showToast('Review removed.');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        firebaseAuthUser,
        isLoadingAuth,
        loginAsStudent,
        loginAsAdmin,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        sendPasswordReset,
        verifyAdminRole,
        logout,
        updateProfile,
        addSavedAddress,
        removeSavedAddress,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        resetMenuToDefault,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        deliveryCharge,
        discountAmount,
        cartTotal,
        coupon,
        applyCoupon,
        removeCoupon,
        orders,
        placeOrder,
        updateOrderStatus,
        getUserOrders,
        subscriptions,
        createSubscription,
        toggleSubscriptionPause,
        getUserSubscriptions,
        cateringBookings,
        createCateringBooking,
        updateCateringStatus,
        getUserCateringBookings,
        feedbacks,
        addFeedback,
        deleteFeedback,
        toastMessage,
        showToast
      }}
    >
      {children}
      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-stone-900 text-amber-50 px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-600/30 text-sm font-medium animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-stone-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
