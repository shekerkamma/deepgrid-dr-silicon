'use client';

import {ArrowUpRight, Download} from 'lucide-react';
import {Shell, useNav} from '../shell';
import {SectionHead} from '../detail';
import {evidenceLadder, notClaimed} from '../detail-content';

const colors: Record<string, string> = {
  Simulated: '#bf7f3b', 'Post-route': '#2f9e8c', Analytic: '#8f9d6b',
  'Tool estimate': '#7486ab', 'Process nominal': '#bf7f3b',
};
const images: Record<string, string> = {
  Simulated: '/media/sims_image.png', 'Post-route': '/media/sims_image2.png',
  Analytic: '/media/sims_image3.png', 'Tool estimate': '/media/sims_image4.png',
  'Process nominal': '/media/sims_image4.png',
};
const badges: Record<string, string> = {
  Simulated: 'SIMULATION', 'Post-route': 'POST-ROUTE', Analytic: 'ANALYTIC',
  'Tool estimate': 'TOOL EST.', 'Process nominal': 'PROCESS',
};

export default function Page() {
  const {href} = useNav();
  return (
    <Shell route="evidence">
      <section className="page-wrap">
        <SectionHead
          tag="04 / EVIDENCE"
          title="Every figure says how it was obtained"
          copy="DG32 is pre-silicon as of September 2026. Each number on this site carries the kind of evidence behind it. These are five different kinds of evidence, not five stages of a ladder, and none of them is a measurement on fabricated silicon."
        />

        <div className="dr-evidence-ladder" role="list" aria-label="Evidence types behind the specifications">
          {evidenceLadder.map((e, idx) => (
            <article key={e.kind} className="dr-evidence-card" role="listitem" data-rv data-rv-delay={idx * 120 + 200}
              style={{'--evidence-color': colors[e.kind]} as React.CSSProperties}>
              <figure className="dr-evidence-media">
                <img src={images[e.kind]} alt={`Evidence visualization: ${e.kind}`} loading="lazy" decoding="async" width={400} height={225}/>
                <figcaption className="dr-evidence-badge" style={{background: colors[e.kind]}}>{badges[e.kind]}</figcaption>
              </figure>
              <div className="dr-evidence-content">
                <div className="dr-evidence-header"><h3 className="dr-evidence-kind">{e.kind}</h3></div>
                <p className="dr-evidence-means">{e.means}</p>
                <div className="dr-evidence-examples">
                  <span className="dr-evidence-label">Examples:</span><span>{e.examples}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="dr-evidence-disclaimer" data-rv data-rv-delay="700">
          <p className="dr-kicker">WHAT THIS SITE DOES NOT CLAIM</p>
          <ul className="dr-notclaimed">{notClaimed.map((n, i) => <li key={i}>{n}</li>)}</ul>
        </div>

        <div className="dr-links dr-sec-gap">
          <a className="text-link" href={href('procurement')}>Position, roadmap &amp; gaps <ArrowUpRight size={16} aria-hidden="true"/></a>
          <a className="text-link" href={href('library?pkg=lite')}>Download the specification suite <Download size={16} aria-hidden="true"/></a>
          <a className="text-link" href={href('ask')}>Audit a specification in Ask DeepGrid <ArrowUpRight size={16} aria-hidden="true"/></a>
        </div>
      </section>
    </Shell>
  );
}
