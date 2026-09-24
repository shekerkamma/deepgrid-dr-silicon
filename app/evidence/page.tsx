'use client';
import {ArrowUpRight, Download} from 'lucide-react';
import {Shell, useNav} from '../shell';
import {SectionHead} from '../detail';
import {evidenceLadder, notClaimed} from '../detail-content';
import {claims, withheld, type EvidenceKind} from '../claims';
import Related from '../related';
import {FilmMoment, type Clip} from '../evidence-clip';
import '../story.css';

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

/** /evidence told as a story: docs/evidence-story.md is the storyboard.
 *
 *  This page used to be five cards, each a full-width white deck slide with a play button and a
 *  coloured badge over it, then a 16-row table of figures that nothing connected to the cards. The
 *  table was the substance. Now each kind of evidence is a beat: what the kind is, the figures on
 *  this site that rest on it (from the claim map, which scripts/check-claims.mjs re-verifies against
 *  the source documents), and the film moment where it is explained.
 */
const beats: {kind: EvidenceKind; id: string; title: string; after: string}[] = [
  {kind: 'Simulated', id: 'ev-simulated',
    title: 'Simulation shows the design behaves as intended before any silicon exists.',
    after: 'It shows the logic does what it should. A bench measurement on first silicon is what confirms it.'},
  {kind: 'Post-route', id: 'ev-post-route',
    title: 'Post-route timing is checked on the laid-out design, which is still not silicon.',
    after: 'It accounts for real wire lengths, but it is still a layout result: the silicon numbers come with bring-up.'},
  {kind: 'Analytic', id: 'ev-analytic',
    title: 'Analytic figures are arithmetic on the architecture, and a bench measurement replaces them.',
    after: 'Where a cost is plain arithmetic, it can be worked out before silicon. Nothing has run it yet.'},
  {kind: 'Tool estimate', id: 'ev-tool',
    title: 'The power figure is a tool estimate, not a measurement.',
    after: 'The implementation tools estimate power without a recorded switching pattern behind it. It is not a measured figure.'},
  {kind: 'Process nominal', id: 'ev-process',
    title: 'Electrical limits are process nominals until first-silicon characterisation replaces them.',
    after: 'Every electrical limit in the datasheet is a design target or a process nominal, and first-silicon characterisation will replace it.'},
];

function Figures({rows, caption}: {rows: [string, typeof claims[string]][]; caption: string}) {
  return (
    <div className="st-table-scroll">
      <table className="st-models">
        <caption>{caption}</caption>
        <thead>
          <tr><th scope="col">Figure</th><th scope="col">What it measures</th><th scope="col">Source</th></tr>
        </thead>
        <tbody>
          {rows.map(([id, c]) => (
            <tr key={id}><th scope="row">{c.figure}</th><td>{c.measures}</td><td>{c.sourceTitle}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Page() {
  const {href} = useNav();
  const all = Object.entries(claims);
  const of = (k?: EvidenceKind) => all.filter(([, c]) => c.kind === k);
  const constants = all.filter(([, c]) => !c.kind);
  return (
    <Shell route="evidence">
      <section className="page-wrap">
        <SectionHead
          tag="04 / EVIDENCE"
          title="Every figure says how it was obtained"
          copy="DG32 is pre-silicon as of September 2026. This page takes each kind of evidence behind the site's numbers in turn: what it is, which figures rest on it, and the moment in the narrated films where it is explained."
        />
        <div className="st-story">
          <section className="st-beat st-answer" id="ev-answer" aria-labelledby="ev-answer-h">
            <div className="st-beat-text">
              <h2 id="ev-answer-h">Nothing here is measured on silicon yet. Every figure says what it rests on instead.</h2>
              <p>{notClaimed[0]}</p>
              <p>
                Until then, each of the {all.length} load-bearing figures on this site is one of five kinds
                of evidence, or a design decision that measures nothing. They are different kinds, not
                steps on a ladder, and each one below lists the figures that rest on it.
              </p>
            </div>
            <nav className="st-families st-cols-3" aria-label="The kinds of evidence">
              {beats.map(b => (
                <a key={b.kind} href={'#' + b.id}>
                  <span className="st-fam-n num">{of(b.kind).length}</span>
                  <strong>{b.kind}</strong>
                  <span className="st-fam-line">{evidenceLadder.find(e => e.kind === b.kind)?.means}</span>
                </a>
              ))}
              <a href="#ev-constants">
                <span className="st-fam-n num">{constants.length}</span>
                <strong>Design constant</strong>
                <span className="st-fam-line">A decision in the design, not a measurement</span>
              </a>
            </nav>
          </section>

          <section className="st-beat" id="ev-withheld" aria-labelledby="ev-withheld-h">
            <div className="st-beat-text">
              <h2 id="ev-withheld-h">Three claims in our own sources failed verification. This site does not make them.</h2>
              <p>
                The source documents carry figures this site leaves out. Each was checked and found
                wrong in a way that matters, so it is printed here with the reason rather than quietly
                dropped.
              </p>
              <ul className="st-tiers">
                {withheld.map(w => (
                  <li key={w.claim}><strong>{w.claim}</strong><span>{w.why}</span></li>
                ))}
              </ul>
            </div>
          </section>

          {beats.map(b => {
            const e = evidenceLadder.find(x => x.kind === b.kind)!;
            const rows = of(b.kind);
            return (
              <section key={b.kind} className="st-beat has-aside" id={b.id} aria-labelledby={b.id + '-h'}>
                <div className="st-beat-text">
                  <p className="st-fam-kicker">{b.kind}</p>
                  <h2 id={b.id + '-h'}>{b.title}</h2>
                  <p><strong>{e.means}.</strong> {b.after}</p>
                </div>
                <div className="st-beat-aside">
                  <FilmMoment clip={clips[b.kind]} label={b.kind}/>
                </div>
                <div className="st-beat-wide">
                  <Figures rows={rows} caption={`${rows.length} ${rows.length === 1 ? 'figure rests' : 'figures rest'} on ${b.kind.toLowerCase()} evidence`}/>
                </div>
              </section>
            );
          })}

          <section className="st-beat" id="ev-constants" aria-labelledby="ev-constants-h">
            <div className="st-beat-text">
              <h2 id="ev-constants-h">Some figures are design decisions, not measurements of anything.</h2>
              <p>
                A pin count or a memory size is chosen, not measured, so it carries no evidence kind.
                Labelling it &ldquo;Simulated&rdquo; would cheapen the word.
              </p>
            </div>
            <div className="st-beat-wide">
              <Figures rows={constants} caption={`${constants.length} design constants`}/>
            </div>
          </section>

          <section className="st-beat st-close" id="ev-next" aria-labelledby="ev-next-h">
            <div className="st-beat-text">
              <h2 id="ev-next-h">What this site does not claim, and where to check what it does.</h2>
              <ul className="st-tiers">
                {notClaimed.slice(1).map(n => <li key={n}><span>{n}</span></li>)}
              </ul>
              <p className="st-aside">
                Every figure above was located in its source document, and a build gate re-runs that
                search and fails when a source stops carrying a figure.
              </p>
            </div>
            <div className="st-close-links">
              <a className="st-primary" href={href('ask')}>Audit a figure in Ask DeepGrid <ArrowUpRight size={16} aria-hidden="true"/></a>
              <a className="st-link" href={href('library?pkg=lite')}>Download the specification suite <Download size={15} aria-hidden="true"/></a>
              <a className="st-link" href={href('procurement')}>Position, roadmap and gaps <ArrowUpRight size={15} aria-hidden="true"/></a>
            </div>
          </section>
        </div>
        <Related route="evidence"/>
      </section>
    </Shell>
  );
}
