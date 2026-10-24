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

const chartConfig = {
  current: { label: 'Хэмжсэн I (А)', color: 'var(--primary)' },
};

// Plotting the measured current against U/R puts every correct measurement on
// the y = x line, so the law is visible no matter which U and R were chosen.
export const OhmsLawChart = ({
  measurements,
}: {
  measurements: LabMeasurement[];
}) => {
  const points = measurements.map(({ voltage, resistance, current }) => ({
    ratio: Math.round((voltage / resistance) * 100) / 100,
    current,
  }));
  const max = Math.ceil(
    Math.max(1, ...points.flatMap((point) => [point.ratio, point.current])),
  );

  return (
    <ChartContainer config={chartConfig} className="h-56 w-full">
      <ScatterChart margin={{ top: 10, right: 16, bottom: 20, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="ratio"
          name="U/R"
          domain={[0, max]}
          label={{ value: 'U / R', position: 'insideBottom', offset: -10 }}
        />
        <YAxis
          type="number"
          dataKey="current"
          name="I"
          domain={[0, max]}
          label={{ value: 'I (А)', angle: -90, position: 'insideLeft' }}
        />
        <ReferenceLine
          segment={[
            { x: 0, y: 0 },
            { x: max, y: max },
          ]}
          stroke="var(--muted-foreground)"
          strokeDasharray="4 4"
        />
        <Scatter data={points} fill="var(--primary)" />
      </ScatterChart>
    </ChartContainer>
  );
};
