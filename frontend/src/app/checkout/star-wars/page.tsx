import { redirect } from 'next/navigation';
import { checkoutPath } from '@/lib/checkout-path';
import { SW_PARK_SLUG } from '@/lib/star-wars-images';

type Props = { searchParams: { ticket?: string; guests?: string; date?: string } };

export default function StarWarsCheckoutShortcut({ searchParams }: Props) {
  redirect(
    checkoutPath(SW_PARK_SLUG, {
      ticket: searchParams.ticket,
      guests: searchParams.guests ? Number(searchParams.guests) : undefined,
      date: searchParams.date,
    }),
  );
}
