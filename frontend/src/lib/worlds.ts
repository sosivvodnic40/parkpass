export const worldHubByCategory: Record<string, { href: string; label: string }> = {
  'star-wars': { href: '/worlds/star-wars', label: "Galaxy's Edge" },
  'harry-potter': { href: '/worlds/harry-potter', label: 'The Wizarding World' },
  marvel: { href: '/worlds/marvel', label: 'Avengers Campus' },
  jurassic: { href: '/worlds/jurassic', label: 'Jurassic World' },
};

/** Единая тематическая страница вместо /parks/[slug] */
export function getParkPageHref(park: { slug: string; category: string }): string {
  const hub = worldHubByCategory[park.category];
  if (
    hub &&
    (park.category === 'star-wars' ||
      park.category === 'harry-potter' ||
      park.category === 'marvel' ||
      park.category === 'jurassic')
  ) {
    return hub.href;
  }
  return `/parks/${park.slug}`;
}
