'use client';

import {Shell, useReduced, useNav} from './shell';
import {ImprovedOverview} from './ImprovedOverview';

export default function Home() {
  const reduced = useReduced();
  const {navigate, go} = useNav();
  return (
    <Shell route="home">
      <ImprovedOverview reduced={reduced} navigate={navigate} go={go}/>
    </Shell>
  );
}
