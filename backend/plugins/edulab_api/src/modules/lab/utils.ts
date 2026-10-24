import { LabMeasurement } from '@/lab/types';

export const round = (value: number, digits = 2) =>
  Math.round(value * 10 ** digits) / 10 ** digits;

export const percentOff = (measured: number, expected: number) =>
  round((Math.abs(measured - expected) / expected) * 100, 1);

export const distinct = (measurements: LabMeasurement[], key: string) => [
  ...new Set(measurements.map((m) => m[key])),
];

// True when, among readings that share `fixedKey`, `outKey` strictly rises
// (or falls) as `inKey` rises. Groups with a single reading are ignored.
export const trendWithin = (
  measurements: LabMeasurement[],
  fixedKey: string,
  inKey: string,
  outKey: string,
  direction: 'up' | 'down',
): boolean | undefined => {
  const groups = new Map<number, LabMeasurement[]>();

  for (const m of measurements) {
    groups.set(m[fixedKey], [...(groups.get(m[fixedKey]) ?? []), m]);
  }

  const comparable = [...groups.values()].filter(
    (group) => distinct(group, inKey).length > 1,
  );

  if (!comparable.length) {
    return undefined;
  }

  return comparable.every((group) => {
    const sorted = [...group].sort((a, b) => a[inKey] - b[inKey]);

    return sorted.every(
      (m, i) =>
        i === 0 ||
        (direction === 'up'
          ? m[outKey] > sorted[i - 1][outKey]
          : m[outKey] < sorted[i - 1][outKey]),
    );
  });
};
