/** Content for /company and /contact, ported from the hand-written site that used to serve
 *  deepgrid-dr-silicon_new (company.html, contact.html at 8dc6e8c).
 *
 *  Three claims from that site are deliberately NOT carried over, because this site's
 *  verification already rejected them. They are listed with their reasons on /evidence, and
 *  re-stating them here would quietly undo that:
 *    - "MCEME / Indian Army — Defence Anchor, ₹1.01 Cr (Chip 4)"  (see claims.ts `withheld`)
 *    - "FY27: ₹4 Cr (₹2.88 Cr live contracted)" — the contracted half contains the ₹1.01 Cr above,
 *      so the FY27 figure is carried as a plan target only, without the contracted sub-claim.
 *    - Two films, "The 198-Day Silicon Loop" (12 min) and "Deterministic Control in 6 µs" (10 min).
 *      Neither exists. The five films this site actually ships are on /resources.
 *  One figure is corrected rather than dropped: the use-case playbook is 12 pages, not 14.
 */

export const companyStats: [string, string][] = [
  ['Hyderabad', 'DESIGN CENTRE'],
  ['198 days', 'SHUTTLE-TO-SHUTTLE LOOP'],
  ['130 nm', 'FIRST-SILICON NODE'],
  ['Sep 2026', 'FIRST SILICON (CI2609)'],
  ['2', 'FOUNDRIES AT FIRST SPIN'],
  ['RV32IM', 'INSTRUCTION SET'],
];

export const pillars = [
  {
    name: 'Sovereign silicon',
    what: 'Dual-foundry from the first spin: SkyWater in the USA and SCL Mohali in India, with IHP in Germany between them.',
    why: 'A single foundry is a single point of political failure for a defence supplier. Two qualified paths mean a slip in one does not stop the roadmap, and DAP-2020 Buy (Indian-IDDM) compliance needs a domestic path that exists rather than one that is promised.',
  },
  {
    name: 'Deterministic control',
    what: 'One current-control loop costs about 300 hardware cycles, and costs the same at every loop rate. CORDIC runs a Clarke/Park transform in 53–58 cycles.',
    why: 'Firmware that has to meet a deadline is firmware you have to re-time on every change. Moving sampling, the transforms and PWM edges into hardware makes the loop cost a constant, so the CPU keeps only the PI regulators and the remaining headroom is available for diagnostics.',
  },
  {
    name: 'Hardware lockstep safety',
    what: 'Two RV32IM cores run identical inputs two cycles apart. Every committed store is compared, the first mismatch latches its cause, and FAULT_N drives the gate-driver enable directly.',
    why: 'Motor control drives power electronics, where a silent CPU fault destroys a bridge. Putting the comparator and the trip in hardware takes firmware out of the path entirely — in simulation an injected fault reaches the bridge in 39 cycles.',
  },
];

export const milestones: [string, string, string, string][] = [
  ['NOW', 'DG32-LITE first silicon', 'On the September 2026 multi-project shuttle (CI2609).', 'Bring-up measures what simulation and static timing predicted: loop cost, fault latency, fmax and power.'],
  ['NEXT', 'Second spin', 'A 12-bit multi-channel ADC and embedded flash.', 'Closes the two largest gaps against the incumbent entry-level motor-control MCU.'],
  ['THEN', 'Connectivity and debug', 'CAN-FD, and interactive CPU debug over JTAG.', 'The vehicle bus a traction or steering drive expects, and the debug path a production team needs.'],
  ['PARALLEL', 'DG32-2DOM', 'The two-clock-domain variant with the INT8 attention engine: design complete, in physical trials.', 'Bring-up will measure the engine’s cycles per query row against the analytic 3,242.'],
];

export const team = [
  {
    name: 'Founding team',
    what: 'Silicon veterans with multiple tapeouts across 130 nm to 28 nm.',
    why: 'A team that has taped out together before. The failure mode on a shuttle with no respin is not a missing feature, it is a mistake nobody on the team has made before.',
  },
  {
    name: 'RTL, verification and physical design',
    what: 'In-house RTL, formal verification, automated place-and-route on OpenROAD, analog and mixed-signal layout, DFT and silicon bring-up.',
    why: 'An open-source flow removes per-seat EDA licensing from the cost of a spin, which is what makes a 198-day loop affordable at defence volumes.',
  },
  {
    name: 'FOC, safety, diagnostics and SDK',
    what: 'Bare-metal HAL, FreeRTOS, a CORDIC library, the FOC framework, a 30-use-case model zoo, the INT8 attention driver and the Ask DeepGrid console.',
    why: 'Silicon that ships without the control software is an evaluation board, not a product.',
  },
];

/** Company plan figures. These are targets and internal economics, not measurements and not
 *  audited results — the page says so where it shows them. */
export const unitEconomics: [string, string][] = [
  ['NRE per chip', '₹0.6–1.2 Cr, against $2–5M for a conventional flow'],
  ['Gross margin at 10k units', '60–75% defence, 30–45% commercial'],
  ['EDA licensing', '₹0 — Yosys, OpenROAD and TritonCTS'],
  ['CPU royalties', '₹0 — DGridRiscV is RISC-V, so there is no ARM licence'],
  ['Shuttle cost', '₹14.3L for 100 parts, against $500K–$1M for dedicated masks'],
];

export const revenueBuild: [string, string][] = [
  ['Addressable market', 'India imports ~$23.4B of ICs a year; ~$9B of that is mature node (≥130 nm), of which ~₹4,000 Cr is addressable'],
  ['FY27', '₹4 Cr'],
  ['FY28', '₹28 Cr'],
  ['FY29', '₹140 Cr'],
  ['FY30', '₹410 Cr'],
  ['FY31', '₹1,000 Cr'],
  ['Blended gross margin at scale', '~48%'],
  ['Concentration', 'Smart meter (₹480 Cr) and motor (₹220 Cr) are ~70% of the FY31 plan'],
];

export const moats = [
  {name: 'DAP-2020 Buy (Indian-IDDM)', what: 'Defence tenders that require an Indian designer and manufacturer.', why: 'An importer cannot bid at all, so the competition is domestic or absent.'},
  {name: 'PIL 1–5 import bans', what: '346+ line items carrying hard import-ban deadlines.', why: 'Demand with a date on it, rather than demand that has to be created.'},
  {name: 'SRIJAN', what: '37,000+ imported line-replaceable units listed as seeking a domestic source.', why: 'A published list of parts someone is already obliged to replace.'},
  {name: 'Three-factory sovereignty', what: 'SkyWater, then IHP, then SCL Mohali.', why: 'Each qualification makes the next SKU cheaper, and no single government can stop the roadmap.'},
  {name: 'Compounding IP', what: 'Silicon-validated blocks reused across the SKU roadmap.', why: 'The second chip on a node costs a fraction of the first, which is the whole economic argument for mature nodes.'},
];

export const stopRules: [string, string][] = [
  ['S1 — anchor LOI gate', 'No signature by the shuttle cutoff pauses that chip rather than spending a mask set on it.'],
  ['S2 — MIL-STD-883 fail-safe', 'A screening failure on the defence pathfinder is a 12-month delay, and is planned for as one.'],
  ['S3 — commodity price check', 'An FY29 review against Chinese mature-node pricing, with a defined exit rather than a hope.'],
  ['S4 — SCL Mohali slip', 'A two-cycle delay triggers public disclosure and a pivot to SkyWater or IHP.'],
];

export const fundsAllocation: [string, string, string][] = [
  ['Factory runs and mask sets', '₹3.60 Cr', '36% — six SkyWater shuttles, one IHP, two production mask sets'],
  ['Engineering staff', '₹2.40 Cr', '24% — five to seven engineers over 24 months'],
  ['Qualification and screening', '₹1.80 Cr', '18% — four pathfinder chips'],
  ['ATE test engineering', '₹1.20 Cr', '12% — test vectors and load boards'],
  ['GTM and working capital', '₹1.00 Cr', '10% — evaluation kits and reference designs'],
];

export const companyNotClaimed = [
  'No revenue figure on this page is audited, and none of it is contracted revenue. FY27 onward are plan targets.',
  'Market sizes are third-party import statistics applied to our own segment definition, not a commissioned study.',
  'Customer names are not listed on this site. One contract figure that previously appeared here was withdrawn after verification; the reason is on the Evidence page.',
  'Team composition is described by function. Individual names and histories are shared under NDA, not published.',
];

export const enquiryRoles = ['Engineer / technical lead', 'Procurement / supply chain', 'Engineering management', 'Investor / analyst', 'Other'];
export const motorTypes = ['BLDC / PMSM', 'Induction / ACIM', 'Stepper', 'Switched reluctance', 'Other'];
export const voltages = ['12–48 V', '48–300 V', '300–800 V', '800 V and above'];
export const powers = ['1–10 kW', '10–100 kW', 'Over 100 kW'];
export const volumes = ['Prototyping (1–10)', '10–100 units', '100–1,000 units', '1,000–10,000 units', 'Over 10,000 units'];
export const timelines = ['Immediate (0–3 months)', 'Near term (3–6 months)', 'Medium term (6–12 months)', 'Long term (12+ months)', 'Just exploring'];

export const CONTACT_EMAIL = 'contact@deepgrid.in';
