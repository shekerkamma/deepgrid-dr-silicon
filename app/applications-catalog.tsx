'use client';

import {useMemo, useState} from 'react';
import {ArrowUpRight, Check} from 'lucide-react';
import {useNav} from './shell';
import {diagnosticDomains as domains} from './detail-content';
import {claims} from './claims';
import {diagnosticTasks, USE_CASE_TOTAL} from './diagnostic-tasks';
import './applications-catalog.css';

/** Gallery / catalog. Objects in a walkable collection, every one carrying the identical label
 *  schema, because the schema is what makes it a collection rather than a grid.
 *
 *  Signature move: the plate beside the collection recomputes as the filter changes. Three of its
 *  numbers move. External processors required does not, and that is the page.
 */

const domainPhoto: Record<string, string> = {
  rotating: '/media/deepgrid_truck.jpg',
  electrical: '/media/deepgrid_robotics.jpg',
  motion: '/media/deepgrid_logistics.jpg',
  degradation: '/media/deepgrid_defence.jpg',
};
const domainShort: Record<string, string> = {
  rotating: 'Rotating machinery',
  electrical: 'Electrical signature',
  motion: 'Precision motion',
  degradation: 'Degradation and RUL',
};

type Task = {
  id: string; name: string; domain: string; domainShort: string; standards: string; photo: string;
  detects: string; sensing: string; features: string; model: string; memory: string; latency: string; rate: string;
};

export function ApplicationsCatalog() {
  const {href} = useNav();
  const [filter, setFilter] = useState<string>('all');

  // All thirty tasks, read off the playbook's own tables rather than the four-per-domain sample
  // the page used to show while claiming thirty. app/use-cases.ts carries one row per task.
  const tasks: Task[] = useMemo(
    () => diagnosticTasks.map((u, i) => {
      const d = domains.find(x => x.id === u.domain);
      return {
        id: `${u.domain}-${i}`,
        name: u.name,
        domain: u.domain,
        domainShort: domainShort[u.domain] ?? d?.title ?? u.domain,
        standards: d?.standards ?? '',
        photo: domainPhoto[u.domain],
        detects: u.detects, sensing: u.sensing, features: u.features,
        model: u.model, memory: u.memory, latency: u.latency, rate: u.rate,
      };
    }),
    [],
  );

  const shown = filter === 'all' ? tasks : tasks.filter(t => t.domain === filter);
  const standards = [...new Set(shown.map(t => t.standards))].filter(Boolean);
  // Derived from the selection rather than stated: the fastest and slowest inference in view. The
  // "<" on a row the document writes as "<0.01 ms" is carried through, because printing a bare 0.01
  // would claim a precision the source does not.
  const lat = shown
    .map(t => ({n: Number(t.latency.replace(/[^\d.]/g, '')), lt: t.latency.includes('<')}))
    .filter(x => Number.isFinite(x.n));
  const lo = lat.length ? lat.reduce((a, b) => (b.n < a.n ? b : a)) : null;
  const hi = lat.length ? lat.reduce((a, b) => (b.n > a.n ? b : a)) : null;
  const envelope = lo && hi ? `${lo.lt ? '<' : ''}${lo.n}\u2013${hi.n}\u00a0ms` : '\u2014';
  const models = [...new Set(shown.map(t => t.model.split(',')[0].trim()))];

  return (
    <div className="dg-cat">
      {/* The nav is an index of objects and it jumps. No separate title treatment: the collection
          starts at the top of the page, with object one already in view and already labelled. */}
      <nav className="dg-cat-index" aria-label="Filter the collection">
        <button className={filter === 'all' ? 'is-on' : ''} onClick={() => setFilter('all')} aria-pressed={filter === 'all'}>
          All <span className="dg-cat-n">{tasks.length}</span>
        </button>
        {domains.map(d => {
          const n = tasks.filter(t => t.domain === d.id).length;
          return (
            <button key={d.id} className={filter === d.id ? 'is-on' : ''} onClick={() => setFilter(d.id)} aria-pressed={filter === d.id}>
              {domainShort[d.id]} <span className="dg-cat-n">{n}</span>
            </button>
          );
        })}
      </nav>

      <div className="dg-cat-body">
        <div className="dg-cat-objects">
          {shown.map(t => (
            <article key={t.id} className="dg-obj">
              <figure className="dg-obj-media">
                <img src={t.photo} alt="" loading="lazy" decoding="async" width={400} height={225}/>
              </figure>
              {/* The label schema. Identical for every object, and it has to survive being read
                  half-visible, so each field is on its own line rather than run together. */}
              <dl className="dg-obj-label">
                <div><dt>Task</dt><dd>{t.name}</dd></div>
                <div><dt>Detects</dt><dd>{t.detects}</dd></div>
                <div><dt>Sensing</dt><dd>{t.sensing}</dd></div>
                <div><dt>Features</dt><dd>{t.features}</dd></div>
                <div><dt>Model</dt><dd>{t.model}</dd></div>
                <div><dt>Memory</dt><dd>{t.memory}</dd></div>
                <div><dt>Latency</dt><dd>{t.latency}</dd></div>
                <div><dt>Max rate</dt><dd>{t.rate}</dd></div>
                <div><dt>Standard</dt><dd>{t.standards}</dd></div>
                <div><dt>Runs on</dt><dd>DG32-LITE · DG32-2DOM</dd></div>
              </dl>
            </article>
          ))}
        </div>

        {/* THE PLATE. Three numbers move with the filter. The fourth does not. */}
        <aside className="dg-plate" aria-live="polite">
          <p className="dg-plate-kicker">THIS SELECTION</p>
          <dl>
            <div><dt>Tasks in view</dt><dd className="dg-plate-n">{shown.length}</dd></div>
            <div><dt>Standards</dt><dd className="dg-plate-n">{standards.length}</dd></div>
            <div><dt>Model families</dt><dd className="dg-plate-n">{models.length}</dd></div>
            <div><dt>Inference range</dt><dd className="dg-plate-sm">{envelope}</dd></div>
            <div className="dg-plate-fixed">
              <dt>External processors required</dt>
              <dd className="dg-plate-n">0</dd>
            </div>
          </dl>
          <p className="dg-plate-foot">
            Every task runs on the motor-control core itself, in the diagnostic headroom left at a
            10&nbsp;kHz field-oriented control rate. Filter it any way and the last number does not move.
          </p>
          <p className="dg-plate-cite">
            <span className="mono">{claims['headroom-82'].kind}</span> · {claims['headroom-82'].figure} available
            diagnostic headroom · {claims['headroom-82'].sourceTitle}
          </p>
        </aside>
      </div>

      <section className="dg-cat-envelope">
        <h2>Where the envelope holds, and where it does not</h2>
        <p>
          The corpus states that 24 of 30 use cases run above 1&nbsp;kHz, with a worst case of
          10.24&nbsp;ms on a 1D convolutional model. Six do not clear 1&nbsp;kHz. They are named in the
          source rather than averaged into the headline, which is the only reason the other
          twenty-four mean anything.
        </p>
        <p>
          The timing field is not one quantity across the four domains, and the label says
          &ldquo;Timing&rdquo; rather than &ldquo;Latency&rdquo; for that reason. Rotating machinery
          states an inference latency, electrical signature a sample rate, precision motion a cycle
          count, and degradation a headroom figure. They are not comparable to each other, and a
          column that averaged them would be inventing a number none of the sources contains.
        </p>
        <p className="dg-cat-gap">
          <Check size={14} aria-hidden="true"/>
          All <strong>{tasks.length}</strong> of the {USE_CASE_TOTAL} tasks the playbook counts are
          listed here, each with the sensing, model, memory, latency and maximum rate that document
          states for it. Earlier this page showed four per domain and cited the total, so fourteen
          of them existed only as a number.
        </p>
      </section>

      {/* The close is an inquiry plate, typeset exactly like a label so the ask reads as part of
          the collection rather than as an interruption of it. */}
      <aside className="dg-obj dg-inquiry">
        <dl className="dg-obj-label">
          <div><dt>Task</dt><dd>Your machine, not one of these</dd></div>
          <div><dt>Domain</dt><dd>Tell us the failure mode and the sample rate</dd></div>
          <div><dt>Standard</dt><dd>Whichever one you are tested against</dd></div>
          <div><dt>Timing</dt><dd>We will tell you whether it fits</dd></div>
          <div>
            <dt>Next</dt>
            <dd><a className="dg-cat-link" href={href('ask')}>Ask DeepGrid <ArrowUpRight size={14} aria-hidden="true"/></a></dd>
          </div>
        </dl>
      </aside>

      <p className="dg-cat-foot">
        <a className="dg-cat-link" href={href('control')}>The control headroom these run in <ArrowUpRight size={14} aria-hidden="true"/></a>
        <a className="dg-cat-link" href={href('evidence')}>What each figure rests on <ArrowUpRight size={14} aria-hidden="true"/></a>
        <a className="dg-cat-link" href={href('library?pkg=lite')}>The use-case whitepaper <ArrowUpRight size={14} aria-hidden="true"/></a>
      </p>
    </div>
  );
}

export default ApplicationsCatalog;
