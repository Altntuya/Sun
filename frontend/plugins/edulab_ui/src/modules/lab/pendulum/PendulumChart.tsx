import { ChartContainer } from 'erxes-ui';
import {
  CartesianGrid,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from 'recharts';
import { LabMeasurement } from '@/lab/types';
import { G } from '@/lab/pendulum/pendulum';

const chartConfig = {
  period: { label: 'Хэмжсэн T (с)', color: 'var(--primary)' },
};

const SLOPE = (2 * Math.PI) / Math.sqrt(G);

// T plotted against √L lies on a straight line through the origin whatever
// the mass, so both the √L law and the mass independence show at a glance.
export const PendulumChart = ({
  measurements,
}: {
  measurements: LabMeasurement[];
}) => {
  const points = measurements.map(({ length, period }) => ({
    rootLength: Math.round(Math.sqrt(length) * 100) / 100,
    period,
  }));
  const maxX = Math.ceil(Math.max(1, ...points.map((p) => p.rootLength)) * 10) / 10;
  const maxY = Math.ceil(Math.max(SLOPE * maxX, ...points.map((p) => p.period)));

  return (
    <ChartContainer config={chartConfig} className="h-56 w-full">
      <ScatterChart margin={{ top: 10, right: 16, bottom: 20, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="rootLength"
          name="√L"
          domain={[0, maxX]}
          label={{ value: '√L (√м)', position: 'insideBottom', offset: -10 }}
        />
        <YAxis
          type="number"
          dataKey="period"
          name="T"
          domain={[0, maxY]}
          label={{ value: 'T (с)', angle: -90, position: 'insideLeft' }}
        />
        <ReferenceLine
          segment={[
            { x: 0, y: 0 },
            { x: maxX, y: SLOPE * maxX },
          ]}
          stroke="var(--muted-foreground)"
          strokeDasharray="4 4"
        />
        <Scatter data={points} fill="var(--primary)" />
      </ScatterChart>
    </ChartContainer>
  );
};
