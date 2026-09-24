'use client';

import {ArrowUpRight, Download} from 'lucide-react';
import {Shell, useNav} from '../shell';
import {SectionHead} from '../detail';
import {evidenceLadder, notClaimed} from '../detail-content';
import {claims, withheld} from '../claims';
import Related from '../related';
import EvidenceClip, {EvidenceSaid, type Clip} from '../evidence-clip';

const colors: Record<string, string> = {
  Simulated: '#bf7f3b', 'Post-route': '#2f9e8c', Analytic: '#8f9d6b',
  'Tool estimate': '#7486ab', 'Process nominal': '#bf7f3b',
};
/** The moment in a narrated film where each kind of evidence is actually on screen, with the deck
 *  slide that states it as the poster. Timings are the film segment maps in app/data/*-film.json;
 *  every slide title is quoted from app/library-data.ts. These replaced stills from an AMR forklift
 *  simulator, which illustrated nothing on this page. */
const clips: Record<string, Clip> = {
  Simulated: {
    film: '/media/dg32-lite-architecture.mp4', captions: '/media/dg32-lite-architecture.vtt',
    poster: '/decks/dg32-lite/slide-06.webp', start: 153.43, duration: 25.40, slide: 6,
    deck: 'DG32-LITE architecture', shows: 'Two cores must agree on every committed store.',
    saying: 'This is the safety core. MAIN runs the application. CHECKER runs the same instructions two cycles later, on the same inputs, and the comparator checks every committed store. On a mismatch, the first cause is latched and FAULT_N goes low. Route that pin to the gate-driver enable, and the bridge turns off in hardware, without waiting for firmware.',
  },
  'Post-route': {
    film: '/media/dg32-2dom-architecture.mp4', captions: '/media/dg32-2dom-architecture.vtt',
    poster: '/decks/dg32-2dom/slide-11.webp', start: 289.76, duration: 26.78, slide: 11,
    deck: 'DG32-2DOM architecture', shows: 'Both clocks close timing on a larger die.',
    saying: 'Splitting the clocks worked: both domains close timing after place-and-route, with positive slack. The fifty megahertz control side has zero point three nanoseconds of slack, and the one hundred fourteen megahertz engine side zero point one nine, on a die of three point four by four point five millimetres. Those are layout results, not silicon; the silicon numbers come with bring-up.',
  },
  Analytic: {
    film: '/media/dg32-2dom-architecture.mp4', captions: '/media/dg32-2dom-architecture.vtt',
    poster: '/decks/dg32-2dom/slide-10.webp', start: 257.60, duration: 32.16, slide: 10,
    deck: 'DG32-2DOM architecture', shows: 'One query row costs about 3,242\u00a0cycles.',
    saying: 'The engine\'s cost can be worked out before silicon, because it is plain arithmetic. At sixteen lanes and four hundred keys, with keys of thirty-two bytes and values of sixty-four, combining the values takes half of each row, about sixteen hundred cycles. Scoring the keys takes a quarter, requantising about seven hundred, and the divide just forty-eight, roughly thirty-two hundred and forty in all. A bench measurement replaces that estimate once first silicon arrives.',
  },
  'Tool estimate': {
    film: '/media/dg32-lite-datasheet.mp4', captions: '/media/dg32-lite-datasheet.vtt',
    poster: '/decks/dg32-lite-datasheet/slide-07.webp', start: 167.82, duration: 26.97, slide: 7,
    deck: 'DG32-LITE datasheet', shows: 'The slide carries the figure and its caveat: ~0.43\u00a0W at 50\u00a0MHz, tool estimate, not measured.',
    saying: 'Power is simple. All logic, memory and the ADC draw from the one point eight volt user rail. The other user rails are unused, and are tied to their nominal voltage only to keep protection structures biased. Bring up three point three volts before or together with one point eight. The tool estimate is about zero point four three watts at fifty megahertz.',
  },
  'Process nominal': {
    film: '/media/dg32-lite-datasheet.mp4', captions: '/media/dg32-lite-datasheet.vtt',
    poster: '/decks/dg32-lite-datasheet/slide-06.webp', start: 139.52, duration: 28.30, slide: 6,
    deck: 'DG32-LITE datasheet', shows: 'Every electrical limit is a nominal until silicon.',
    saying: 'Every electrical limit in this datasheet is a design target or a process nominal, and first-silicon characterisation will replace it. The core supply runs from one point seven one to one point eight nine volts, and the input and output supply from three to three point six. The analog inputs accept zero to one point eight volts, and absolute maximums sit just above the operating range.',
  },
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
        <ul className="dr-evidence-ladder" aria-label="Evidence types behind the specifications">
          {evidenceLadder.map((e, idx) => (
            <li key={e.kind} className="dr-evidence-card" data-rv data-rv-delay={idx * 120 + 200}
              style={{'--evidence-color': colors[e.kind]} as React.CSSProperties}>
              <div className="dr-evidence-media dr-evidence-media-clip">
                <EvidenceClip clip={clips[e.kind]} label={e.kind}/>
                <span className="dr-evidence-badge" style={{background: colors[e.kind]}}>{badges[e.kind]}</span>
              </div>
              <div className="dr-evidence-content">
                <div className="dr-evidence-header"><h3 className="dr-evidence-kind">{e.kind}</h3></div>
                <p className="dr-evidence-means">{e.means}</p>
                <div className="dr-evidence-examples">
                  <span className="dr-evidence-label">Examples:</span><span>{e.examples}</span>
                </div>
                <EvidenceSaid clip={clips[e.kind]}/>
              </div>
            </li>
          ))}
        </ul>

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
