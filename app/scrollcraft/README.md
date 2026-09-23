# Vendored scroll-craft engine

`scrollcraft.engine.js` and `scrollcraft.css` are copied verbatim from
`nateherk-design/scroll-craft@0.2.0/engine/`. **Do not edit them.** The skill's rule is that
bespoke behaviour lives in the page, driven off the `--sc-p` custom property the engine
publishes on each act element, never in the engine itself. Editing here forks us off upstream
and loses its fixes.

Scope: the home route only. The other 11 routes are driven by `app/motion.tsx`, which is
untouched. Two scroll systems coexist because they never run on the same document.

Upgrading: re-copy both files from the skill and re-run `scripts/verify-routes.mjs`.
