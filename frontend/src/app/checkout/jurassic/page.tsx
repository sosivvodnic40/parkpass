import { redirect } from 'next/navigation';
import { jpCheckoutPath } from '@/lib/checkout-path';

type Props = { searchParams: { ticket?: string; guests?: string; date?: string } };

export default function JurassicCheckoutShortcut({ searchParams }: Props) {
  redirect(
    jpCheckoutPath({
      ticket: searchParams.ticket,
      guests: searchParams.guests ? Number(searchParams.guests) : undefined,
      date: searchParams.date,
    }),
  );
}
