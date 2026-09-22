'use client';

import {ArrowUpRight, Check, Download} from 'lucide-react';
import {Shell, useNav} from '../shell';
import {SectionHead, Eyebrow} from '../detail';
import {useCaseDomains as domains} from '../detail-content';
import {PRE_SILICON} from '../copy';

const domainImages: Record<string, string> = {
  rotating: '/media/deepgrid_truck.jpg',
  electrical: '/media/deepgrid_robotics.jpg',
  motion: '/media/deepgrid_logistics.jpg',
  degradation: '/media/deepgrid_defence.jpg',
};
const domainBadges: Record<string, string> = {
  rotating: 'ROTATING MACHINERY',
  electrical: 'MCSA',
  motion: 'PRECISION MOTION',
  degradation: 'RUL / PHM',
};

export default function Page() {
  const {href} = useNav();
  return (
    <Shell route="applications">
      <section className="page-wrap">
        <SectionHead
          tag="03 / APPLICATIONS"
          title="Four domains, one silicon envelope"
          copy="DG32 runs edge diagnostics on the motor-control SoC itself, with no external coprocessor. Each domain lists the tasks it covers, the standards it works against, and the latency envelope those tasks were simulated at."
        />

        <div className="dr-usecases-grid">
          {domains.map((d, idx) => (
            <article key={d.id} className="dr-usecase-card" data-rv data-rv-delay={idx * 150 + 200}>
              <figure className="dr-usecase-media">
                <img src={domainImages[d.id]} alt={d.title} loading="lazy" decoding="async" width={400} height={225}/>
                <figcaption className="dr-usecase-badge">{domainBadges[d.id]}</figcaption>
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
                <span className="mono dr-usecase-list-label">TASKS IN THIS DOMAIN:</span>
                <ul>{d.examples.map(ex => <li key={ex}><Check size={14} aria-hidden="true"/><span>{ex}</span></li>)}</ul>
              </div>
              <div className="dr-usecase-card-footer">
                <div className="dr-usecase-timing"><span className="mono">LATENCY:</span><strong>{d.timing}</strong></div>
                <div className="dr-usecase-benefit"><span className="mono">WHY IT MATTERS:</span><p>{d.businessBenefit}</p></div>
              </div>
            </article>
          ))}
        </div>

        <div className="dr-usecases-footer-bar">
          <div className="dr-usecases-callout">
            <strong>Scope:</strong> task latencies are simulated figures for the stated sample rates and are not measurements on fabricated parts.
          </div>
          <div className="dr-usecases-links">
            <a className="text-link" href={href('control')}>Inspect the control headroom <ArrowUpRight size={16} aria-hidden="true"/></a>
            <a className="text-link" href={href('products')}>DG32-LITE vs DG32-2DOM <ArrowUpRight size={16} aria-hidden="true"/></a>
            <a className="text-link" href={href('library?pkg=lite')}>Use-case whitepaper (PDF) <Download size={16} aria-hidden="true"/></a>
          </div>
        </div>
        <p className="disclaimer">{PRE_SILICON}</p>
      </section>
    </Shell>
  );
}
