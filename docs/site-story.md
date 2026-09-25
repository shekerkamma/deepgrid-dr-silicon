# Site story pack (story-architect, 2026-09-25)

User: "/story-architect, use this skill for every section if needed". Applied to all 14 routes of
deepgrid-dr-silicon-v2 from their rendered heading outlines. Self-answered on the user's standing
instruction. /applications and /evidence already have their own packs (`docs/applications-story.md`,
`docs/evidence-story.md`); this file covers the site as a whole and the three sections that needed one.

## 1. BLUF

DG32-LITE puts a lockstep safety pair, hardware FOC and DShot in one 130 nm, 64-pin chip, on the
September 2026 shuttle; every figure on the site traces to a named source document, and the rest of the
portfolio is plans and FPGA-validated logic, labelled as such.

## 2. Audience decision

An engineer or buyer should decide whether DG32-LITE (or DG32-2DOM) belongs on their next drive board
evaluation, and know exactly which claims are simulated, which are planned and which are not made.

## 3. Tension

Motor-drive safety today needs a second MCU or a lockstep part priced for automotive. If the claim holds
on silicon, one mature-node chip does it; if a reader cannot tell measured from simulated, the site loses
them at the first unsourced number.

## 4. Argument arc (the site as a whole)

1. Overview: what DG32 is, and the one claim (lockstep safety on one chip).
2. Technology, safety, control loop: how the claim works (39-cycle fault path, ~300-cycle loop).
3. Die, package: that it is physically real (130 nm, QFN-64).
4. Products: which chip to choose.
5. Applications, evidence: where the portfolio goes and what each part rests on today.
6. Procurement, company: whether it is a sound bet to buy from or back.
7. Resources, ask: check any of it against the documents.
8. Contact: the one action.

## 5. Per-section verdicts

| Route | Verdict | Why |
|---|---|---|
| Overview | Holds | Opens on the claim, ends on the routes into the site |
| Technology, safety, control, die, package | Hold | Headings are already assertions; each proof beat carries its source |
| Applications, evidence | Hold | Own packs, implemented earlier |
| Procurement, company | Hold | Leads/gaps and stop rules argue; the unsourced scorecard is already gone |
| Contact | Holds | One action, no customer list |
| **Products** | **Rebuilt** | Chip headings were labels; the page ended on portfolio context, not the choice |
| **Resources** | **Rebuilt** | No answer in the heading; "client-ready PowerPoint decks" is internal language; H2 was a question |
| **Ask** | **Rebuilt** | "Verified Silicon Intelligence" overclaims (the review found wrong citation sections); the lead promised "authoritative" and "sovereign supply chain security" |

## 6. Section spines for the rebuilt three

**Products** (answer, then parts, then difference, then context, then the choice):

| Beat | Heading (assertion) | Role |
|---|---|---|
| Head | One footprint, two chips | Answer: a board for one takes the other |
| Card 1 | Lockstep safety in one chip, on the September 2026 shuttle | DG32-LITE, the first-silicon part |
| Card 2 | The same chip and footprint, with an engine that watches the motor | DG32-2DOM |
| Compare | Everything outside the engine is identical | Proof of the drop-in claim |
| Context | Mature-node silicon, around the sub-10 nm core | Why 130 nm is a choice; links each chip to its card |
| Close | Start on DG32-LITE; move to DG32-2DOM when the drive should watch its own motor | The decision and its actions |

**Resources**: H1 "The documents, decks and films behind every figure"; lead names the six documents
and what form each takes; H2 "Every figure on this site traces to one of these six documents".

**Ask**: H1 "Ask about DG32, and every answer names its source"; lead lists what can be asked and says
the reader can check each answer against its PDF. "SOURCES CITED" badge stays (set in the review).

## 7. Evidence map

- Direct: every spec in the Products cards (content.ts, from the architecture guides and datasheet).
- Fair synthesis: "a board built for one takes the other" (identical pinout in the datasheet).
- Interpretation, kept soft: "watches the motor" rests on the 2DOM guide; the accelerometer conflict
  (REVIEW-TASKS.md) is still the owner's, so no card says accelerometers are unnecessary.

## 8. Content cuts

- "Authoritative", "design authority", "Verified", "sovereign supply chain security" from headings and
  leads: they assert trust instead of showing the source, and the review showed some citations are wrong.
- "Client-ready": production language.

## 9. Rebuild instructions (implemented)

- `app/products/page.tsx`: "Where DG32 sits" moved before "Which chip"; card h2 from `partClaims`,
  name moved into the label; close heading rewritten.
- `app/resources/page.tsx`, `app/documents-hub.tsx`: H1, lead, H2, kicker, aria-label.
- `app/ask.tsx`: H1, lead, tooltip, link label. `app/documents-data.ts`: "Authoritative" dropped from two
  summaries.

Not changed: Ask's default answer stays the supply-chain theme (now corrected); moving the default to
lockstep would change the semantic routing eval baseline for no factual gain.
