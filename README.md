# DG32 silicon site

**Live: https://shekerkamma.github.io/deepgrid-dr-silicon-v2/**

The public site for DeepGrid Semi's DG32 motor-control silicon: DG32-LITE, a dual-core lockstep
RISC-V SoC, and DG32-2DOM, the same chip plus an INT8 attention engine. Pre-silicon: every figure
is a design value carrying the kind of evidence that produced it, not a measurement on fabricated
parts.

This is the multi-page rebuild. The earlier site (`deepgrid-dr-silicon`) was one hash-routed
document serving eight views from a single `index.html`; nothing could be linked, crawled or
cached per page. This repo is 12 routes that each export their own HTML, on the same React 19
stack and the same design system.

## Routes

| Route | Register | What it carries |
|---|---|---|
| `/` | live surface | The control loop running, and its cycle budget spent by scrolling |
| `/products` | showcase | DG32-LITE against DG32-2DOM, one footprint |
| `/technology` | reference | Block-by-block architecture, per chip |
| `/technology/safety` | reference | Lockstep, and the 39-cycle path from a wrong value to a safe bridge |
| `/technology/control-loop` | reference | Loop timing and the cycle budget at four rates |
| `/technology/die` | showcase | The interactive die, six functional block groups |
| `/technology/package` | reference | QFN-64 pinout, supplies, electrical limits |
| `/applications` | showcase | Four domains, their tasks and latency envelopes |
| `/evidence` | reference | Five kinds of evidence, and what the site does not claim |
| `/procurement` | reference | Position against the STM32G0, scorecard, roadmap |
| `/resources` | reference | 45 documents, 43 downloads, five narrated films |
| `/ask` | reference | Ask DeepGrid, grounded in the whitepaper, running in the browser |

Two registers on purpose. Showcase routes carry motion and depth; reference routes stay dense,
static, printable and deep-linkable. An engineer hunting a supply limit should not have to scroll
through a 3D world to reach a table. `PLAN.md` carries the reasoning.

## Commands

```bash
npm ci
npm run dev                  # vinext dev

npm run typecheck
npm run build:pages          # static export + packaging, fails if a declared route did not export

npm run verify                   # serve dist/pages at the real base path, then gate it
npm run verify:url -- https://shekerkamma.github.io/deepgrid-dr-silicon-v2/   # gate the live site
```

`PAGES_BASE` and `NEXT_PUBLIC_PAGES_BASE` must agree. The first tells the packager where to
rewrite asset paths; the second is baked into the bundle so server-rendered HTML already carries
correct hrefs. For a custom domain set both to `/` and set `PAGES_DOMAIN`.

## Deploying

Push to `main`. `.github/workflows/pages.yml` runs typecheck, builds, gates the build in a
browser, deploys through `actions/deploy-pages`, then re-runs the same gate against the live URL
once Pages serves that commit. A red gate stops the deploy.

Pages is configured as `build_type: workflow` from `main`. The `github-pages` environment must
list `main` in its deployment branch policy or the deploy job fails before running a step.

## Gates, and why each exists

Every check here was added after something shipped wrong, not in anticipation.

- **Route export.** `scripts/package-pages.mjs` fails when a route declared in `app/routes.ts`
  produced no HTML. `vinext` reports an unprerendered route as "skipped" and still exits 0, so a
  build went green having silently dropped `/applications` and `/evidence`.
- **Base declaration.** Every exported page must carry `<meta name="site-base">` matching the
  build's base. A page that lost it renders every nav link pointing at the domain root, which
  looks like a working build and 404s on click.
- **Route gate.** `scripts/verify-routes.mjs` opens all 12 routes at desktop, phone, and phone
  with reduced motion forced, checking status, base, links escaping the base, broken images,
  horizontal overflow, entrance animations that never finish, WCAG 2.5.8 tap targets, and console
  errors. 36 checks.
- **Threaded server.** `scripts/serve-dist.py` exists because `python3 -m http.server` is
  single-threaded: once the home route began importing the scroll engine, one chunk request sat
  pending forever and `networkidle` never fired, failing a page curl served in 2 ms.

Two rules for reading a red gate, both learned the hard way. An animation sampled at a fixed
moment measures the animation, not the outcome: the same unchanged page reported 7 blocks hidden
at 250 ms and 0 at 800 ms. And a gate that goes green because the thing it measured moved is
worse than no gate. When a check flips, find out what moved.

## Claim hygiene

The site's argument is that its numbers are checkable, so the numbers have to be.

- No figure without the kind of evidence behind it. `/evidence` carries all five kinds and the
  explicit list of what the site does not claim.
- `PRE_SILICON` is one shared constant, not a sentence retyped per page.
- Counters show real numbers only. The home route's budget readout derives every figure live from
  `CLOCK_HZ` and `HW_FIXED_CYCLES` so a reader can redo the arithmetic on screen.
- `CPU budget` (cycles available to firmware in a period) and `CPU headroom` (what is left after
  the regulators run) are different quantities. Do not relabel one as the other.
- No visible em dashes in site copy.

## Layout

```
app/routes.ts          the URL map; nav, breadcrumbs, the pager and cross-links all read from it
app/shell.tsx          shared chrome, base-aware links, query state
app/home-surface.tsx   the live-surface home route
app/scrollcraft/       vendored scroll engine, do not edit; see its README
app/motion.tsx         the reveal/scroll system for the other 11 routes
scripts/               build packaging, route gate, threaded dev server
PLAN.md                the rebuild's reasoning and remaining phases
docs/home-brief.md     the home route's brief: grammar, signature move, feeling curve
```

Two scroll systems coexist because they never run on the same document.
