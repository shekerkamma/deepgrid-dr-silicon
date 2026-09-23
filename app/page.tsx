'use client';

import {Shell, useReduced, useNav} from './shell';
import {Overview} from './overview';

export default function Home() {
  const reduced = useReduced();
  const {navigate, go} = useNav();
  return (
    <Shell route="home">
      <Overview reduced={reduced} navigate={navigate} go={go}/>
    </Shell>
  );
}
