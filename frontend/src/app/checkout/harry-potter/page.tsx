import { redirect } from 'next/navigation';
import { hpCheckoutPath } from '@/lib/checkout-path';

type Props = { searchParams: { ticket?: string; guests?: string; date?: string } };

export default function HarryPotterCheckoutShortcut({ searchParams }: Props) {
  redirect(
    hpCheckoutPath({
      ticket: searchParams.ticket,
      guests: searchParams.guests ? Number(searchParams.guests) : undefined,
      date: searchParams.date,
    }),
  );
}
