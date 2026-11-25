# FixMate Client

On-demand repair platform for smart devices and home appliances (Next.js frontend).

## Purpose
Lets customers find repair services, book a technician, track the job and pay after completion. Technicians manage services and jobs, and admins moderate the platform.

## Live URL
https://fixmate-repair.vercel.app/

## Test Credentials (for Examiner Quick Testing)
- **Admin:** `admin@fixmate.com` / `Admin@123`
- **Technician:** `tech.rahim@fixmate.com` / `Tech@123` (8 approved services, active & completed requests)
- **Customer:** `customer.arman@fixmate.com` / `Customer@123` (active requests & completed bookings with Pay Now)

## Key Features
- Homepage with search, latest services and how-it-works section
- Server-side search, filter, sort and pagination on `/services`
- Role-based dashboards for customer, technician and admin
- Repair booking with validation and duplicate-request protection
- Job tracking timeline, Stripe payment, reviews and printable invoice
- Technician service CRUD with image upload
- Admin controls for users, service approvals, bookings and payments
- Dark/light mode and toast notifications

## NPM Packages Used
- `next`, `react`, `react-dom` - framework and UI
- `tailwindcss` - styling
- `lucide-react` - icons
- `sonner` - toast notifications
- `canvas-confetti` - payment success effect
- `clsx`, `tailwind-merge` - class name handling
- `date-fns` - date formatting
