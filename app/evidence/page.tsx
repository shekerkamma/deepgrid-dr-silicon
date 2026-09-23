'use client';

import {ArrowUpRight, Download} from 'lucide-react';
import {Shell, useNav} from '../shell';
import {SectionHead} from '../detail';
import {evidenceLadder, notClaimed} from '../detail-content';
import {claims, withheld} from '../claims';
import Related from '../related';

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

        <h2 className="sr-only">The five kinds of evidence behind the specifications</h2>
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

        {/* The register. /evidence defined five kinds of evidence and no page applied them to an
            actual figure, so the vocabulary existed and nothing spoke it. Every row here was
            located in its source document; scripts/check-claims.mjs re-runs that search. */}
        <div className="dr-sec-gap">
          <p className="dr-kicker">WHAT EACH FIGURE RESTS ON</p>
          <div className="table-scroll">
            <table className="dr-table dr-table-wide">
              <caption>Load-bearing figures, the evidence behind them, and the document that carries them</caption>
              <thead>
                <tr>
                  <th scope="col">Figure</th>
                  <th scope="col">What it measures</th>
                  <th scope="col">Evidence</th>
                  <th scope="col">Source</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(claims).map(([id, c]) => (
                  <tr key={id}>
                    <th scope="row">{c.figure}</th>
                    <td>{c.measures}</td>
                    <td>{c.kind ?? <span className="mono">design constant</span>}</td>
                    <td>{c.sourceTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="disclaimer">
            Derived from the markdown sources in the document library, not from this site&rsquo;s own
            data files. That order is deliberate: the SKU list was derived from those same documents
            and had drifted from them, so a derived layer cannot be used to check itself. A build
            gate re-runs the search and fails when a source stops carrying a figure.
          </p>
        </div>

        <div className="dr-sec-gap">
          <p className="dr-kicker">WHAT THE SOURCES SAY THAT THIS SITE DOES NOT</p>
          <ul className="dr-notclaimed">
            {withheld.map(w => (
              <li key={w.claim}><strong>{w.claim}.</strong> {w.why}</li>
            ))}
          </ul>
        </div>

        <div className="dr-links dr-sec-gap">
          <a className="text-link" href={href('procurement')}>Position, roadmap &amp; gaps <ArrowUpRight size={16} aria-hidden="true"/></a>
          <a className="text-link" href={href('library?pkg=lite')}>Download the specification suite <Download size={16} aria-hidden="true"/></a>
          <a className="text-link" href={href('ask')}>Audit a specification in Ask DeepGrid <ArrowUpRight size={16} aria-hidden="true"/></a>
        </div>
      <Related route="evidence"/>
      </section>
    </Shell>
  );
}
