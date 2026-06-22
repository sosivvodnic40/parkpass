import type { CatalogPark, CatalogTicket } from './catalog';

const parkPatches = new Map<string, Partial<CatalogPark>>();
const ticketPatches = new Map<string, Partial<CatalogTicket>>();

function ticketKey(parkSlug: string, ticketCode: string) {
  return `${parkSlug}:${ticketCode}`;
}

export function applyParkOverride(park: CatalogPark): CatalogPark {
  const patch = parkPatches.get(park.slug);
  return patch ? { ...park, ...patch } : park;
}

export function applyTicketOverride(
  parkSlug: string,
  ticket: CatalogTicket,
): CatalogTicket {
  const patch = ticketPatches.get(ticketKey(parkSlug, ticket.code));
  return patch ? { ...ticket, ...patch } : ticket;
}

export function patchCatalogPark(slug: string, patch: Partial<CatalogPark>) {
  parkPatches.set(slug, { ...parkPatches.get(slug), ...patch });
}

export function patchCatalogTicket(
  parkSlug: string,
  ticketCode: string,
  patch: Partial<CatalogTicket>,
) {
  const key = ticketKey(parkSlug, ticketCode);
  ticketPatches.set(key, { ...ticketPatches.get(key), ...patch });
}

export function listCatalogOverrides() {
  return {
    parks: Object.fromEntries(parkPatches),
    tickets: Object.fromEntries(ticketPatches),
  };
}
