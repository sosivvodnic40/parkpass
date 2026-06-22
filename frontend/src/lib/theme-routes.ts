export function isStarWarsRoute(pathname: string) {
  return (
    pathname.startsWith('/worlds/star-wars') ||
    pathname.startsWith('/checkout/star-wars-galaxys-edge')
  );
}

export function isHarryPotterRoute(pathname: string) {
  return (
    pathname.startsWith('/worlds/harry-potter') ||
    pathname === '/checkout/harry-potter' ||
    pathname.startsWith('/checkout/harry-potter')
  );
}

export function isMarvelRoute(pathname: string) {
  return (
    pathname.startsWith('/worlds/marvel') ||
    pathname === '/checkout/marvel' ||
    pathname.startsWith('/checkout/marvel-')
  );
}

export function isJurassicRoute(pathname: string) {
  return (
    pathname.startsWith('/worlds/jurassic') ||
    pathname === '/checkout/jurassic' ||
    pathname.startsWith('/checkout/jurassic-')
  );
}

export function isThemedUniverseRoute(pathname: string) {
  return (
    isStarWarsRoute(pathname) ||
    isHarryPotterRoute(pathname) ||
    isMarvelRoute(pathname) ||
    isJurassicRoute(pathname)
  );
}
