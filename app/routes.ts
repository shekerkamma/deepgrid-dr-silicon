// The site's URL map. One place, because nav, breadcrumbs, the pager and every
// cross-link read from it — a route that exists in only one of those is the
// defect this file exists to prevent.
/** The path the site is served under. Baked in at build time so server-rendered HTML
 *  already carries correct hrefs — resolving it at runtime meant every link pointed at
 *  the domain root until hydration, which 404s for a crawler and for a reader on a slow
 *  connection. CI sets this alongside PAGES_BASE. */
export const BASE = (process.env.NEXT_PUBLIC_PAGES_BASE || '/').replace(/\/?$/, '/');

/** Base-aware href for a root-absolute site path. */
export function url(path: string): string {
  return path === '/' ? BASE : BASE.replace(/\/$/, '') + path;
}

export type RouteId =
  | 'home' | 'products' | 'technology' | 'safety' | 'control' | 'die'
  | 'package' | 'applications' | 'evidence' | 'resources' | 'procurement' | 'ask';

export type Route = {id: RouteId; href: string; label: string; nav?: boolean; parent?: RouteId; tag?: string};

export const routes: Route[] = [
  {id: 'home',         href: '/',                        label: 'Home'},
  {id: 'products',     href: '/products',                label: 'Products',     nav: true, tag: '01 / PRODUCT FAMILY'},
  {id: 'technology',   href: '/technology',              label: 'Technology',   nav: true, tag: '02 / ARCHITECTURE'},
  {id: 'safety',       href: '/technology/safety',       label: 'Safety',       parent: 'technology', tag: '02.1 / SAFETY'},
  {id: 'control',      href: '/technology/control-loop', label: 'Control loop', parent: 'technology', tag: '02.2 / CONTROL LOOP'},
  {id: 'die',          href: '/technology/die',          label: 'The die',      parent: 'technology', tag: '02.3 / DIE EXPLORER'},
  {id: 'package',      href: '/technology/package',      label: 'Pinout & package', parent: 'technology', tag: '02.4 / PINOUT & PACKAGE'},
  {id: 'applications', href: '/applications',            label: 'Applications', nav: true, tag: '03 / APPLICATIONS'},
  {id: 'evidence',     href: '/evidence',                label: 'Evidence',     nav: true, tag: '04 / EVIDENCE'},
  {id: 'procurement',  href: '/procurement',             label: 'Procurement',  nav: true, tag: '05 / PROCUREMENT'},
  {id: 'resources',    href: '/resources',               label: 'Resources',    nav: true, tag: '06 / DOCUMENTS & MEDIA'},
  {id: 'ask',          href: '/ask',                     label: 'Ask DeepGrid', nav: true, tag: '07 / SILICON INTELLIGENCE'},
];

export const byId = Object.fromEntries(routes.map(r => [r.id, r])) as Record<RouteId, Route>;
export const navRoutes = routes.filter(r => r.nav);
export const orderedRoutes = routes.filter(r => r.id !== 'home');

export function nextRoute(id: RouteId): Route | undefined {
  const i = orderedRoutes.findIndex(r => r.id === id);
  return i >= 0 ? orderedRoutes[i + 1] : undefined;
}

export function prevRoute(id: RouteId): Route | undefined {
  const i = orderedRoutes.findIndex(r => r.id === id);
  return i > 0 ? orderedRoutes[i - 1] : undefined;
}

/** Navigation targets, accepted under two vocabularies: the current route ids, and the
 *  hash-router's old view ids that ported page bodies still pass. Built from `routes` so a
 *  new route is addressable the moment it is declared — a hand-kept second list is how
 *  href('products') came to throw while the map only knew it as 'family'. */
export const legacyView: Record<string, string> = {
  ...Object.fromEntries(routes.map(r => [r.id, r.href])),
  overview: '/',
  family: '/products',
  architecture: '/technology',
  pinout: '/technology/package',
  roadmap: '/procurement',
  library: '/resources',
};

/** Resolve a legacy target such as "library?pkg=lite" or "architecture?block=0". */
export function resolveTarget(target: string): string {
  const [view, query] = target.replace(/^#/, '').split('?');
  const path = legacyView[view];
  if (!path) throw new Error('Unknown navigation target: ' + target);
  return url(path) + (query ? '?' + query : '');
}
