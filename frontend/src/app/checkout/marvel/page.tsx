import { redirect } from 'next/navigation';
import { mvCheckoutPath } from '@/lib/checkout-path';

type Props = { searchParams: { ticket?: string; guests?: string; date?: string } };

/** Короткий URL → отдельная страница бронирования Marvel */
export default function MarvelCheckoutShortcut({ searchParams }: Props) {
  redirect(
    mvCheckoutPath({
      ticket: searchParams.ticket,
      guests: searchParams.guests ? Number(searchParams.guests) : undefined,
      date: searchParams.date,
    }),
  );
}
