import { VOLTAGE_RANGE } from '@/lab/ohms-law/ohmsLaw';

const MAX_GLOW_CURRENT = VOLTAGE_RANGE.max;

export const OhmsLawCircuit = ({
  voltage,
  resistance,
  current,
}: {
  voltage: number;
  resistance: number;
  current: number;
}) => {
  const glow = Math.min(current / MAX_GLOW_CURRENT, 1);

  return (
    <svg
      viewBox="0 0 360 200"
      className="w-full max-w-md text-foreground"
      role="img"
      aria-label={`Хэлхээ: ${voltage} В, ${resistance} Ом, ${current} А`}
    >
      <path
        d="M60 40 H300 V160 H60 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      <g transform="translate(60 100)">
        <rect x="-18" y="-30" width="36" height="60" className="fill-background" />
        <line x1="-14" y1="-8" x2="14" y2="-8" stroke="currentColor" strokeWidth="3" />
        <line x1="-8" y1="8" x2="8" y2="8" stroke="currentColor" strokeWidth="3" />
        <text x="-24" y="4" textAnchor="end" className="fill-current text-xs">
          {voltage} В
        </text>
      </g>

      <g transform="translate(180 40)">
        <rect
          x="-36"
          y="-12"
          width="72"
          height="24"
          rx="3"
          className="fill-background"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text y="5" textAnchor="middle" className="fill-current text-xs">
          R = {resistance} Ом
        </text>
      </g>

      <g transform="translate(300 100)">
        <circle r="22" className="fill-background" stroke="currentColor" strokeWidth="2" />
        <text y="5" textAnchor="middle" className="fill-current text-sm font-semibold">
          A
        </text>
        <text x="30" y="5" className="fill-current text-xs">
          {current.toFixed(2)} А
        </text>
      </g>

      <g transform="translate(180 160)">
        <circle
          r="16"
          className="fill-warning"
          opacity={0.15 + glow * 0.85}
        />
        <circle r="16" fill="none" stroke="currentColor" strokeWidth="2" />
        <text y="36" textAnchor="middle" className="fill-current text-xs">
          Гэрэл
        </text>
      </g>
    </svg>
  );
};
