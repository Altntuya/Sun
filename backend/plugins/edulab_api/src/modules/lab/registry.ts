import { ohmsLaw } from '@/lab/ohmsLaw';
import { pendulum } from '@/lab/pendulum';
import { titration } from '@/lab/titration';
import { ILabDefinition, LabMeasurement } from '@/lab/types';

// A new simulation is one file here plus its component in edulab_ui.
const LABS: ILabDefinition[] = [ohmsLaw, pendulum, titration];

export const LAB_KEYS = LABS.map((lab) => lab.key);

export const getLab = (key?: string): ILabDefinition => {
  const lab = LABS.find((item) => item.key === key);

  if (!lab) {
    throw new Error(`Unknown lab simulation "${key}"`);
  }

  return lab;
};

export const validateMeasurements = (
  lab: ILabDefinition,
  measurements: LabMeasurement[] = [],
) => {
  if (!measurements.length) {
    throw new Error('Дор хаяж нэг хэмжилт хийнэ үү');
  }

  for (const measurement of measurements) {
    for (const { key, label, allowZero } of lab.variables) {
      const value = measurement?.[key];
      const tooSmall = allowZero ? value < 0 : value <= 0;

      if (typeof value !== 'number' || !Number.isFinite(value) || tooSmall) {
        throw new Error(
          `${label} ${allowZero ? 'сөрөг биш' : 'эерэг'} тоо байх ёстой`,
        );
      }
    }
  }

  // Keep only the lab's own variables.
  return measurements.map((measurement) =>
    Object.fromEntries(lab.variables.map(({ key }) => [key, measurement[key]])),
  );
};

export const describeMeasurements = (
  labKey: string | undefined,
  measurements: LabMeasurement[] = [],
) => {
  if (!measurements.length) {
    return 'Сурагч ямар ч хэмжилт хийгээгүй.';
  }

  const lab = getLab(labKey);

  return [`Хэмжилтийн тоо: ${measurements.length}.`, ...lab.describeFacts(measurements)].join('\n');
};
