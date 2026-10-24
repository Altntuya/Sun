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
import { isAtEndpoint } from '@/lab/titration/titration';

const chartConfig = {
  valid: { label: 'Зөв цэгт зогссон', color: 'var(--primary)' },
  invalid: { label: 'Хэтрүүлсэн / хүрээгүй', color: 'var(--destructive)' },
};

// Acid concentration computed from each trial; trials stopped at the wrong
// point stand out in red, and the dashed line is the mean of the good ones.
export const TitrationChart = ({
  measurements,
}: {
  measurements: LabMeasurement[];
}) => {
  const points = measurements.map((m, index) => ({
    trial: index + 1,
    concentration:
      Math.round(((m.baseConcentration * m.baseVolume) / m.acidVolume) * 10000) /
      10000,
    valid: isAtEndpoint(m.finalPh, m.overshoot ?? 0),
  }));
  const valid = points.filter((point) => point.valid);
  const mean = valid.length
    ? valid.reduce((sum, point) => sum + point.concentration, 0) / valid.length
    : undefined;

  return (
    <ChartContainer config={chartConfig} className="h-56 w-full">
      <ScatterChart margin={{ top: 10, right: 16, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="trial"
          domain={[0, points.length + 1]}
          allowDecimals={false}
          label={{ value: 'Туршилт', position: 'insideBottom', offset: -10 }}
        />
        {/* ±2% around the data: wide enough that repeat trials agreeing to
            0.0001 M sit together, narrow enough to show an overshot trial. */}
        <YAxis
          type="number"
          dataKey="concentration"
          domain={[
            (min: number) => Math.floor(min * 0.98 * 1000) / 1000,
            (max: number) => Math.ceil(max * 1.02 * 1000) / 1000,
          ]}
          tickFormatter={(value: number) => value.toFixed(3)}
          width={56}
          label={{
            value: 'C(HCl), М',
            angle: -90,
            position: 'left',
            offset: 4,
          }}
        />
        {mean !== undefined && (
          <ReferenceLine
            y={mean}
            stroke="var(--muted-foreground)"
            strokeDasharray="4 4"
          />
        )}
        <Scatter data={valid} fill="var(--primary)" />
        <Scatter
          data={points.filter((point) => !point.valid)}
          fill="var(--destructive)"
        />
      </ScatterChart>
    </ChartContainer>
  );
};
