'use client';

import {ArrowUpRight, ArrowRight, Check, Download} from 'lucide-react';
import Silicon from './silicon';
import FaultTrace from './fault-trace';
import {Eyebrow} from './detail';
import {evidenceLadder, faultPath, notClaimed, useCaseDomains as domains} from './detail-content';
import {headline} from './content';

// Evidence cards reuse the verification-ladder styling from the original overview,
// which colours each card through --evidence-color and tints its badge and icon.
const evidenceColors: Record<string, string> = {
  Simulated: '#bf7f3b',
  'Post-route': '#2f9e8c',
  Analytic: '#8f9d6b',
  'Tool estimate': '#7486ab',
  'Process nominal': '#bf7f3b',
};
const evidenceImages: Record<string, string> = {
  Simulated: './media/sims_image.png',
  'Post-route': './media/sims_image2.png',
  Analytic: './media/sims_image3.png',
  'Tool estimate': './media/sims_image4.png',
  'Process nominal': './media/sims_image4.png',
};
const evidenceBadges: Record<string, string> = {
  Simulated: 'SIMULATION',
  'Post-route': 'POST-ROUTE',
  Analytic: 'ANALYTIC',
  'Tool estimate': 'TOOL EST.',
  'Process nominal': 'PROCESS',
};
const evidenceIcons: Record<string, React.ReactNode> = {
  Simulated: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="2"/><path d="M8 12h8M12 8v8"/><circle cx="12" cy="12" r="1" fill="currentColor"/>
    </svg>
  ),
  'Post-route': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h16M12 4v16"/><path d="M8 8l4 4 4-4M8 16l4-4 4 4"/>
    </svg>
  ),
  Analytic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l4-4 4 4M3 15l4-4 4 4M3 21l4-4 4 4"/>
    </svg>
  ),
};

// One representative task per domain, taken verbatim from useCaseDomains.
// The full task inventory belongs on the domain's own material, not the overview.
const domainImages: Record<string, string> = {
  rotating: './media/deepgrid_truck.jpg',
  electrical: './media/deepgrid_robotics.jpg',
  motion: './media/deepgrid_logistics.jpg',
  degradation: './media/deepgrid_defence.jpg',
};
const domainBadges: Record<string, string> = {
  rotating: 'ROTATING MACHINERY',
  electrical: 'MCSA',
  motion: 'PRECISION MOTION',
  degradation: 'RUL / PHM',
};

// Three outcomes, merged from the original Executive Impact and Product Essence
// grids. Shape matches what .dr-exec-card was written for, so no new CSS.
const outcomes = [
  {
    kpi: 'PREDICTABLE CONTROL',
    metric: '~100 kHz',
    title: 'The loop cost is fixed and known',
    summary:
      'ADC sampling, Clarke/Park transforms and PWM generation run in dedicated blocks rather than firmware, so a field-oriented-control tick costs the same number of cycles every time. The CPU is left free for diagnostics.',
    details: ['Hardware FOC datapath', 'CORDIC transforms', '82% CPU headroom'],
    businessImpact: 'A control loop that does not drift under load or interrupt pressure.',
    citation: 'Evidence: Simulated. Loop stage costs, ~100 kHz closed loop',
    links: [{label: 'Control-loop budget', target: 'control'}],
  },
  {
    kpi: 'DEFINED FAULT RESPONSE',
    metric: '39 cycles',
    title: 'A wrong value reaches a safe bridge without firmware',
    summary:
      'A trailing checker core compares every value the first core commits, as it commits it. A mismatch trips the FAULT pin and disables the PWM bridge in 39 cycles, on a path that never passes through software.',
    details: ['Hardware lockstep pair', 'Locked injection register', 'Windowed watchdog'],
    businessImpact: 'The failure path is a mechanism you can test, not a self-test interval you hope is short enough.',
    citation: 'Evidence: Simulated. 39-cycle fault-to-latch, lockstep under interrupts',
    links: [{label: 'Inside the safety core', target: 'architecture?block=0'}],
  },
  {
    kpi: 'SUPPLY PLANNING',
    metric: '130 nm',
    title: 'A mature node with a second source',
    summary:
      'DG32 targets mature 130 nm/180 nm process nodes qualified at more than one foundry, on a 198-day RTL-to-GDSII shuttle loop. Node maturity and second sourcing are the two things a production schedule actually depends on.',
    details: ['Mature-node process', 'Multi-foundry qualification', '198-day shuttle loop'],
    businessImpact: 'Sourcing risk becomes a planning input rather than an unknown.',
    citation: 'Status: qualification in progress. See the roadmap for what is committed',
    links: [{label: 'Position & roadmap', target: 'roadmap'}],
  },
];

export function ImprovedOverview({
  reduced,
  navigate,
  go,
}: {
  reduced: boolean;
  navigate: (v: string) => void;
  go: (v: string) => void;
}) {
  return (
    <>
      {/* 1 — HERO. What this is, who it is for, and what to do next. */}
      <section className="hero dr-hero">
        <div className="hero-canvas">
          <Silicon variant="lite" reduced={reduced} selected={0}/>
        </div>
        <div className="hero-shade"/>
        <div className="hero-copy">
          <Eyebrow>DG32 / MOTOR-CONTROL SILICON</Eyebrow>
          <h1>Motor-control silicon,<br/>built for <em>predictable</em><br/>behaviour.</h1>
          <p>
            DG32 puts a RISC-V control core, the motor-control peripherals and a hardware
            lockstep safety monitor on one 130&nbsp;nm chip.<br/>
            Pre-silicon: first silicon rides the September 2026 shuttle, and every figure on
            this site is a design value until bring-up.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={() => navigate('ask')} aria-label="Discuss your application">
              Discuss your application <ArrowUpRight size={19} aria-hidden="true"/>
            </button>
            <button className="text-link" onClick={() => navigate('family')} aria-label="Explore the product family">
              Explore products <ArrowRight size={18} aria-hidden="true"/>
            </button>
          </div>
        </div>
        <div className="hero-annotation">
          <span className="cross">+</span>
          <div>DG32-LITE<small>QFN-64 · 9 × 9 MM · 130 NM CMOS</small></div>
        </div>
        <p className="image-disclaimer">ILLUSTRATIVE MODEL · NOT A MASK LAYOUT · DRAG TO ROTATE</p>
        <div className="hero-bottom"><span>DEEPGRID SEMI PVT LTD / HYDERABAD, INDIA</span></div>
      </section>

      <section className="metrics-strip">
        {headline.map(([v, l]) => <div key={l}><strong>{v}</strong><span>{l}</span></div>)}
        <p>Pre-silicon figures.<br/>Design values, not measurements.</p>
      </section>

      {/* 2 — OUTCOMES. Why the architecture matters for the reader's system. */}
      <section className="content-section dr-exec-pillars-section" data-rv data-rv-delay="100">
        <div className="section-label">
          <Eyebrow>OUTCOMES</Eyebrow>
          <span>WHAT IMPROVES IN YOUR SYSTEM?</span>
        </div>
        <div className="thesis-heading" data-rv data-rv-delay="200">
          <h2>Three things change<br/><em>when safety is hardware.</em></h2>
          <div>
            <p>
              Entry-level motor-control parts catch faults between faults: watchdogs, brown-out
              reset and periodic self-test all run in the gaps. DG32 moves the control loop and
              the fault check into hardware, so both have a cost you can state in cycles.
            </p>
          </div>
        </div>
        <div className="dr-exec-grid">
          {outcomes.map((o, idx) => (
            <article key={o.kpi} className="dr-exec-card" data-rv data-rv-delay={idx * 150 + 300}>
              <div className="dr-exec-card-content">
                <div className="dr-exec-card-head">
                  <span className="mono dr-exec-kpi">{o.kpi}</span>
                  <span className="dr-exec-metric">{o.metric}</span>
                </div>
                <h3>{o.title}</h3>
                <p>{o.summary}</p>
                <div className="dr-exec-story-pills">
                  {o.details.map(d => (
                    <span key={d} className="dr-story-pill">
                      <Check size={12} aria-hidden="true"/><span>{d}</span>
                    </span>
                  ))}
                </div>
                <div className="dr-exec-impact">
                  <span className="mono">WHAT IT MEANS:</span>
                  <strong>{o.businessImpact}</strong>
                </div>
                <div className="dr-exec-citation"><span className="mono">{o.citation}</span></div>
                <div className="dr-pillar-links">
                  {o.links.map(l => (
                    <button key={l.label} className="text-link dr-pillar-link" onClick={() => go(l.target)}>
                      {l.label} <ArrowUpRight size={14} aria-hidden="true"/>
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3 — ARCHITECTURE. One explanatory moment: the two paths across the die. */}
      <section id="fault-isolation" className="content-section dr-fault-section" data-rv data-rv-delay="100">
        <div className="section-label">
          <Eyebrow>ARCHITECTURE</Eyebrow>
          <span>HOW DO THOSE OUTCOMES RELATE TO THE HARDWARE?</span>
        </div>
        <FaultTrace steps={faultPath} intro={
          <>
            <h2 className="dr-h2">Two paths cross the die,<br/><em>and only one is firmware.</em></h2>
            <p className="dr-lead">
              The control path runs ADC, CORDIC, PI regulators and PWM, and the CPU only
              supervises it. The fault-response path runs lockstep comparator, fault latch and
              PWM brake, and firmware is not in it at all. Sharing nothing but the die is what
              keeps a busy control loop from delaying a fault response.
            </p>
            <p className="dr-lead">
              Firmware can still prove the fault path works: a locked injection register fires it
              on purpose, which is the only way to test it on real silicon.
            </p>
            <div className="dr-links">
              <button className="text-link" onClick={() => navigate('control')}>
                Follow the control path <ArrowUpRight size={16} aria-hidden="true"/>
              </button>
              <button className="text-link" onClick={() => go('architecture?block=0')}>
                Inside the safety core <ArrowUpRight size={16} aria-hidden="true"/>
              </button>
              <button className="text-link" onClick={() => navigate('architecture')}>
                Explore the full architecture <ArrowUpRight size={16} aria-hidden="true"/>
              </button>
            </div>
          </>
        }/>
      </section>

      {/* 4 — APPLICATIONS. Four domains, one representative task each. */}
      <section className="content-section dr-usecases-section" data-rv data-rv-delay="100">
        <div className="section-label">
          <Eyebrow>APPLICATIONS</Eyebrow>
          <span>WHERE MIGHT THIS FIT?</span>
        </div>
        <div className="thesis-heading" data-rv data-rv-delay="200">
          <h2>Four domains,<br/><em>one silicon envelope.</em></h2>
          <div>
            <p>
              DG32 runs edge diagnostics on the motor-control SoC itself, with no external
              coprocessor. Each domain below shows one representative task; the full task
              inventory, its conditions and its evidence status are in the whitepaper.
            </p>
            <div className="dr-usecase-header-actions">
              <button className="primary" onClick={() => go('library?pkg=lite')}>
                Download the use-case whitepaper (PDF) <Download size={16} aria-hidden="true"/>
              </button>
              <button className="text-link" onClick={() => navigate('ask')}>
                Query use cases in Ask DeepGrid <ArrowUpRight size={16} aria-hidden="true"/>
              </button>
            </div>
          </div>
        </div>

        <div className="dr-usecases-grid">
          {domains.map((d, idx) => (
            <article key={d.id} className="dr-usecase-card" data-rv data-rv-delay={idx * 150 + 300}>
              <figure className="dr-usecase-media">
                <img
                  src={domainImages[d.id] || './media/deepgrid_truck.jpg'}
                  alt={d.title}
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={225}
                />
                <figcaption className="dr-usecase-badge">{domainBadges[d.id] || 'INDUSTRIAL'}</figcaption>
              </figure>
              <div className="dr-usecase-card-head">
                <div className="dr-usecase-header-meta">
                  <span className="mono dr-usecase-tasks">{d.tasksCount}</span>
                  <span className="dr-usecase-standards">{d.standards}</span>
                </div>
                <h3>{d.title}</h3>
                <p className="dr-usecase-sub">{d.subtitle}</p>
              </div>
              <div className="dr-usecase-tasks-list">
                <span className="mono dr-usecase-list-label">REPRESENTATIVE TASK:</span>
                <ul>
                  <li>
                    <Check size={14} aria-hidden="true"/>
                    <span>{d.examples[0]}</span>
                  </li>
                </ul>
              </div>
              <div className="dr-usecase-card-footer">
                <div className="dr-usecase-timing">
                  <span className="mono">LATENCY:</span>
                  <strong>{d.timing}</strong>
                </div>
                <div className="dr-usecase-benefit">
                  <span className="mono">WHY IT MATTERS:</span>
                  <p>{d.businessBenefit}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="dr-usecases-footer-bar">
          <div className="dr-usecases-callout">
            <strong>Scope:</strong> task latencies are simulated figures for the stated sample
            rates and are not measurements on fabricated parts.
          </div>
          <div className="dr-usecases-links">
            <button className="text-link" onClick={() => navigate('control')}>
              Inspect the control headroom <ArrowUpRight size={16} aria-hidden="true"/>
            </button>
            <button className="text-link" onClick={() => navigate('family')}>
              DG32-LITE vs DG32-2DOM <ArrowUpRight size={16} aria-hidden="true"/>
            </button>
          </div>
        </div>
      </section>

      {/* 5 — EVIDENCE. What is verifiable today, and what is not claimed. */}
      <section id="verification-ladder" className="content-section dr-verification-ladder-section" data-rv data-rv-delay="100">
        <div className="section-label">
          <Eyebrow>EVIDENCE</Eyebrow>
          <span>WHAT CAN BE VERIFIED TODAY?</span>
        </div>
        <div className="dr-verification-intro" data-rv data-rv-delay="200">
          <h2 className="dr-h2">Every figure says<br/><em>how it was obtained.</em></h2>
          <p className="dr-lead">
            DG32 is pre-silicon as of September 2026. Numbers on this site carry the kind of
            evidence behind them. These are different kinds of evidence, not stages of a ladder,
            and none of them is a measurement on fabricated silicon. Three representative kinds
            are below; the full register covers five.
          </p>
        </div>
        <div className="dr-evidence-ladder" role="list" aria-label="Representative evidence types behind the specifications">
          {evidenceLadder.slice(0, 3).map((e, idx) => (
            <article
              key={e.kind}
              className="dr-evidence-card"
              role="listitem"
              data-rv
              data-rv-delay={idx * 150 + 300}
              style={{'--evidence-color': evidenceColors[e.kind]} as React.CSSProperties}
            >
              <figure className="dr-evidence-media">
                <img
                  src={evidenceImages[e.kind]}
                  alt={`Evidence visualization: ${e.kind}`}
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={225}
                />
                <figcaption className="dr-evidence-badge" style={{background: evidenceColors[e.kind]}}>
                  {evidenceBadges[e.kind]}
                </figcaption>
              </figure>
              <div className="dr-evidence-content">
                <div className="dr-evidence-header">
                  <span className="dr-evidence-icon" style={{color: evidenceColors[e.kind]}}>
                    {evidenceIcons[e.kind]}
                  </span>
                  <h3 className="dr-evidence-kind">{e.kind}</h3>
                </div>
                <p className="dr-evidence-means">{e.means}</p>
                <div className="dr-evidence-examples">
                  <span className="dr-evidence-label">Examples:</span>
                  <span>{e.examples}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="dr-evidence-disclaimer" data-rv data-rv-delay="700">
          <p className="dr-kicker">WHAT THIS SITE DOES NOT CLAIM</p>
          <ul className="dr-notclaimed">
            {notClaimed.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>
        <div className="dr-links dr-sec-gap">
          <button className="text-link" onClick={() => navigate('roadmap')}>
            Full verification register &amp; gaps <ArrowUpRight size={16} aria-hidden="true"/>
          </button>
          <button className="text-link" onClick={() => go('library?pkg=lite')}>
            Download the specification suite <Download size={16} aria-hidden="true"/>
          </button>
          <button className="text-link" onClick={() => navigate('ask')}>
            Audit a specification in Ask DeepGrid <ArrowUpRight size={16} aria-hidden="true"/>
          </button>
        </div>
      </section>

      {/* 6 — NEXT STEP. */}
      <section className="content-section" data-rv data-rv-delay="100">
        <div className="section-label">
          <Eyebrow>NEXT STEP</Eyebrow>
          <span>WHAT SHOULD YOU DO NOW?</span>
        </div>
        <div className="thesis-heading" data-rv data-rv-delay="200">
          <h2>Tell us what<br/><em>your system needs.</em></h2>
          <div>
            <p>
              Describe the drive, the requirement that decides the design, and the timing you are
              working to. Ask DeepGrid answers specification questions directly from the
              whitepaper and technical annex, with the source cited on every answer.
            </p>
            <button className="primary" onClick={() => navigate('ask')} aria-label="Discuss your application">
              Discuss your application <ArrowUpRight size={18} aria-hidden="true"/>
            </button>
          </div>
        </div>
        <div className="dr-links dr-sec-gap">
          <button className="text-link" onClick={() => navigate('roadmap')}>
            Position &amp; roadmap <ArrowUpRight size={16} aria-hidden="true"/>
          </button>
          <button className="text-link" onClick={() => navigate('pinout')}>
            Pinout &amp; package <ArrowUpRight size={16} aria-hidden="true"/>
          </button>
          <button className="text-link" onClick={() => navigate('library')}>
            Documents, decks &amp; films <ArrowUpRight size={16} aria-hidden="true"/>
          </button>
        </div>
      </section>
    </>
  );
}

export default ImprovedOverview;
