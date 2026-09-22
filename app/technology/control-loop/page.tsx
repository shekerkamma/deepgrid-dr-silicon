'use client';

import {Shell, useNav} from '../../shell';
import {ControlLoop} from '../../package-control';

export default function Page() {
  const {navigate} = useNav();
  return (
    <Shell route="control">
      <ControlLoop go={navigate}/>
    </Shell>
  );
}
