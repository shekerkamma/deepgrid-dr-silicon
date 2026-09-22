'use client';

import {useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {Shell, useReduced, useNav} from '../../shell';
import {SectionHead, Eyebrow} from '../../detail';
import {PRE_SILICON} from '../../copy';
import Silicon from '../../silicon';

export default function Page() {
  const reduced = useReduced();
  const {href} = useNav();
  const [exploded, setExploded] = useState(true);
  return (
    <Shell route="die">
      <section className="page-wrap">
        <SectionHead
          tag="02.3 / DIE EXPLORER"
          title="Six functional block groups, one frozen core"
          copy="Safety core, memory and boot, motor drive, sensing and math, connectivity, and the bus that ties them together. The safety core is closed until silicon test; everything outside it is configurable per SKU."
        />
        <section className="silicon-teaser">
          <div>
            <Eyebrow>THE DIE</Eyebrow>
            <h2>Drag to rotate.<br/><em>Every group is a link.</em></h2>
            <p>This is an illustrative model, not a mask layout. It shows where each functional group sits and how they relate, which is what a board designer needs before the datasheet.</p>
            <div className="dr-links">
              <a className="text-link" href={href('architecture')}>Block-by-block architecture <ArrowUpRight size={16} aria-hidden="true"/></a>
              <a className="text-link" href={href('pinout')}>Pinout &amp; package <ArrowUpRight size={16} aria-hidden="true"/></a>
            </div>
            <button className="primary" onClick={() => setExploded(v => !v)}>
              {exploded ? 'Collapse the assembly' : 'Explode the assembly'} <ArrowUpRight size={18} aria-hidden="true"/>
            </button>
          </div>
          <div className="teaser-canvas">
            <Silicon variant="lite" reduced={reduced} exploded={exploded} selected={2}/>
            <span className="canvas-caption">{exploded ? 'EXPLODED ASSEMBLY' : 'ASSEMBLED'} · DRAG TO ROTATE &amp; PITCH</span>
          </div>
        </section>
        <p className="disclaimer">{PRE_SILICON}</p>
      </section>
    </Shell>
  );
}
