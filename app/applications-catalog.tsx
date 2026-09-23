'use client';

import {useMemo, useState} from 'react';
import {ArrowUpRight, Check} from 'lucide-react';
import {useNav} from './shell';
import {useCaseDomains as domains} from './detail-content';
import {claims} from './claims';
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

type Task = {id: string; name: string; domain: string; domainShort: string; standards: string; timing: string; photo: string};

export function ApplicationsCatalog() {
  const {href} = useNav();
  const [filter, setFilter] = useState<string>('all');

  // Every task the data actually carries. The site declares 30 across the four domains and
  // enumerates 16; the collection holds the 16 and says so rather than inventing the rest.
  const tasks: Task[] = useMemo(
    () => domains.flatMap(d =>
      d.examples.map((name, i) => ({
        id: `${d.id}-${i}`,
        name,
        domain: d.id,
        domainShort: domainShort[d.id] ?? d.title,
        standards: d.standards,
        timing: d.timing,
        photo: domainPhoto[d.id],
      })),
    ),
    [],
  );
  const declared = domains.reduce((n, d) => n + (Number((d.tasksCount || '').match(/\d+/)?.[0]) || 0), 0);

  const shown = filter === 'all' ? tasks : tasks.filter(t => t.domain === filter);
  const standards = [...new Set(shown.map(t => t.standards))];
  const envelope = [...new Set(shown.map(t => t.timing))];

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
                <div><dt>Domain</dt><dd>{t.domainShort}</dd></div>
                <div><dt>Standard</dt><dd>{t.standards}</dd></div>
                <div><dt>Timing</dt><dd>{t.timing}</dd></div>
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
            <div><dt>Timing basis</dt><dd className="dg-plate-sm">{envelope.join(' · ')}</dd></div>
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
          This catalogue lists <strong>{tasks.length}</strong> tasks. The site&rsquo;s domain data
          declares <strong>{declared}</strong>. The remaining {declared - tasks.length} are counted in
          the corpus but not enumerated in any source held here, so they are not invented into this
          list.
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
