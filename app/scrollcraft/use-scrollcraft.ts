'use client';

import {useEffect} from 'react';

declare global {
  interface Window {
    ScrollCraft?: {mount: (root?: Element | Document | string, opts?: unknown) => unknown; instances: unknown[]};
  }
}

/** Mounts the vendored engine over a route's markup after React has committed it.
 *  The engine is an IIFE that publishes window.ScrollCraft and mounts explicitly, so it
 *  suits a React route: import for the side effect, mount in an effect, once. It reads
 *  data-sc-* off real markup and never generates DOM, which is why the page stays
 *  hand-written JSX. */
export function useScrollCraft(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    let cancelled = false;
    import('./scrollcraft.engine.js').then(() => {
      if (cancelled || !ref.current || !window.ScrollCraft) return;
      window.ScrollCraft.mount(ref.current);
    });
    return () => { cancelled = true; };
  }, [ref]);
}
