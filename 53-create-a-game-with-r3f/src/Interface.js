import useGame from './stores/useGame';
import { addEffect } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';

export const Interface = () => {
  const time = useRef();

  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const leftward = useKeyboardControls((state) => state.leftward);
  const rightward = useKeyboardControls((state) => state.rightward);
  const jump = useKeyboardControls((state) => state.jump);

  const restart = useGame((state) => state.restart);
  const phase = useGame((state) => state.phase);

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState();
      let elapsedTime = 0;

      if (state.phase === 'playing') {
        elapsedTime = Date.now() - state.startTime;
      } else if (state.phase === 'ended') {
        elapsedTime = state.endTime - state.startTime;
      }

      elapsedTime = (elapsedTime / 1000).toFixed(2);
      time.current.textContent = elapsedTime;
    });

    return () => unsubscribeEffect();
  }, []);

  return (
    <div className='interface'>
      <div ref={time} className='time'>
        0.00
      </div>
      {phase === 'ended' ? (
        <div className='restart' onClick={restart}>
          Restart
        </div>
      ) : null}

      <div className='controls'>
        <div className='raw'>
          <div className={`key ${forward ? 'active' : ''}`}></div>
        </div>
        <div className='raw'>
          <div className={`key ${leftward ? 'active' : ''}`}></div>
          <div className={`key ${backward ? 'active' : ''}`}></div>
          <div className={`key ${rightward ? 'active' : ''}`}></div>
        </div>
        <div className='raw'>
          <div className={`key large ${jump ? 'active' : ''}`}></div>
        </div>
      </div>
    </div>
  );
};
