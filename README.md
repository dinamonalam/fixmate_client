# FixMate Client Application 🛠️

FixMate is an on-demand Smart Device & Home Appliance Repair Service Platform frontend engineered with Next.js (App Router), TypeScript, Tailwind CSS, and Lucide icons.

## 📌 Project Overview
- **Project Name:** FixMate Client
- **Purpose:** Provide a seamless, role-based user experience for Customers, Technicians, and Administrators. Enables live service discovery, instant repair request scheduling, milestone job pipeline tracking, pay-after-service Stripe Checkout settlement, and administrative governance.
- **Admin Credentials:** `admin@fixmate.com` / `Admin@123`
- **Technician Credentials:** `tech.rahim@fixmate.com` / `Tech@123`
- **Customer Credentials:** `customer.arman@fixmate.com` / `Customer@123`
- **Live Site URL:** https://fixmate-client.vercel.app (or deployed Vercel domain)

---

## 🌟 Key Features & Implementation
1. **Dynamic Homepage:**
   - Modern banner headline ("Broken Device? Get It Fixed by Verified Technicians") with quick search.
   - Dynamic 6 latest approved and available repair services grid.
   - 4-step interactive operational workflow (Find a Service ➔ Send a Request ➔ Technician Fixes It ➔ Pay After Completion).
   - Popular categories showcase with platform trust indicators (99% Fix rate, 30-Day Warranty).
2. **Challenge 1: Server-Side Search, Filter & Sort on `/services`:**
   - Real-time MongoDB search on title, category, description, and location.
   - Category pills & Service Mode filters that persist across page reloads.
   - Server-side sorting (`newest`, `price-asc`, `price-desc`) and pagination controls.
3. **Role-Restricted Repair Booking Flow:**
   - Non-logged-in users are redirected to login and returned to the requested service.
   - Technicians and Admins are protected from creating bookings.
   - Customers submit date (validated >= today) and description (>= 20 characters).
   - Server prevents duplicate active requests for the same service.
4. **Dashboards by Stakeholder Role:**
   - **Customer:** Overview metrics, My Bookings with cancellation modal (while requested), Pay Now button (Stripe), Job Timeline Tracker, Rate & Review modal, and printable PDF Invoice.
   - **Technician:** Overview metrics, Add Service with ImgBB file upload, My Services full CRUD (editing safely reverts approval to pending), and pipeline management (Accept, Reject, Start Work, Complete with final amount modal).
   - **Admin:** System analytics, Manage Users (modify roles, protected against self-modification), Service Approvals, Bookings Monitor, and Stripe Transaction ledger with total revenue metrics.
   - **Shared Profile:** Update name, phone, area, bio, and ImgBB avatar with instant global header synchronization.
5. **Robust Session Resilience:**
   - Reloading any page maintains authentication state without redirects or flashes.
   - Dark & Light mode toggle with persistent local theme storage.
   - Toast feedback for every user interaction (Sonner).

---

## 📦 NPM Packages Used
- `next` (^15.1.7) - React Framework with App Router & Server Components
- `react` & `react-dom` (^19.0.0) - Core React runtime
- `tailwindcss` (^3.4.17) - Utility-first styling with custom dark mode
- `lucide-react` (^0.475.0) - Consistent modern icon library
- `sonner` (^2.0.1) - Toast notification system
- `canvas-confetti` (^1.9.4) - Visual celebration animations on Stripe payment confirmation
- `clsx` & `tailwind-merge` - Dynamic class composition
- `date-fns` (^4.1.0) - Date formatting utilities

---

## ⚙️ Environment Configuration (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 🛠️ Getting Started
```bash
# 1. Install dependencies
npm install

# 2. Run Next.js development server
npm run dev
# Server will start on http://localhost:3000
```
