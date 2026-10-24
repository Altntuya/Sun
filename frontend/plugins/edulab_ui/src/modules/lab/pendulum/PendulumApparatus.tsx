import { useEffect, useRef, useState } from 'react';
import { LENGTH_RANGE, idealPeriod } from '@/lab/pendulum/pendulum';

const PIVOT = { x: 160, y: 20 };
const MAX_STRING_PX = 220;
const AMPLITUDE_RAD = 0.35;

// Swings in real time at the true period, so a longer string visibly slows
// down while a heavier bob does not.
export const PendulumApparatus = ({
  length,
  mass,
}: {
  length: number;
  mass: number;
}) => {
  const [angle, setAngle] = useState(AMPLITUDE_RAD);
  const startRef = useRef(performance.now());
  const period = idealPeriod(length);

  useEffect(() => {
    startRef.current = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = (now - startRef.current) / 1000;

      setAngle(AMPLITUDE_RAD * Math.cos((2 * Math.PI * t) / period));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [period]);

  const stringPx = (length / LENGTH_RANGE.max) * MAX_STRING_PX;
  const bob = {
    x: PIVOT.x + stringPx * Math.sin(angle),
    y: PIVOT.y + stringPx * Math.cos(angle),
  };
  const radius = 8 + mass * 14;

  return (
    <svg
      viewBox="0 0 320 280"
      className="w-full max-w-sm text-foreground"
      role="img"
      aria-label={`Дүүжин: урт ${length} м, масс ${mass} кг`}
    >
      <line
        x1="100"
        y1={PIVOT.y}
        x2="220"
        y2={PIVOT.y}
        stroke="currentColor"
        strokeWidth="4"
      />
      <line
        x1={PIVOT.x}
        y1={PIVOT.y}
        x2={PIVOT.x}
        y2={PIVOT.y + stringPx}
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeDasharray="4 4"
      />
      <line
        x1={PIVOT.x}
        y1={PIVOT.y}
        x2={bob.x}
        y2={bob.y}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx={bob.x} cy={bob.y} r={radius} className="fill-primary" />
      <text x="10" y="270" className="fill-current text-xs">
        L = {length.toFixed(1)} м · m = {mass.toFixed(2)} кг
      </text>
    </svg>
  );
};
