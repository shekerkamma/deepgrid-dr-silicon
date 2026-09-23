'use client';

import {Shell, useNav} from '../../shell';
import {ControlLoop} from '../../package-control';
import Related from '../../related';

export default function Page() {
  const {navigate} = useNav();
  return (
    <Shell route="control">
      <ControlLoop go={navigate}/>
    <section className="page-wrap"><Related route="control"/></section>
    </Shell>
  );
}
