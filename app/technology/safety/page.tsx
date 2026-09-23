'use client';

import {ArrowUpRight} from 'lucide-react';
import {Shell, useNav} from '../../shell';
import {SectionHead} from '../../detail';
import {faultPath} from '../../detail-content';
import {PRE_SILICON} from '../../copy';
import FaultTrace from '../../fault-trace';
import Related from '../../related';

export default function Page() {
  const {href, go} = useNav();
  return (
    <Shell route="safety">
      <section className="page-wrap">
        <SectionHead
          tag="02.1 / SAFETY"
          title="From a wrong value to a safe bridge"
          copy="Software self-test runs periodically and cannot see a fault between runs. DG32-LITE compares every value the CPU commits, as it commits it, and the path from mismatch to a switched-off bridge never passes through firmware."
        />
        <FaultTrace steps={faultPath} intro={
          <>
            <h2 className="dr-h2">Two paths cross the die,<br/><em>and only one is firmware.</em></h2>
            <p className="dr-lead">A trailing checker core compares every committed store. A mismatch trips the FAULT pin and disables the PWM bridge in 39 cycles, on a path with no software in it.</p>
            <p className="dr-lead">Firmware can still prove the path works: a locked injection register fires it on purpose, which is the only way to test it on real silicon.</p>
            <div className="dr-links">
              <a className="text-link" href={href('architecture?block=0')}>Inside the safety core <ArrowUpRight size={16} aria-hidden="true"/></a>
              <a className="text-link" href={href('control')}>Control-loop timing <ArrowUpRight size={16} aria-hidden="true"/></a>
              <a className="text-link" href={href('evidence')}>What backs the 39 cycles <ArrowUpRight size={16} aria-hidden="true"/></a>
            </div>
          </>
        }/>
        <p className="disclaimer">{PRE_SILICON}</p>
      <Related route="safety"/>
      </section>
    </Shell>
  );
}
