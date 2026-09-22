'use client';

import {Shell, useReduced, useQuery, useNav} from '../shell';
import {ArrowUpRight,Check,Download} from 'lucide-react';
import {DataTable,ExplainedGrid,Eyebrow,Sec,SectionHead} from '../detail';
import {notClaimed,positionNotes,procurementScorecard,roadmapDetail} from '../detail-content';
import {comparison,gaps,leads} from '../content';

export default function Page() {
  const {navigate, go} = useNav();

  return (
    <Shell route="procurement">
      <section className="page-wrap"><SectionHead tag="06 / POSITION & ROADMAP" title="Where DG32 leads, and where it does not yet" copy="Measured against the STM32G0, the incumbent entry-level motor-control MCU. DG32 wins on safety hardware and control acceleration; the G0 wins on analog, memory and maturity."/>
  <div className="table-scroll"><table className="dr-table dr-compare"><caption>DG32-LITE compared with the STM32G0 series</caption><thead><tr><th scope="col">Dimension</th><th scope="col">DG32-LITE</th><th scope="col">STM32G0 series</th><th scope="col">What it means</th></tr></thead><tbody>{comparison.map(([d,a,b,m])=><tr key={d}><th scope="row">{d}</th><td>{a}</td><td>{b}</td><td>{m}</td></tr>)}</tbody></table></div>
  <p className="disclaimer">STM32G0 column: public datasheet values for the STM32G0x1 / G0B1 family (Arm Cortex-M0+). DG32-LITE column: first-silicon design values, verified in simulation and static timing, not yet measured on silicon.</p>

  {/* Executive Procurement Scorecard */}
  <Sec kicker="EXECUTIVE PROCUREMENT SCORECARD" title="Strategic Sourcing & Sovereignty" em="Benchmarked against imported incumbents." copy="Executive assessment for automotive OEMs, drone manufacturers, and defense procurement teams evaluating DG32 against STM32G0, TI Hercules, and Infineon AURIX.">
    <DataTable caption="Executive Procurement Scorecard: DeepGrid vs Incumbents" head={['Strategic Dimension', 'DeepGrid Semi', 'Western Incumbents', 'Executive Takeaway']} rows={procurementScorecard} wide/>
  </Sec>
  <div className="dr-leadgap"><div><Eyebrow>WHERE DG32 LEADS</Eyebrow><ul>{leads.map(l=><li key={l}><Check size={15}/>{l}</li>)}</ul></div><div><Eyebrow>WHERE THE G0 LEADS TODAY</Eyebrow><ul>{gaps.map(l=><li key={l}><span className="dr-dash" aria-hidden="true"/>{l}</li>)}</ul></div></div>
  <Sec kicker="WHY THE DIFFERENCE?" title="Why does each gap exist," em="and why does it close in this order?">
   <ExplainedGrid items={positionNotes} cols={2}/>
  </Sec>
  <Sec kicker="THE MULTI-SPIN ROADMAP" title="Closing the gaps" em="in deliberate order." copy="Each step has a job: first silicon proves the architecture, the second spin closes the largest gaps, and connectivity follows.">
   <div className="dr-rail"><div className="dr-rail-stage"><div className="dr-rail-track"><ol className="dr-roadmap">{roadmapDetail.map(([when,t,what,proves])=><li key={t}><span className="mono">{when}</span><h3>{t}</h3><p>{what}</p><p className="dr-proves"><span className="mono">WHAT IT DELIVERS</span>{proves}</p></li>)}</ol></div><div className="dr-rail-progress" aria-hidden="true"><i/></div></div></div>
  </Sec>
  <div className="dr-notclaimed"><p className="dr-kicker">WHAT THIS SITE DOES NOT CLAIM</p><ul>{notClaimed.map(n=><li key={n}>{n}</li>)}</ul></div>
  <div className="dr-links dr-sec-gap">
    <button className="text-link" onClick={()=>go('library')}>Download Master Whitepaper (71-Page PDF) <ArrowUpRight size={16}/></button>
    <button className="text-link" onClick={()=>navigate('pinout')}>Review QFN-64 pinout & package <ArrowUpRight size={16}/></button>
    <button className="text-link" onClick={()=>navigate('control')}>Inspect 100 kHz control loop budget <ArrowUpRight size={16}/></button>
    <button className="text-link" onClick={()=>go('ask')}>Audit 10-SKU roadmap in Ask DeepGrid <ArrowUpRight size={16}/></button>
  </div>
 </section>
    </Shell>
  );
}
