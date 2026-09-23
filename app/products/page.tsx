'use client';

import {Shell, useNav} from '../shell';
import {PRE_SILICON} from '../copy';
import {ArrowRight,ArrowUpRight,Check} from 'lucide-react';
import {DataTable,ExplainedGrid,Sec,SectionHead} from '../detail';
import {familyCompare} from '../detail-content';
import {parts} from '../content';
import Architecture from '../architecture';

// The two architecture posters already exist in public/media. The comparison page had no imagery
// at all, which made two chips that share a footprint read as two spec lists.
const partPosters: Record<string, string> = {
  lite: '/media/dg32-lite-architecture-poster.jpg',
  '2dom': '/media/dg32-2dom-architecture-poster.jpg',
};

export default function Page() {
  const {navigate, go} = useNav();
  return (
    <Shell route="products">
      <section className="page-wrap"><SectionHead tag="02 / PRODUCT FAMILY" title="One footprint, two chips" copy="DG32-LITE is the motor-control SoC. DG32-2DOM keeps every pin and peripheral and adds an INT8 attention engine, so a board designed for one takes the other."/>
  <div className="dr-parts">{parts.map(p=><article className="dr-part" key={p.id}><figure className="dr-part-media"><img src={partPosters[p.id]} alt={`${p.name} architecture diagram`} loading="lazy" decoding="async" width={800} height={450}/><figcaption className="mono">{p.name} · ARCHITECTURE</figcaption></figure><div className="dr-part-head"><span className="mono">{p.id==='lite'?'PART 01':'PART 02'} / {p.tagline.toUpperCase()}</span><h2>{p.name}</h2><span className="dr-status"><i/>{p.status}</span><p>{p.summary}</p></div><dl className="dr-specs">{p.specs.map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>{p.adds.length>0&&<div className="dr-adds"><span className="mono">WHAT THE ENGINE IS FOR</span><ul>{p.adds.map(a=><li key={a}><Check size={15}/>{a}</li>)}</ul></div>}<div className="dr-part-links"><button className="primary" onClick={()=>go('architecture'+(p.id==='lite'?'':'?chip=2dom'))}>Inside the architecture <ArrowUpRight size={17}/></button><button className="text-link" onClick={()=>go('library?pkg='+p.id)}>Architecture deck and film <ArrowRight size={16}/></button><button className="text-link" onClick={()=>go('library?pkg='+p.id+'-datasheet')}>Datasheet deck and film <ArrowRight size={16}/></button></div></article>)}</div>
  <p className="disclaimer">{PRE_SILICON} The ~0.43 W power figure is a vectorless tool estimate at 25 °C and 1.8 V.</p>
  <Sec kicker="CHIP COMPARISON" title="What stays identical," em="and what does DG32-2DOM add?" copy="Everything outside the engine is the same design from the same source, which is why a DG32-LITE board takes DG32-2DOM unchanged and the control-loop budget carries over exactly.">
   <DataTable caption="DG32-LITE and DG32-2DOM compared" head={['Area','DG32-LITE','DG32-2DOM']} rows={familyCompare} wide/>
  </Sec>
  <Sec kicker="WHICH CHIP FOR YOUR DRIVE?" title="Same board, same firmware base," em="one added capability.">
   <ExplainedGrid cols={2} items={[
    {name:'Choose DG32-LITE',what:'For a drive that needs hardware lockstep safety, hardware FOC acceleration and native DShot in a 64-pin part.',why:'It is the first-silicon part: on the September 2026 shuttle, with bring-up measuring the loop costs, fault latency and timing it was designed to.'},
    {name:'Choose DG32-2DOM',what:'For a drive that should also watch its own motor: bearing-fault or anomaly detection on phase-current data, without a second processor.',why:'The engine runs on its own clock behind bridges, so condition monitoring cannot extend the control core’s worst-case execution time. Design complete, in physical trials.'},
   ]}/>
   <div className="dr-links dr-sec-gap">
     <button className="text-link" onClick={()=>navigate('architecture')}>Explore the architecture <ArrowUpRight size={16}/></button>
     <button className="text-link" onClick={()=>navigate('control')}>100 kHz control-loop budget <ArrowUpRight size={16}/></button>
     <button className="text-link" onClick={()=>navigate('pinout')}>QFN-64 package & electrical limits <ArrowUpRight size={16}/></button>
     <button className="text-link" onClick={()=>go('library')}>Official datasheets & publication PDFs <ArrowUpRight size={16}/></button>
     <button className="text-link" onClick={()=>go('ask')}>Query DG32-2DOM in Ask DeepGrid <ArrowUpRight size={16}/></button>
   </div>
  </Sec>
 </section>
    </Shell>
  );
}
