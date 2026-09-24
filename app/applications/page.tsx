'use client';

import {Shell} from '../shell';
import {SectionHead} from '../detail';
import ApplicationsStory from '../applications-story';
import {PRE_SILICON} from '../copy';
import Related from '../related';

export default function Page() {
  return (
    <Shell route="applications">
      <section className="page-wrap">
        <SectionHead
          tag="03 / APPLICATIONS"
          title="What the drive can diagnose on its own controller"
          copy="Thirty condition-monitoring tasks, told from what they catch to what they cost, with the narrated films at the moments that explain them. Every figure is from the DG32-AI use-case playbook and is derived, not measured."
        />
        <ApplicationsStory/>
        <p className="disclaimer">{PRE_SILICON}</p>
      <Related route="applications"/>
      </section>
    </Shell>
  );
}
