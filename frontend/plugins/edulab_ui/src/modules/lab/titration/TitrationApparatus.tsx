import { BURETTE_CAPACITY } from '@/lab/titration/titration';

const BURETTE = { x: 142, top: 20, height: 190, width: 16 };
const TICKS = [0, 10, 20, 30, 40, 50];

// Burette above an Erlenmeyer flask. `dropKey` changes whenever base is added
// so a falling drop replays.
export const TitrationApparatus = ({
  baseVolume,
  acidVolume,
  ph,
  fill,
  dropKey,
}: {
  baseVolume: number;
  acidVolume: number;
  ph: number;
  fill: string;
  dropKey: number;
}) => {
  const used = Math.min(baseVolume / BURETTE_CAPACITY, 1);
  const liquidTop = BURETTE.top + used * BURETTE.height;
  // More liquid in the flask raises its level a little.
  const flaskLevel = 330 - Math.min((acidVolume + baseVolume) / 120, 1) * 50;

  return (
    <svg
      viewBox="0 0 300 380"
      className="w-full max-w-xs text-foreground"
      role="img"
      aria-label={`Титрлэлт: ${baseVolume} мл NaOH нэмсэн, pH ${ph.toFixed(2)}`}
    >
      {/* stand */}
      <rect x="40" y="370" width="220" height="6" rx="2" className="fill-muted-foreground/40" />
      <rect x="60" y="10" width="6" height="362" className="fill-muted-foreground/40" />
      <rect x="60" y="120" width="82" height="5" className="fill-muted-foreground/40" />

      {/* burette */}
      <rect
        x={BURETTE.x}
        y={BURETTE.top}
        width={BURETTE.width}
        height={BURETTE.height}
        rx="3"
        className="fill-background"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x={BURETTE.x + 2}
        y={liquidTop}
        width={BURETTE.width - 4}
        height={BURETTE.top + BURETTE.height - liquidTop}
        fill="rgb(191 219 254 / 0.8)"
      />
      {TICKS.map((tick) => {
        const y = BURETTE.top + (tick / BURETTE_CAPACITY) * BURETTE.height;

        return (
          <g key={tick}>
            <line
              x1={BURETTE.x + BURETTE.width}
              x2={BURETTE.x + BURETTE.width + 6}
              y1={y}
              y2={y}
              stroke="currentColor"
            />
            <text x={BURETTE.x + BURETTE.width + 9} y={y + 3} className="fill-current text-[9px]">
              {tick}
            </text>
          </g>
        );
      })}
      <text x={BURETTE.x - 6} y={BURETTE.top + 12} textAnchor="end" className="fill-current text-[10px]">
        NaOH
      </text>
      {/* stopcock and tip */}
      <rect
        x={BURETTE.x - 6}
        y="212"
        width="28"
        height="6"
        rx="2"
        className="fill-muted-foreground"
      />
      <path d={`M${BURETTE.x + 5} 218 L${BURETTE.x + 7} 240 L${BURETTE.x + 9} 240 L${BURETTE.x + 11} 218 Z`} fill="currentColor" />

      {dropKey > 0 && (
        <circle
          key={dropKey}
          cx={BURETTE.x + 8}
          cy="244"
          r="3"
          fill="rgb(147 197 253)"
          opacity="0"
        >
          <animate attributeName="cy" from="244" to="314" dur="0.45s" fill="freeze" />
          <animate attributeName="opacity" values="1;1;0" dur="0.45s" fill="freeze" />
        </circle>
      )}

      {/* Erlenmeyer flask */}
      <defs>
        <clipPath id="edulab-flask">
          <path d="M130 262 L130 292 L92 362 Q90 368 97 368 L203 368 Q210 368 208 362 L170 292 L170 262 Z" />
        </clipPath>
      </defs>
      <rect
        x="85"
        y={flaskLevel}
        width="130"
        height={370 - flaskLevel}
        fill={fill}
        clipPath="url(#edulab-flask)"
        className="transition-colors duration-500"
      />
      <path
        d="M130 262 L130 292 L92 362 Q90 368 97 368 L203 368 Q210 368 208 362 L170 292 L170 262"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <text x="150" y="356" textAnchor="middle" className="fill-current text-[10px]">
        HCl {acidVolume} мл
      </text>
    </svg>
  );
};
