'use client';

import {Shell, useReduced} from '../../shell';
import {DieStage} from '../../die-stage';

export default function Page() {
  const reduced = useReduced();
  return (
    <Shell route="die">
      <section className="page-wrap">
        <DieStage reduced={reduced}/>
      </section>
    </Shell>
  );
}
