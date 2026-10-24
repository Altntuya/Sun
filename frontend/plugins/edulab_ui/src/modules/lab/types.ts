import { ComponentType } from 'react';

// One recorded reading: variable key → value, e.g. { length: 0.5, period: 1.42 }.
export type LabMeasurement = Record<string, number>;

export interface ILabVariable {
  key: string;
  label: string;
  unit: string;
  digits: number;
}

export interface ILabDefinition {
  key: string;
  label: string;
  variables: ILabVariable[];
  Simulation: ComponentType<{
    measurements: LabMeasurement[];
    onChange: (measurements: LabMeasurement[]) => void;
  }>;
  Chart: ComponentType<{ measurements: LabMeasurement[] }>;
  hint: string;
}
