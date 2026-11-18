# Taste of Food 🍲 | Dehradun

> **Ghar Jaisa Khana, Ab Dehradun Mein!**  
> Affordable, hygienic, and authentic home-style meal ordering, weekly/monthly tiffin subscriptions, and student birthday party catering across Dehradun, Uttarakhand.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore%20%7C%20Storage-orange.svg)](https://firebase.google.com/)

---

## 📌 Business Overview

- **Brand:** Taste of Food (Dehradun)
- **Founder / Owner:** Sonakshi Sharma
- **Contact:** +91 6396049872 | sonakshisharma1401@gmail.com
- **Central Kitchen:** Rajpur Road / Jakhan, Dehradun, Uttarakhand, India
- **Currency:** Indian Rupee (₹)
- **Primary Audience:** College students (UPES, Graphic Era, DIT, IMS Unison, Uttaranchal Univ), PG residents, and young working professionals.

---

## ✨ Features

### 1. Student Special Thali & Menu Ordering
- **Homestyle Thalis:** Daily changing lunch and dinner menus with real ghar-ka-swad (zero soda, fresh Himalayan ingredients, low oil).
- **Categories:** Thali, Meals, Snacks, Beverages, and Student Combos.
- **Dietary & Spice Filters:** Pure Veg and Non-Veg indicators, spice level ratings (Mild, Medium, Spicy), and nutritional breakdowns.
- **Cart & Dynamic Pricing:** Automatic Dehradun campus delivery calculation (Free delivery above ₹149, else ₹30) and student discount promo codes (`STUDENT15`, `FIRST50`, `HOSTEL20`).

### 2. Tiffin Subscriptions
- **Flexible Plans:** 7-Day Weekly and 30-Day Monthly subscriptions.
- **Meal Slots:** Lunch, Dinner, or Both Meals with doorstep hostel gate delivery.
- **Student Pause Feature:** Students can mark away dates (e.g., weekend trips or exams) to automatically freeze and extend active subscriptions.

### 3. Birthday Party & Event Catering
- **Tiered Packages:** Basic Party Bash (₹299/plate), Dhamaka Student Special (₹449/plate), and Royal Himalayan Feast (₹649/plate).
- **Interactive Customizer:** Live guest count slider (10 to 500+ guests), customized starter/main/dessert pickers, and automated estimate calculations.
- **Enquiry Dispatch:** Stores catering requests directly in Cloud Firestore with instant admin notification.

### 4. Customer Experience
- **Authentication:** One-click Google Sign-In and Email/Password authentication via Firebase Auth.
- **Order Tracking:** Real-time visual status timeline (`Placed` ➔ `Kitchen Preparing` ➔ `Out for Delivery` ➔ `Delivered`).
- **Digital Tax Invoice:** Formatted official bill with itemization, delivery coordinates, and one-click print/PDF download.
- **One-Click Reorder:** Repeat favorite meals directly from past order history.

### 5. Admin Management Dashboard
- **Role-Based Access Control:** Strict admin-only access guarded by Firebase security rules and verified admin email.
- **Menu Management:** Add, edit, price, toggle availability, and delete dishes with real-time Firestore sync.
- **Dish Photo Uploads:** Integrated Firebase Storage uploader with client compression, file validation, and preview.
- **Order Management:** Live order status updates reflecting immediately on customer screens.
- **Catering CRM:** Review event leads, update statuses, and log internal notes.
- **Review Moderation:** Approve or reject customer testimonials before public showcase.
- **Business Analytics:** Real-time metrics for revenue, active orders, today's thali counts, and average order values.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, React Router DOM v7 |
| **Styling & Icons** | Tailwind CSS v4, Lucide React, Canvas Confetti |
| **Authentication** | Firebase Authentication (Google Auth + Email/Password) |
| **Database** | Cloud Firestore (Real-time NoSQL) |
| **Media Storage** | Firebase Cloud Storage (Food photography & dish uploads) |
| **Build & Tooling** | Vite 8, Bun / npm, TypeScript Compiler (`tsc`) |

---

## 📁 Project Structure

```
taste-of-food/
├── .env.example                 # Environment variables template
├── .gitignore                   # Git exclusions (dist, env, credentials)
├── firestore.rules              # Cloud Firestore security rules
├── storage.rules                # Firebase Storage security rules
├── firebase-blueprint.json      # Firestore collections schema definitions
├── firebase-applet-config.json  # Web applet Firebase configuration
├── index.html                   # HTML entry point with typography & meta tags
├── metadata.json                # Project identity and capability definitions
├── package.json                 # Dependencies and build scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS v4
└── src/
    ├── main.tsx                 # React entry point
    ├── App.tsx                  # Main app layout, routing, toast notifications
    ├── index.css                # Global stylesheet & Tailwind directives
    ├── components/              # Reusable UI components
    │   ├── Navbar.tsx           # Responsive navigation with badge & user menu
    │   ├── Footer.tsx           # Footer with business details & quick links
    │   ├── FoodCard.tsx         # Menu item card with details modal & quick add
    │   └── Toast.tsx            # Animated notification alert
    ├── context/
    │   └── AppContext.tsx       # Global application state (Cart, Auth, Orders)
    ├── data/
    │   └── mockData.ts          # Baseline menu catalog and initial reviews
    ├── pages/                   # Application pages
    │   ├── HomePage.tsx         # Hero section, thalis, reviews, CTA banners
    │   ├── MenuPage.tsx         # Filterable food menu catalog
    │   ├── SubscriptionsPage.tsx# Tiffin subscription builder & FAQs
    │   ├── CateringPage.tsx     # Birthday & catering package customizer
    │   ├── CartPage.tsx         # Shopping cart review & coupon discounts
    │   ├── CheckoutPage.tsx     # Delivery details & COD / Razorpay checkout
    │   ├── DashboardPage.tsx    # Customer orders, invoice modal, profile
    │   ├── AdminPage.tsx        # Complete admin operations dashboard
    │   ├── AboutPage.tsx        # Story, kitchen hygiene, Dehradun hubs
    │   ├── ContactPage.tsx      # Contact form, phone, WhatsApp, map links
    │   └── AuthModal.tsx        # Login & Signup modal dialog
    ├── services/                # External integrations
    │   ├── firebase.ts          # Firebase SDK initialization & error handling
    │   ├── firebaseSync.ts      # Data seeding, health check, test cleanup
    │   └── storageService.ts    # Firebase Storage food image upload service
    └── types/
        └── index.ts             # TypeScript domain interfaces & types
```

---

## 🚀 Installation & Local Development

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** (v9+) or **bun**

### 2. Clone Repository
```bash
git clone https://github.com/your-username/taste-of-food.git
cd taste-of-food
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy the environment template to `.env`:
```bash
cp .env.example .env
```
Fill in your Firebase project keys in `.env`:
```ini
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
VITE_FIREBASE_FIRESTORE_DATABASE_ID="default"

# Optional: Razorpay Public Key ID (for online payments)
VITE_RAZORPAY_KEY_ID="rzp_test_your_key_id"
```

> **Security Reminder:** Never commit `.env` or any files containing private keys or secret keys to GitHub. Only public client identifiers are allowed in `.env`.

### 5. Start Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🔒 Firebase Security Rules Setup

This repository includes audited and hardened security rules:

### Firestore Rules (`firestore.rules`)
Enforces:
- Public read access for menu products and customer reviews.
- Owner-only access for personal profile and orders.
- Tamper-proof validation on subscription pricing fields.
- Verified email checks (`request.auth.token.email_verified == true`) for administrative operations.

Deploy using Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

### Storage Rules (`storage.rules`)
Enforces:
- Public read access for menu photos.
- Admin-only write and delete permissions with 5MB file size limit and MIME-type verification.

Deploy using Firebase CLI:
```bash
firebase deploy --only storage
```

---

## 📦 Production Build & Testing

### TypeScript Check & Lint
```bash
npm run lint
```

### Production Build
```bash
npm run build
```
The optimized production bundle is compiled into the `dist/` directory.

### Preview Production Build Locally
```bash
npm run preview
```

---

## 🌐 Vercel Deployment Guide

1. Push your code to GitHub (ensure `.gitignore` prevents `.env` and `node_modules` from being pushed).
2. Connect your GitHub repository to [Vercel](https://vercel.com).
3. Set the project settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Under **Settings > Environment Variables**, add:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_FIRESTORE_DATABASE_ID`
   - `VITE_RAZORPAY_KEY_ID` (optional)
5. Click **Deploy**.

---

## 📄 License & Attribution

Designed and developed for **Taste of Food**, Dehradun, Uttarakhand, India.  
Copyright © 2026 Taste of Food. All rights reserved.
