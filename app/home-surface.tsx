'use client';

import {useEffect, useRef, useState} from 'react';
import {ArrowUpRight, ArrowRight, Check} from 'lucide-react';
import {useNav} from './shell';
import {loopStages, loopRates, CLOCK_HZ, HW_FIXED_CYCLES, CYCLES_PER_INSTRUCTION} from './content';
import {evidenceLadder, notClaimed, useCaseDomains as domains} from './detail-content';
import {useScrollCraft} from './scrollcraft/use-scrollcraft';
import './scrollcraft/scrollcraft.css';
import './home-surface.css';

/** Every figure the surface shows is this arithmetic, run on the two published constants.
 *  Nothing here is a stored claim: period and budget are derived so a reader can redo them. */
function budgetFor(khz: number) {
  const period = Math.round(CLOCK_HZ / (khz * 1000));
  const budget = period - HW_FIXED_CYCLES;
  return {
    period,
    budget,
    hwPct: (HW_FIXED_CYCLES / period) * 100,
    budgetPct: (budget / period) * 100,
    instructions: Math.floor(budget / CYCLES_PER_INSTRUCTION),
  };
}

/** The signature move. The act publishes --sc-p as it scrolls; this reads it and walks the
 *  loop rate up the four published rates, so scrolling spends the cycle budget. Bespoke to
 *  this page and driven off the engine's own progress value, never by editing the engine. */
function useRateFromAct(actRef: React.RefObject<HTMLElement | null>) {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = actRef.current;
      if (el) {
        const p = parseFloat(getComputedStyle(el).getPropertyValue('--sc-p'));
        if (Number.isFinite(p)) setT(Math.min(1, Math.max(0, p)));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [actRef]);
  // Four published rates, held in bands so each one is readable rather than smeared past.
  const i = Math.min(loopRates.length - 1, Math.floor(t * loopRates.length));
  return {index: i, rate: loopRates[i], t};
}

export function HomeSurface() {
  const root = useRef<HTMLDivElement>(null);
  const spendAct = useRef<HTMLElement>(null);
  const {href} = useNav();
  useScrollCraft(root);
  const {index, rate} = useRateFromAct(spendAct);
  const b = budgetFor(rate.khz);
  const opening = budgetFor(loopRates[0].khz);
  const [q, setQ] = useState('');

  return (
    <div className="dg-surface" ref={root}>
      <div className="dg-progress" data-sc-progress aria-hidden="true"/>

      {/* ACT 1 — pin. The surface is already running. No title card. */}
      <section className="dg-act dg-act-open" data-sc-act="pin" data-sc-span="1.6">
        <div data-sc-stage className="dg-stage">
          <div className="dg-statusbar">
            <span className="dg-chip dg-chip-live">LOOP IN FLIGHT</span>
            <span>DG32-LITE</span>
            <span>RV32IM x2, lockstep</span>
            <span>{(CLOCK_HZ / 1_000_000).toFixed(0)}&nbsp;MHz core clock</span>
            <span className="dg-chip dg-chip-warn">PRE-SILICON, SIMULATED</span>
          </div>

          <div className="dg-panels">
            <section className="dg-panel dg-panel-wide" aria-label="Field-oriented control loop">
              <h1 className="dg-panel-title">Field-oriented control loop</h1>
              <p className="dg-panel-note">
                Running at {loopRates[0].khz}&nbsp;kHz. {loopRates[0].fits}.
              </p>
              <ol className="dg-chain">
                {loopStages.map(([n, name, , cost]) => (
                  <li key={n} className="dg-link">
                    <span className="dg-link-n">{n}</span>
                    <span className="dg-link-name">{name}</span>
                    <span className="dg-link-cost">{cost}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="dg-panel" aria-label="Cycle budget readout">
              <h2 className="dg-panel-title">Budget</h2>
              <dl className="dg-readout">
                <div><dt>Cycles per period</dt><dd className="dg-num">{opening.period.toLocaleString('en-US')}</dd></div>
                <div><dt>Hardware, fixed</dt><dd className="dg-num">{HW_FIXED_CYCLES}</dd></div>
                <div><dt>Left for firmware</dt><dd className="dg-num dg-num-key">{opening.budget.toLocaleString('en-US')}</dd></div>
                <div><dt>Share of period</dt><dd className="dg-num dg-num-key">{opening.budgetPct.toFixed(0)}%</dd></div>
              </dl>
              <p className="dg-panel-foot">
                Cycles the firmware can use, derived from the core clock and the fixed
                hardware cost. What is left after the regulators run is a separate figure, on the
                control-loop page.
              </p>
            </section>
          </div>
        </div>
      </section>

      {/* ACT 2 — reveal. Quiet by design: the stillness the peak lands against. */}
      <section className="dg-act" data-sc-act="reveal" data-sc-span="1.4">
        <div className="dg-block">
          <h2 className="dg-h2">What each stage costs</h2>
          <p className="dg-lede">
            One ADC sample, two CORDIC operations and a PWM write cost about {HW_FIXED_CYCLES}&nbsp;cycles
            at any loop rate. The rate does not change the work. It changes how much room is left
            around it.
          </p>
          <div className="dg-tablewrap">
          <table className="dg-table">
            <caption className="dg-sr">Control loop stages and their simulated cycle costs</caption>
            <thead>
              <tr><th scope="col">Stage</th><th scope="col">What runs</th><th scope="col">Cost</th></tr>
            </thead>
            <tbody>
              {loopStages.map(([n, name, what, cost]) => (
                <tr key={n}>
                  <th scope="row"><span className="dg-link-n">{n}</span> {name}</th>
                  <td>{what}</td>
                  <td className="dg-num">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <p className="dg-foot">Simulated. Measured in simulation of the design as built, not on fabricated parts.</p>
        </div>
      </section>

      {/* ACT 3 — pin + bespoke. THE PEAK. Largest span on the page. */}
      <section
        className="dg-act dg-act-peak"
        data-sc-act="pin"
        data-sc-span="3.4"
        ref={spendAct as React.RefObject<HTMLElement>}
      >
        <div data-sc-stage className="dg-stage">
          <div className="dg-spend">
            <div className="dg-spend-head">
              <h2 className="dg-h2">Spend it</h2>
              <p className="dg-lede">
                Four published loop rates. Keep scrolling and the period shrinks while the hardware
                cost stays where it is.
              </p>
            </div>

            <div className="dg-rate-rail" role="list" aria-label="Loop rate">
              {loopRates.map((r, i) => (
                <div key={r.khz} role="listitem" className={'dg-rate' + (i === index ? ' is-on' : '') + (i < index ? ' is-past' : '')}>
                  <strong>{r.khz}</strong><span>kHz</span>
                </div>
              ))}
            </div>

            <div
              className="dg-stack"
              role="img"
              aria-label={`At ${rate.khz} kHz the period is ${b.period} cycles. Hardware uses ${HW_FIXED_CYCLES}, leaving ${b.budget} for firmware, ${b.budgetPct.toFixed(0)} percent of the period.`}
            >
              <div className="dg-seg dg-seg-hw" style={{width: b.hwPct + '%'}}>
                <span>{HW_FIXED_CYCLES} hardware</span>
              </div>
              <div className="dg-seg dg-seg-cpu" style={{width: 100 - b.hwPct + '%'}}>
                <span>{b.budget.toLocaleString('en-US')} firmware</span>
              </div>
            </div>

            <dl className="dg-readout dg-readout-row">
              <div><dt>Rate</dt><dd className="dg-num dg-num-key">{rate.khz}&nbsp;kHz</dd></div>
              <div><dt>Period</dt><dd className="dg-num">{b.period.toLocaleString('en-US')}&nbsp;cyc</dd></div>
              <div><dt>Left for firmware</dt><dd className="dg-num dg-num-key">{b.budget.toLocaleString('en-US')}&nbsp;cyc</dd></div>
              <div><dt>Share of period</dt><dd className="dg-num dg-num-key">{b.budgetPct.toFixed(0)}%</dd></div>
              <div><dt>Instructions</dt><dd className="dg-num">~{b.instructions.toLocaleString('en-US')}</dd></div>
            </dl>

            <p className="dg-spend-fits">{rate.fits}.</p>
            <p className="dg-foot">
              period = {(CLOCK_HZ / 1_000_000).toFixed(0)}&nbsp;MHz ÷ rate, budget = period − {HW_FIXED_CYCLES},
              instructions = budget ÷ {CYCLES_PER_INSTRUCTION}. Every figure on this screen is that arithmetic.
            </p>
          </div>
        </div>
      </section>

      {/* ACT 4 — pan. Lateral travel reads as options. The calm act. */}
      <section className="dg-act" data-sc-act="pan" data-sc-span="1.5">
        <div className="dg-block">
          <h2 className="dg-h2">What that buys</h2>
          <p className="dg-lede">
            That budget is what runs diagnostics on the control core itself, with no second
            processor.
          </p>
        </div>
        <div className="dg-rail" data-sc-pan>
          {domains.map(d => (
            <article key={d.id} className="dg-card">
              <span className="dg-card-tag">{d.standards}</span>
              <h3>{d.title}</h3>
              <p>{d.subtitle}</p>
              <p className="dg-card-task"><Check size={13} aria-hidden="true"/> {d.examples[0]}</p>
              <p className="dg-card-timing"><span>LATENCY</span> {d.timing}</p>
            </article>
          ))}
        </div>
        <p className="dg-block dg-foot">
          <a className="dg-link-out" href={href('applications')}>All four domains and their tasks <ArrowUpRight size={14} aria-hidden="true"/></a>
        </p>
      </section>

      {/* ACT 5 — count on real telemetry. Trust. */}
      <section className="dg-act" data-sc-act="reveal" data-sc-span="1.8">
        <div className="dg-block">
          <h2 className="dg-h2">How those figures were obtained</h2>
          <p className="dg-lede">
            <span className="dg-num dg-num-key" data-sc-count={`0 ${evidenceLadder.length}`} data-sc-count-at="0.05 0.4">0</span>{' '}
            kinds of evidence sit behind the numbers on this page. None of them is a measurement on
            fabricated silicon.
          </p>
          <ul className="dg-kinds">
            {evidenceLadder.map(e => (
              <li key={e.kind}>
                <span className="dg-kind">{e.kind}</span>
                <span className="dg-kind-means">{e.means}</span>
              </li>
            ))}
          </ul>
          <details className="dg-notclaimed">
            <summary>What this site does not claim</summary>
            <ul>{notClaimed.map((n, i) => <li key={i}>{n}</li>)}</ul>
          </details>
          <p className="dg-foot">
            <a className="dg-link-out" href={href('evidence')}>The full evidence register <ArrowUpRight size={14} aria-hidden="true"/></a>
          </p>
        </div>
      </section>

      {/* ACT 6 — pointer + a real input. The page ends in something you type into. */}
      <section className="dg-act dg-act-close" data-sc-act="pin" data-sc-span="1.6">
        <div data-sc-stage className="dg-stage">
          <form
            className="dg-ask"
            onSubmit={e => { e.preventDefault(); location.assign(href('ask') + (q ? '?q=' + encodeURIComponent(q) : '')); }}
          >
            <label className="dg-ask-label" htmlFor="dg-ask-q">Ask it something</label>
            <p className="dg-ask-note">
              Answers are grounded in the whitepaper and technical annex, with the source cited on
              every one. It runs in your browser.
            </p>
            <div className="dg-ask-field">
              <input
                id="dg-ask-q"
                name="question"
                type="search"
                inputMode="search"
                spellCheck={false}
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder={"e.g. What limits the loop rate at 100\u00a0kHz?"}
                autoComplete="off"
              />
              <button type="submit">Ask <ArrowRight size={16} aria-hidden="true"/></button>
            </div>
            <p className="dg-ask-alt">
              Or go straight to <a href={href('technology')}>the architecture</a>,{' '}
              <a href={href('products')}>the two chips</a>, or{' '}
              <a href={href('resources')}>the documents</a>.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default HomeSurface;
