export type UserRole = 'user' | 'park_manager' | 'admin';

export interface ApiPark {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  country: string;
  region: string;
  ratingAvg: number;
  reviewCount: number;
  priceFrom: number;
  coverImage: string;
  category: string;
  brand: string;
  badge: string | null;
  isFeatured: boolean;
  zones: number;
  theme: { primaryColor: string; secondaryColor: string };
  openingHours: Record<string, string>;
}

export interface ApiAttraction {
  id: string;
  name: string;
  category: string;
  avgWaitMin: number;
  imageUrl: string;
}

export interface ApiTicket {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  clubTier: string;
  loyaltyPoints: number;
}

export interface ApiBooking {
  id: string;
  parkSlug: string;
  parkName: string;
  ticketName: string;
  visitDate: string;
  guests: number;
  totalAmount: number;
  status: string;
  qrCode: string;
  createdAt: string;
}

export interface ApiReview {
  id: string;
  parkSlug: string;
  userName: string;
  rating: number;
  title: string | null;
  body: string | null;
  visitDate: string | null;
  isVerified: boolean;
  createdAt: string;
}

export interface ApiAdminReview extends ApiReview {
  isApproved: boolean;
  parkName: string;
}

export interface ApiSchedule {
  parkSlug: string;
  parkName: string;
  timezone: string;
  openingHours: Record<string, string>;
  weeklySchedule: { day: string; dayKey: string; hours: string; isOpen: boolean }[];
}

export interface ApiAvailability {
  parkSlug: string;
  visitDate: string;
  guests: number;
  isAvailable: boolean;
  remainingSlots: number;
  message: string;
}

export interface ApiAdminStats {
  usersTotal: number;
  parksTotal: number;
  bookingsTotal: number;
  revenueTotal: number;
  bookingsByStatus: Record<string, number>;
  bookingsByPark: { parkSlug: string; parkName: string; count: number; revenue: number }[];
  recentBookings: ApiBooking[];
}
