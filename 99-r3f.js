// useControls - leva (great UI)
// see https://codesandbox.io/s/layer-materials-nvup4?file=/src/App.js

// ! React
// * useMemo
// Pass a function and an array of dependencies. useMemo will only recompute
// the memoized value when one of the dependencies has changed.
// Kind of like a cache, in the shape of useEffect
// If the component rerenders, but the values in the array are the same, it will not recompute the value
const colors = useMemo(() => {
  const colors = [];
  for (let i = 0; i < clickersCount; i++)
    colors.push(`hsl(${Math.random() * 360}deg, 100%, 75%)`);

  return colors;
}, []);
// -> the component can be rerendered, but the colors will not be recomputed

// * useRef
// Creare a reference to a DOM element
const Clicker = ({ color }) => {
  const buttonRef = useRef();
  return (
    <button
      ref={buttonRef}
      // ...
    />
  );
};
// Use it
// ...
useEffect(() => {
  buttonRef.current.focus();
}, []);
