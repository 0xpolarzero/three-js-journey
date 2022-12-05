import CustomEffect from './CustomEffect';
import { forwardRef } from 'react';

export default forwardRef(function Affected(props, ref) {
  const effect = new CustomEffect(props);

  return <primitive ref={ref} object={effect} />;
});
