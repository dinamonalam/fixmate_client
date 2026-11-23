export type UserRole = 'customer' | 'technician' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  phone?: string;
  area?: string;
  bio?: string;
  createdAt?: string;
}

export type ServiceCategory =
  | 'Smartphone'
  | 'Laptop & PC'
  | 'AC'
  | 'Refrigerator'
  | 'TV'
  | 'Washing Machine'
  | 'Electrical';

export type ServiceMode = 'Home Visit' | 'Shop Drop-off';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Service {
  _id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: ApprovalStatus;
  isAvailable: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type BookingStatus =
  | 'requested'
  | 'accepted'
  | 'rejected'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'unpaid' | 'paid';

export interface StatusHistoryEntry {
  status: BookingStatus | 'paid';
  changedAt: string;
  note?: string;
}

export interface Booking {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: BookingStatus;
  finalAmount: number;
  paymentStatus: PaymentStatus;
  paidAt?: string;
  rating?: number;
  review?: string;
  reviewedAt?: string;
  statusHistory?: StatusHistoryEntry[];
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentRecord {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: string;
  paidAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalTechnicians: number;
  totalCustomers: number;
  pendingServices: number;
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
}
