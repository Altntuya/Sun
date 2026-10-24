// One recorded reading: variable key → value, e.g. { length: 0.5, period: 1.42 }.
export type LabMeasurement = Record<string, number>;

export interface ILabVariable {
  key: string;
  label: string;
  unit: string;
  // Readings are positive unless the variable can legitimately be zero.
  allowZero?: boolean;
}

export interface ILabDefinition {
  key: string;
  title: string;
  variables: ILabVariable[];
  // Facts are computed here, not by the model, so the grader judges the
  // student's conclusion against numbers that are guaranteed to be right.
  describeFacts: (measurements: LabMeasurement[]) => string[];
}
