'use client';

import {Shell} from './shell';
import {HomeSurface} from './home-surface';

export default function Home() {
  return (
    <Shell route="home">
      <HomeSurface/>
    </Shell>
  );
}
