import type { ApiBooking } from '../types';

/** Общее хранилище броней для mock-режима (admin + bookings) */
export const mockBookingRegistry: (ApiBooking & { userId: string })[] = [
  {
    userId: 'u-demo',
    id: 'b-demo',
    parkSlug: 'star-wars-galaxys-edge',
    parkName: "Star Wars: Galaxy's Edge",
    ticketName: 'Standard',
    visitDate: '2026-06-15',
    guests: 2,
    totalAmount: 278,
    status: 'paid',
    qrCode: 'PP-DEMO-SWGE',
    createdAt: '2026-05-01T10:00:00Z',
  },
];

export function addMockBooking(booking: ApiBooking & { userId: string }) {
  mockBookingRegistry.unshift(booking);
}
