import { ChartContainer } from 'erxes-ui';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  XAxis,
  YAxis,
} from 'recharts';
import { PINK_FROM_PH } from '@/lab/titration/titration';

const chartConfig = {
  ph: { label: 'pH', color: 'var(--primary)' },
};

// Live pH against added NaOH for the trial in progress; the shaded band is
// where phenolphthalein is pink.
export const TitrationCurve = ({
  points,
}: {
  points: { volume: number; ph: number }[];
}) => (
  <ChartContainer config={chartConfig} className="h-48 w-full">
    <LineChart data={points} margin={{ top: 8, right: 12, bottom: 16, left: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <ReferenceArea
        y1={PINK_FROM_PH}
        y2={14}
        fill="hsl(322 85% 70%)"
        fillOpacity={0.12}
      />
      <XAxis
        type="number"
        dataKey="volume"
        domain={[0, 'dataMax']}
        label={{ value: 'V(NaOH), мл', position: 'insideBottom', offset: -8 }}
      />
      <YAxis
        type="number"
        domain={[0, 14]}
        ticks={[0, 2, 4, 6, 8, 10, 12, 14]}
        label={{ value: 'pH', angle: -90, position: 'insideLeft' }}
      />
      <Line
        type="monotone"
        dataKey="ph"
        stroke="var(--primary)"
        strokeWidth={2}
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  </ChartContainer>
);
