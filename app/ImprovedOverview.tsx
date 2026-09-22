'use client';

import {useEffect, useState} from 'react';
import {ArrowUpRight, ArrowRight, Check, Download, Play} from 'lucide-react';
import Silicon from './silicon';
import {useReveal, useScrollVars} from './motion';
import {useCount, useDraw, useRail} from './devices';
import {Eyebrow, SectionHead, Sec, Stats, Callout, DataTable} from './detail';
import {
  executivePillars,
  productEssence,
  useCaseDomains,
  procurementScorecard,
  platformSections,
  sovereignSkuHorizon,
  whitepaperDownloads,
  evidenceLadder,
  notClaimed,
  faultPath,
  packages,
  fmtTime
} from './detail-content';
import {headline} from './content';

export function ImprovedOverview({
  reduced,
  navigate,
  go
}: {
  reduced: boolean;
  navigate: (v: string) => void;
  go: (v: string) => void;
}) {
  const [menu, setMenu] = useState(false);
  const [exploded, setExploded] = useState(false);

  // Reveal animation for the improved overview
  const devKey = 'overview-improved?' + new URLSearchParams(window.location.search).toString();
  useReveal(devKey);
  useScrollVars();
  useCount(devKey);
  useDraw(devKey);
  useRail(devKey);

  // Navigation links for breadcrumb context
  const openBlock = (i: number) => {
    go('architecture?block=' + i);
  };

  // Executive pillar images
  const execImages: Record<string, string> = {
    'UNIT ECONOMICS': './media/deepgrid_soc2_die.jpg',
    'SUPPLY CONTINUITY': './media/deepgrid_defence.jpg',
    'TIME TO MARKET': './media/roadmap-poster.png',
    'SAFETY HARDWARE': './media/dg32-lite-tapein-poster.jpg',
  };
  const execBadges: Record<string, string> = {
    'UNIT ECONOMICS': 'UNIT ECONOMICS',
    'SUPPLY CONTINUITY': 'SOVEREIGN',
    'TIME TO MARKET': 'ROADMAP',
    'SAFETY HARDWARE': 'SAFETY',
  };

  // Product essence images
  const essenceImages: Record<string, string> = {
    'HARDWARE LOCKSTEP SAFETY': './media/deepgrid_soc2_die.jpg',
    'DETERMINISTIC 100 kHz LOOP': './media/dg32-lite-architecture-poster.jpg',
    'SINGLE-PCB DUAL-SoC PLATFORM': './media/dg32-2dom-architecture-poster.jpg',
    'SOVEREIGN MATURE SUPPLY': './media/deepgrid_defence.jpg',
  };
  const essenceBadges: Record<string, string> = {
    'HARDWARE LOCKSTEP SAFETY': 'DIE LAYOUT',
    'DETERMINISTIC 100 kHz LOOP': 'WAVEFORM',
    'SINGLE-PCB DUAL-SoC PLATFORM': 'ARCHITECTURE',
    'SOVEREIGN MATURE SUPPLY': 'FOUNDRY',
  };

  // Use case images
  const useCaseImages: Record<string, string> = {
    rotating: './media/deepgrid_truck.jpg',
    electrical: './media/deepgrid_robotics.jpg',
    motion: './media/deepgrid_logistics.jpg',
    degradation: './media/deepgrid_defence.jpg',
  };
  const useCaseBadges: Record<string, string> = {
    rotating: 'ROTATING MACHINERY',
    electrical: 'MCSA',
    motion: 'PRECISION MOTION',
    degradation: 'RUL / PHM',
  };

  // Platform section images
  const hubImages: Record<string, string> = {
    family: './media/dg32-lite-architecture-poster.jpg',
    architecture: './media/dg32-2dom-architecture-poster.jpg',
    control: './media/dg32-lite-architecture-poster.jpg',
    pinout: './media/dg32-lite-datasheet-poster.jpg',
    roadmap: './media/roadmap-poster.png',
    library: './media/dg32-lite-datasheet-poster.jpg',
    ask: './media/deepgrid_soc2_die.jpg',
  };
  const hubBadges: Record<string, string> = {
    family: 'PRODUCT FAMILY',
    architecture: 'ARCHITECTURE',
    control: 'CONTROL LOOP',
    pinout: 'PINOUT',
    roadmap: 'ROADMAP',
    library: 'MEDIA',
    ask: 'INTELLIGENCE',
  };

  // Sovereign SKU images
  const sovereignImages: Record<string, string> = {
    'DG32-LITE': './media/dg32-lite-architecture-poster.jpg',
    'DG32-2DOM': './media/dg32-2dom-architecture-poster.jpg',
    'DG-D100': './media/dg32-2dom-architecture-poster.jpg',
    'DG-RADAR-77': './media/deepgrid_defence.jpg',
    'DG-DISP-17': './media/deepgrid_robotics.jpg',
    'DG-SDV-ZONE': './media/deepgrid_logistics.jpg',
  };
  const sovereignBadges: Record<string, string> = {
    'DG32-LITE': 'LITE',
    'DG32-2DOM': '2DOM',
    'DG-D100': 'D100',
    'DG-RADAR-77': 'RADAR',
    'DG-DISP-17': 'DISPLAY',
    'DG-SDV-ZONE': 'SDV',
  };

  // Whitepaper images
  const whitepaperImages: Record<string, string> = {
    doc1: './media/dg32-lite-datasheet-poster.jpg',
    doc2: './media/dg32-2dom-architecture-poster.jpg',
    doc3: './media/dg32-lite-datasheet-poster.jpg',
    doc4: './media/dg32-2dom-architecture-poster.jpg',
    doc5: './media/deepgrid_defence.jpg',
    doc6: './media/deepgrid_soc2_die.jpg',
  };
  const whitepaperBadges: Record<string, string> = {
    doc1: 'DOC #1',
    doc2: 'DOC #2',
    doc3: 'DOC #3',
    doc4: 'DOC #4',
    doc5: 'DOC #5',
    doc6: 'DOC #6',
  };

  // Evidence images
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

  // Safety images
  const safetyImages: Record<string, string> = {
    'Lockstep Core': './media/deepgrid_soc2_die.jpg',
    'Fault Isolation': './media/dg32-lite-tapein-poster.jpg',
    'Supply Monitor': './media/deepgrid_soc2_die.jpg',
  };

  return (
    <>
      {/* HERO */}
      <section className="hero dr-hero" data-rv data-rv-delay="0">
        <div className="hero-canvas">
          <Silicon variant="lite" reduced={reduced} selected={0} />
        </div>
        <div className="hero-shade" />
        <div className="hero-copy">
          <Eyebrow>DG32 · MOTOR-CONTROL SILICON</Eyebrow>
          <h1>Motor-control silicon,<br />built for <em>predictable behavior</em>.</h1>
          <p>
            DG32-LITE and DG32-2DOM: lockstep RISC-V SoCs on 130 nm. First silicon September 2026.
          </p>
          <div className="hero-actions">
            <button
              className="primary"
              onClick={() => navigate('architecture')}
              aria-label="Explore the architecture"
            >
              Discuss your application <ArrowUpRight size={19} aria-hidden="true" />
            </button>
            <button
              className="text-link"
              onClick={() => navigate('products')}
              aria-label="Explore products"
            >
              Explore products <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="hero-annotation">
          <span className="cross">+</span>
          <div>
            DG32-LITE / DG32-2DOM
            <small>QFN-64 · 9 × 9 MM · 130 NM CMOS</small>
          </div>
        </div>
        <p className="image-disclaimer">
          PRE-SILICON · DESIGN VALUES, NOT MEASUREMENTS · DG32-LITE (CI2609) & DG32-2DOM (CI2612) SHUTTLE SLOTS SECURED
        </p>
        <div className="hero-bottom">
          <span>DEEPGRID SEMI PVT LTD / HYDERABAD, INDIA</span>
        </div>
      </section>

      {/* METRICS STRIP - kept from original */}
      <section className="metrics-strip" data-rv data-rv-delay="100">
        {headline.map(([v, l]) => (
          <div key={l}>
            <strong>{v}</strong>
            <span>{l}</span>
          </div>
        ))}
        <div>
          <img
            src="./media/deepgrid_soc2_die.jpg"
            alt="DG32 die layout showing six functional blocks"
            className="metrics-die-preview"
          />
        </div>
        <p>Pre-silicon figures.<br />Design values, not measurements.</p>
      </section>

      {/* OUTCOMES - 3 pillars merged from Executive Impact + Product Essence */}
      <section className="content-section dr-outcomes-section" data-rv data-rv-delay="100">
        <div className="section-label">
          <Eyebrow>OUTCOMES</Eyebrow>
          <span>WHY THE ARCHITECTURE MATTERS FOR YOUR SYSTEM</span>
        </div>
        <div className="dr-outcomes-grid">
          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="2" />
                  <path d="M12 4v16M4 12h16" />
                </svg>
              ),
              title: 'Predictable control',
              description:
                'Hardware-accelerated FOC loop runs in ~300 cycles with zero jitter. The CPU stays free for diagnostics while ADC sampling, Park transforms, and PWM generation execute in dedicated blocks.',
              link: {label: 'View control-loop evidence', target: 'control'},
              evidenceRef: 'Loop stage costs, ~100 kHz closed loop, lockstep under interrupts'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              ),
              title: 'Defined fault response',
              description:
                'A trailing checker core compares every committed store. A mismatch trips the FAULT pin and disables the PWM bridge in 39 cycles — no firmware in the path.',
              link: {label: 'View safety evidence', target: 'architecture?block=0'},
              evidenceRef: '39-cycle fault-to-latch, lockstep comparator fault injection campaigns'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              ),
              title: 'Sovereign supply planning',
              description:
                'Dual-foundry qualification (SkyWater + SCL Mohali) on mature 130 nm/180 nm nodes. 198-day MPW loop. DAP-2020 Make-II and PIL-5 compliance for defense procurement.',
              link: {label: 'View procurement scorecard', target: 'roadmap'},
              evidenceRef: '198-day RTL-to-GDSII flow, three-factory sovereignty'
            }
          ].map((o, idx) => (
            <article key={o.title} className="dr-outcome-card" data-rv data-rv-delay={idx * 150 + 200}>
              <div className="dr-outcome-icon">{o.icon}</div>
              <h3>{o.title}</h3>
              <p>{o.description}</p>
              <div className="dr-outcome-evidence">
                <span className="mono">EVIDENCE:</span> <span>{o.evidenceRef}</span>
              </div>
              <button
                className="text-link dr-outcome-link"
                onClick={() => go(o.link.target)}
              >
                {o.link.label} <ArrowUpRight size={14} aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ARCHITECTURE - One memorable explanatory moment */}
      <section className="content-section dr-arch-section" data-rv data-rv-delay="100">
        <div className="section-label">
          <Eyebrow>ARCHITECTURE</Eyebrow>
          <span>HOW THE BENEFITS RELATE TO THE HARDWARE</span>
        </div>
        <div className="thesis-heading" data-rv data-rv-delay="200">
          <h2>Two independent paths,<br /><em>one frozen safety core.</em></h2>
          <div>
            <p>
              The DG32 architecture separates the <strong>control path</strong> (ADC → CORDIC → PI regulators → PWM)
              from the <strong>fault-response path</strong> (lockstep comparator → FAULT pin → PWM brake).
              The safety core checks every committed store in two cycles; a mismatch trips the bridge in 39
              cycles without firmware involvement.
            </p>
            <p>
              DG32-2DOM adds an INT8 attention engine on its own 114 MHz clock domain behind clock-domain bridges,
              so condition monitoring never extends the control core's worst-case execution time.
            </p>
          </div>
        </div>

        <div className="dr-arch-layout">
          <div className="dr-arch-diagram">
            <img
              src="./media/dg32-2dom-architecture-poster.jpg"
              alt="DG32 architecture diagram showing control path and fault response path"
              loading="lazy"
              decoding="async"
            />
            <div className="dr-arch-overlay">
              <button className="dr-arch-path-btn control" onClick={() => go('control')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <span>Control path</span>
              </button>
              <button className="dr-arch-path-btn fault" onClick={() => go('architecture?block=0')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <span>Fault response</span>
              </button>
            </div>
          </div>
          <div className="dr-arch-explanation">
            <h3>Six functional blocks, one frozen core</h3>
            <p>
              The DG32-LITE die is organized into six regions: <strong>Safety core</strong> (lockstep pair,
              fault latch, windowed watchdog), <strong>Memory & boot</strong> (64 KB ROM, 32 KB SRAM, QSPI
              flash), <strong>Motor drive</strong> (3-phase PWM, DShot × 4, timers), <strong>Sensing & math</strong>
              (Encoder + Hall, SAR ADC, CORDIC), <strong>Connectivity</strong> (UART × 2, SPI, I²C, QSPI,
              GPIO), and <strong>Bus, system & test</strong> (two-master bus, interrupts, DMA, JTAG).
            </p>
            <p>
              The safety core is the frozen center — its lockstep pair, boot path, and bus decode are closed
              until silicon test. Everything outside is configurable per SKU.
            </p>
            <button
              className="primary"
              onClick={() => navigate('architecture')}
            >
              Explore the architecture <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* APPLICATIONS - 4 domain cards */}
      <section className="content-section dr-apps-section" data-rv data-rv-delay="100">
        <div className="section-label">
          <Eyebrow>APPLICATIONS</Eyebrow>
          <span>WHERE DEEPGRID SILICON FITS</span>
        </div>
        <div className="dr-apps-grid">
          {useCaseDomains.map((d, idx) => (
            <article key={d.id} className="dr-app-card" data-rv data-rv-delay={idx * 150 + 200}>
              <figure className="dr-app-media">
                <img
                  src={useCaseImages[d.id] || './media/deepgrid_truck.jpg'}
                  alt={d.title}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="dr-app-badge">{useCaseBadges[d.id] || 'INDUSTRIAL'}</figcaption>
              </figure>
              <div className="dr-app-content">
                <div className="dr-app-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h3>{d.title}</h3>
                <p className="dr-app-sub">{d.subtitle}</p>
                <ul className="dr-app-tasks">
                  {d.examples.map((t, i) => (
                    <li key={i}>
                      <Check size={14} aria-hidden="true" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <div className="dr-app-meta">
                  <span className="dr-app-meta-item">
                    <strong>Standards:</strong> {d.standards}
                  </span>
                  <span className="dr-app-meta-item">
                    <strong>Latency:</strong> {d.timing}
                  </span>
                  <span className="dr-app-meta-item">
                    <strong>Products:</strong> {d.products}
                  </span>
                </div>
                <button
                  className="text-link dr-app-link"
                  onClick={() => navigate('applications')}
                >
                  View domain details <ArrowUpRight size={14} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* EVIDENCE - Dated status summary + 3 representative entries */}
      <section className="content-section dr-evidence-section" data-rv data-rv-delay="100">
        <div className="section-label">
          <Eyebrow>EVIDENCE</Eyebrow>
          <span>WHAT YOU CAN VERIFY TODAY</span>
        </div>

        <div className="dr-evidence-status">
          <span className="dr-status-badge" style={{background: 'rgba(215,114,11,0.12)', color: '#d7720b'}}>
            Pre-silicon
          </span>
          <span className="dr-status-text">First silicon September 2026 · Design values, not measurements</span>
        </div>

        <div className="dr-evidence-grid">
          {evidenceLadder.slice(0, 3).map((e, idx) => (
            <article key={e.kind} className="dr-evidence-card" data-rv data-rv-delay={idx * 150 + 200}>
              <div className="dr-evidence-meta">
                <span
                  className="dr-evidence-type"
                  style={{background: 'rgba(4,179,199,0.12)', color: '#04b3c7'}}
                >
                  {e.kind}
                </span>
                <span className="dr-evidence-config">{e.means}</span>
              </div>
              <h4>{e.examples}</h4>
              <div className="dr-evidence-ref">
                <span className="mono">EVIDENCE:</span> <span>{e.examples}</span>
              </div>
              <button
                className="text-link dr-evidence-link"
                onClick={() => go('architecture?block=2')}
              >
                View artifact <ArrowUpRight size={14} aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>

        <div className="dr-evidence-actions">
          <button className="text-link" onClick={() => navigate('architecture?block=2')}>
            Full verification register <ArrowUpRight size={14} aria-hidden="true" />
          </button>
          <button className="text-link" onClick={() => go('library?pkg=lite')}>
            Download Master Whitepaper (PDF) <Download size={16} />
          </button>
        </div>
      </section>

      {/* NEXT STEP */}
      <section className="content-section dr-next-section" data-rv data-rv-delay="100">
        <div className="section-label">
          <Eyebrow>NEXT STEP</Eyebrow>
        </div>
        <div className="thesis-heading">
          <h2>Tell us what your system needs</h2>
          <div>
            <p>
              We'll match your requirements to the right DG32 variant, share relevant documentation, and
              connect you with the right engineering contact.
            </p>
            <button className="primary" onClick={() => navigate('ask')}>
              Discuss your application <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="dr-next-links">
          <button className="text-link" onClick={() => navigate('roadmap')}>
            Procurement information
          </button>
          <span className="dr-next-divider">·</span>
          <button className="text-link" onClick={() => go('library?pkg=lite')}>
            Developer resources
          </button>
          <span className="dr-next-divider">·</span>
          <button className="text-link" onClick={() => navigate('architecture')}>
            Technical deep-dive
          </button>
        </div>
      </section>
    </>
  );
}

export default ImprovedOverview;