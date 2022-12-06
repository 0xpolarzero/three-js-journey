import { Level } from './components/Level.js';
import { Player } from './components/Player.js';
import { Lights } from './components/Lights.js';
import useGame from './stores/useGame';
import { Debug, Physics } from '@react-three/rapier';
import { Effects } from './systems/Effects.js';

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);

  return (
    <>
      {/* <OrbitControls makeDefault /> */}
      <color attach='background' args={['#131313']} />

      <Physics>
        {/* <Debug /> */}
        <Lights />
        <Level count={blocksCount} seed={blocksSeed} />
        <Player />
        <Effects />
      </Physics>
    </>
  );
}
