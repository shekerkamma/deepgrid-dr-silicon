'use client';

import {Shell, useQuery, useNav} from '../shell';
import {SectionHead} from '../detail';
import Library from '../library';
import Related from '../related';

export default function Page() {
  const {go} = useNav();
  const [params, update] = useQuery();
  return (
    <Shell route="resources">
      <section className="page-wrap">
        <SectionHead
          tag="06 / DOCUMENTS & MEDIA"
          title="Authoritative documents, decks and films"
          copy="Complete publication PDFs, engineering specifications, client-ready PowerPoint decks, and narrated walkthrough films across the DG32 platform."
        />
        <Library
          pkgId={params.get('pkg') || 'lite'}
          slide={Number(params.get('slide')) || 1}
          onChange={update}
          go={go}
        />
      <Related route="resources"/>
      </section>
    </Shell>
  );
}
