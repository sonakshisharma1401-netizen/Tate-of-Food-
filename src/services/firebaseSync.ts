import {
  db,
  auth,
  storage,
  handleFirestoreError,
  OperationType
} from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { INITIAL_MENU_ITEMS, INITIAL_REVIEWS } from '../data/mockData';
import rawConfig from '../../firebase-applet-config.json';
import { Order, CateringBooking } from '../types';

export interface FirebaseConnectionStatus {
  projectId: string;
  databaseId: string;
  storageBucket: string;
  authConfigured: boolean;
  firestoreConnected: boolean;
  collectionsStatus: {
    users: number;
    products: number;
    orders: number;
    subscriptions: number;
    partyBookings: number;
    reviews: number;
    admins: number;
  };
  lastChecked: string;
  error?: string;
}

/**
 * Seeds default data into Cloud Firestore across products, reviews, and admin collections.
 */
export async function seedFirestoreIfEmpty(): Promise<{ seeded: boolean; message: string }> {
  try {
    // 1. Seed products & menuItems
    const productsCollection = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollection);

    if (productsSnapshot.empty) {
      console.log('Seeding initial products to Cloud Firestore...');
      for (const item of INITIAL_MENU_ITEMS) {
        await setDoc(doc(db, 'products', item.id), item);
        await setDoc(doc(db, 'menuItems', item.id), item);
      }
    }

    // 2. Seed admin document for Sonakshi Sharma
    const adminRef1 = doc(db, 'admins', 'admin_sonakshi_1401');
    await setDoc(adminRef1, {
      email: 'sonakshisharma1401@gmail.com',
      name: 'Sonakshi Sharma',
      role: 'admin',
      updatedAt: new Date().toISOString()
    }, { merge: true });

    const adminRef2 = doc(db, 'admins', 'admin_sonakshi_1099');
    await setDoc(adminRef2, {
      email: 'sonakshisharma1099@gmail.com',
      name: 'Sonakshi Sharma (AI Studio)',
      role: 'admin',
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // 3. Seed reviews if empty
    const reviewCollection = collection(db, 'reviews');
    const revSnapshot = await getDocs(reviewCollection);
    if (revSnapshot.empty) {
      for (const rev of INITIAL_REVIEWS) {
        await setDoc(doc(db, 'reviews', rev.id), rev);
      }
    }

    return { seeded: true, message: 'Cloud Firestore collections (products, reviews, admins) initialized successfully!' };
  } catch (error: any) {
    console.warn('Firestore seed notice:', error);
    return { seeded: false, message: `Firestore initialization notice: ${error?.message || error}` };
  }
}

/**
 * Tests saving and retrieving an actual customer order and birthday party booking in Cloud Firestore.
 */
export async function testSaveOrderAndPartyBooking(): Promise<{
  success: boolean;
  orderId: string;
  bookingId: string;
  details: string[];
}> {
  const details: string[] = [];
  const testOrderId = `TOF-TEST-${Math.floor(1000 + Math.random() * 9000)}`;
  const testBookingId = `CAT-TEST-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    // 1. Test Order Save
    const testOrder: Order = {
      id: testOrderId,
      userId: auth.currentUser?.uid || 'student_test_user_01',
      customerName: auth.currentUser?.displayName || 'Test Student Customer',
      phone: '6396049872',
      email: auth.currentUser?.email || 'sonakshisharma1401@gmail.com',
      hostelName: 'Mandakini Hostel, UPES Bidholi',
      address: 'Room 302, Mandakini Hostel Block B',
      area: 'Bidholi (UPES Campus)',
      items: [
        {
          item: INITIAL_MENU_ITEMS[0],
          quantity: 1
        }
      ],
      subtotal: 99,
      deliveryCharge: 0,
      discount: 0,
      totalAmount: 99,
      paymentMethod: 'cod',
      paymentStatus: 'Cash on Delivery',
      orderStatus: 'Placed',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '30-40 mins'
    };

    details.push(`[orders] Writing test customer order document '${testOrderId}'...`);
    await setDoc(doc(db, 'orders', testOrderId), testOrder);
    
    // Read it back from Cloud Firestore to verify
    const readBackOrder = await getDoc(doc(db, 'orders', testOrderId));
    if (readBackOrder.exists()) {
      details.push(`✓ [orders] Successfully verified test order '${testOrderId}' saved in Cloud Firestore!`);
    } else {
      throw new Error(`Order document '${testOrderId}' could not be verified after write.`);
    }

    // 2. Test Party Booking Save
    const testBooking: CateringBooking = {
      id: testBookingId,
      userId: auth.currentUser?.uid || 'student_test_user_01',
      clientName: auth.currentUser?.displayName || 'Aryan Verma (Birthday Party)',
      phone: '6396049872',
      email: auth.currentUser?.email || 'sonakshisharma1401@gmail.com',
      packageType: 'Standard',
      packageTitle: 'Dhamaka Student Birthday Bash (₹449/plate)',
      guestCount: 25,
      eventDate: '2026-11-15',
      eventTime: '7:30 PM',
      eventLocation: 'Jakhan Community Hall / Terrace, Dehradun',
      eventType: 'Birthday Party',
      selectedStarters: ['Paneer Tikka Shashlik', 'Crispy Corn Salt & Pepper'],
      selectedMains: ['Butter Paneer', 'Dal Makhani', 'Jeera Pulao'],
      selectedBreads: ['Butter Naan', 'Tandoori Roti'],
      selectedDesserts: ['Gulab Jamun (Hot) with Ice Cream'],
      specialRequests: 'Birthday cake table setup and warm food buffet counters',
      estimatedBudget: 11225,
      status: 'Enquiry Received',
      createdAt: new Date().toISOString()
    };

    details.push(`[partyBookings] Writing party booking enquiry document '${testBookingId}'...`);
    await setDoc(doc(db, 'partyBookings', testBookingId), testBooking);
    await setDoc(doc(db, 'cateringBookings', testBookingId), testBooking);

    // Read it back from Cloud Firestore to verify
    const readBackBooking = await getDoc(doc(db, 'partyBookings', testBookingId));
    if (readBackBooking.exists()) {
      details.push(`✓ [partyBookings] Successfully verified party booking '${testBookingId}' saved in Cloud Firestore!`);
    } else {
      throw new Error(`Party booking '${testBookingId}' could not be verified after write.`);
    }

    // Clean up temporary verification documents to maintain genuine production database
    try {
      await deleteDoc(doc(db, 'orders', testOrderId));
      await deleteDoc(doc(db, 'partyBookings', testBookingId));
      await deleteDoc(doc(db, 'cateringBookings', testBookingId));
      details.push('🧹 Verified temporary test records cleaned up from database automatically.');
    } catch (cleanupErr) {
      console.warn('Auto-cleanup notice:', cleanupErr);
    }

    details.push('🎉 Cloud Firestore read/write test completed with 100% success!');
    return {
      success: true,
      orderId: testOrderId,
      bookingId: testBookingId,
      details
    };
  } catch (error: any) {
    console.error('Test write error:', error);
    details.push(`❌ Test write failed: ${error?.message || error}`);
    return {
      success: false,
      orderId: testOrderId,
      bookingId: testBookingId,
      details
    };
  }
}

/**
 * Checks connectivity and counts across provisioned Firestore collections:
 * users, products, orders, subscriptions, partyBookings, reviews, admins
 */
export async function getFirebaseHealth(): Promise<FirebaseConnectionStatus> {
  const status: FirebaseConnectionStatus = {
    projectId: rawConfig.projectId,
    databaseId: rawConfig.firestoreDatabaseId,
    storageBucket: rawConfig.storageBucket,
    authConfigured: !!rawConfig.apiKey && !!rawConfig.authDomain,
    firestoreConnected: false,
    collectionsStatus: {
      users: 0,
      products: 0,
      orders: 0,
      subscriptions: 0,
      partyBookings: 0,
      reviews: 0,
      admins: 0
    },
    lastChecked: new Date().toLocaleTimeString()
  };

  try {
    // Test connection via getDocs on products / menuItems
    try {
      const prodSnap = await getDocs(collection(db, 'products'));
      status.collectionsStatus.products = prodSnap.size;
      status.firestoreConnected = true;
    } catch {
      const menuSnap = await getDocs(collection(db, 'menuItems'));
      status.collectionsStatus.products = menuSnap.size;
      status.firestoreConnected = true;
    }

    try {
      const userSnap = await getDocs(collection(db, 'users'));
      status.collectionsStatus.users = userSnap.size;
    } catch {}

    try {
      const ordersSnap = await getDocs(collection(db, 'orders'));
      status.collectionsStatus.orders = ordersSnap.size;
    } catch {}

    try {
      const subsSnap = await getDocs(collection(db, 'subscriptions'));
      status.collectionsStatus.subscriptions = subsSnap.size;
    } catch {}

    try {
      const partySnap = await getDocs(collection(db, 'partyBookings'));
      status.collectionsStatus.partyBookings = partySnap.size;
    } catch {
      try {
        const cateringSnap = await getDocs(collection(db, 'cateringBookings'));
        status.collectionsStatus.partyBookings = cateringSnap.size;
      } catch {}
    }

    try {
      const revSnap = await getDocs(collection(db, 'reviews'));
      status.collectionsStatus.reviews = revSnap.size;
    } catch {}

    try {
      const adminSnap = await getDocs(collection(db, 'admins'));
      status.collectionsStatus.admins = adminSnap.size;
    } catch {}

  } catch (e: any) {
    status.firestoreConnected = false;
    status.error = e?.message || String(e);
  }

  return status;
}

/**
 * Safely scans and removes test documents (TOF-TEST-* and CAT-TEST-*) from orders and partyBookings
 * collections to guarantee zero mock or test pollution before production deployment.
 */
export async function cleanupTestRecords(): Promise<{
  deletedOrdersCount: number;
  deletedBookingsCount: number;
  cleanedIds: string[];
}> {
  const cleanedIds: string[] = [];
  let deletedOrdersCount = 0;
  let deletedBookingsCount = 0;

  try {
    // 1. Scan and delete test orders
    const ordersSnap = await getDocs(collection(db, 'orders'));
    for (const docSnap of ordersSnap.docs) {
      if (docSnap.id.startsWith('TOF-TEST-')) {
        await deleteDoc(doc(db, 'orders', docSnap.id));
        cleanedIds.push(docSnap.id);
        deletedOrdersCount++;
      }
    }

    // 2. Scan and delete test party bookings
    const partySnap = await getDocs(collection(db, 'partyBookings'));
    for (const docSnap of partySnap.docs) {
      if (docSnap.id.startsWith('CAT-TEST-')) {
        await deleteDoc(doc(db, 'partyBookings', docSnap.id));
        cleanedIds.push(docSnap.id);
        deletedBookingsCount++;
      }
    }

    // Also check cateringBookings alias
    try {
      const catSnap = await getDocs(collection(db, 'cateringBookings'));
      for (const docSnap of catSnap.docs) {
        if (docSnap.id.startsWith('CAT-TEST-')) {
          await deleteDoc(doc(db, 'cateringBookings', docSnap.id));
        }
      }
    } catch {}

    console.log(`Cleaned up ${deletedOrdersCount} test orders and ${deletedBookingsCount} test bookings.`);
  } catch (err) {
    console.warn('Test records cleanup notice:', err);
  }

  return {
    deletedOrdersCount,
    deletedBookingsCount,
    cleanedIds
  };
}
