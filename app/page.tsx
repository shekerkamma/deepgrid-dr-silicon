'use client';

import {Shell, useReduced, useNav} from './shell';
import {Overview} from './overview';
import Related from './related';

export default function Home() {
  const reduced = useReduced();
  const {navigate, go} = useNav();
  return (
    <Shell route="home">
      <Overview reduced={reduced} navigate={navigate} go={go}/>
    <section className="page-wrap"><Related route="home"/></section>
    </Shell>
  );
}
