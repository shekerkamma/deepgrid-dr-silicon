'use client';

import {Shell, useNav} from '../shell';
import {ArrowUpRight} from 'lucide-react';
import {DataTable, ExplainedGrid, Sec, SectionHead, Stats} from '../detail';
import {PRE_SILICON} from '../copy';
import {
  companyNotClaimed, companyStats, milestones, moats, pillars, revenueBuild,
  stopRules, team, unitEconomics, fundsAllocation,
} from '../company-content';

export default function Page() {
  const {go} = useNav();

  return (
    <Shell route="company">
      <section className="page-wrap">
        <SectionHead
          tag="08 / COMPANY"
          title="A silicon team in Hyderabad building for a market that is already obliged to buy domestic"
          copy="DeepGrid Semi Pvt Ltd designs motor control, condition monitoring and zonal compute on mature nodes. The bet is not that we can beat a 40 nm part on performance — it is that a ≥130 nm part designed in India can be bought where an imported one cannot."
        />
        <Stats items={companyStats}/>

        <Sec
          kicker="THE MARKET"
          title="About $9B of India’s annual IC imports are mature node,"
          em="and an open-source flow is what makes 10k-unit volumes worth serving."
          copy="India imports roughly $23.4B of integrated circuits a year. The mature-node share is the part a 130 nm design centre can actually address, and it is the part where per-seat EDA licensing and mask costs, not transistor density, decide whether a 10,000-unit defence order is profitable."
        >
          <DataTable caption="Unit economics of a mature-node spin" head={['Line', 'Where it lands']} rows={unitEconomics} wide/>
        </Sec>

        <Sec
          kicker="STRATEGY"
          title="Three pillars, and each one is a constraint the design already answers"
          em="rather than a value it aspires to."
          copy="Sovereignty decides who may buy. Determinism decides what the part is good at. Lockstep decides whether it can be used where a failure destroys hardware."
        >
          <ExplainedGrid items={pillars} cols={3}/>
        </Sec>

        <Sec
          kicker="MILESTONES"
          title="A 198-day shuttle-to-shuttle loop,"
          em="with each spin committed to closing a named gap."
          copy="Each step has a job. First silicon proves the architecture; the second spin closes the two largest gaps against the incumbent; connectivity and debug follow."
        >
          <div className="dr-rail"><div className="dr-rail-stage"><div className="dr-rail-track">
            <ol className="dr-roadmap">{milestones.map(([when, title, what, proves]) => (
              <li key={title}>
                <span className="mono">{when}</span>
                <h3>{title}</h3>
                <p>{what}</p>
                <p className="dr-proves"><span className="mono">WHAT IT DELIVERS</span>{proves}</p>
              </li>
            ))}</ol>
          </div><div className="dr-rail-progress" aria-hidden="true"><i/></div></div></div>
        </Sec>

        <Sec
          kicker="TEAM"
          title="The team has taped out together before,"
          em="which is the only thing that helps on a shuttle with no respin."
          copy="RTL, verification, physical design, analog and software under one roof in Hyderabad."
        >
          <ExplainedGrid items={team} cols={3}/>
        </Sec>

        <Sec
          kicker="INVESTORS"
          title="The plan is concentrated by design,"
          em="and every figure below is a target, not a result."
          copy="DeepGrid is a private company and this page carries only material cleared for publication. Nothing here is audited, and nothing here is contracted revenue."
        >
          <DataTable caption="Revenue build and addressable market (company plan)" head={['Year or line', 'Plan figure']} rows={revenueBuild} wide/>
          <p className="disclaimer">Plan targets prepared by the company. Not audited, not reviewed by a third party, and not contracted revenue. Market sizes apply our own segment definition to published import statistics.</p>
        </Sec>

        <Sec
          kicker="STRUCTURAL POSITION"
          title="Four of the five moats are policy, not technology,"
          em="which is why a mature node is the right place to stand."
          copy="Each one is a published instrument with a date or a list attached, rather than an advantage that has to be argued."
        >
          <ExplainedGrid items={moats} cols={2}/>
        </Sec>

        <Sec
          kicker="RISK MANAGEMENT"
          title="Four stop rules are written before they are needed,"
          em="because the expensive decision is the one taken after a mask set is committed."
          copy="Each names the trigger and the action, so the decision is not re-argued under pressure."
        >
          <DataTable caption="Stop rules" head={['Rule', 'Trigger and action']} rows={stopRules} wide/>
        </Sec>

        <Sec
          kicker="USE OF FUNDS"
          title="60% of a ₹10 Cr raise goes to silicon and the people who make it,"
          em="and 10% to going to market."
          copy="Factory runs, mask sets and engineering staff are the two largest lines, in that order."
        >
          <DataTable caption="Use of funds (₹10 Cr)" head={['Line', 'Amount', 'What it buys']} rows={fundsAllocation} wide/>
        </Sec>

        <div className="dr-notclaimed">
          <p className="dr-kicker">WHAT THIS PAGE DOES NOT CLAIM</p>
          <ul>{companyNotClaimed.map(n => <li key={n}>{n}</li>)}</ul>
        </div>
        <p className="disclaimer">{PRE_SILICON}</p>

        <div className="dr-links dr-sec-gap">
          <button className="primary" onClick={() => go('contact')}>Discuss your application <ArrowUpRight size={17}/></button>
          <button className="text-link" onClick={() => go('evidence')}>How every figure on this site is evidenced <ArrowUpRight size={16}/></button>
          <button className="text-link" onClick={() => go('procurement')}>Procurement position and roadmap <ArrowUpRight size={16}/></button>
          <button className="text-link" onClick={() => go('resources')}>Whitepapers, datasheets and films <ArrowUpRight size={16}/></button>
        </div>
      </section>
    </Shell>
  );
}
