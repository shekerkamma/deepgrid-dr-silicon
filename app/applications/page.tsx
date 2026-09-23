'use client';

import {Shell} from '../shell';
import {SectionHead} from '../detail';
import {ApplicationsCatalog} from '../applications-catalog';
import {PRE_SILICON} from '../copy';

export default function Page() {
  return (
    <Shell route="applications">
      <section className="page-wrap">
        <SectionHead
          tag="03 / APPLICATIONS"
          title="The diagnostic catalogue"
          copy="Condition-monitoring tasks that run on the motor-control core itself, with no external coprocessor. Filter the collection by domain; every task carries the same label."
        />
        <ApplicationsCatalog/>
        <p className="disclaimer">{PRE_SILICON}</p>
      </section>
    </Shell>
  );
}
