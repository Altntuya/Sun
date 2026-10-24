export const VOLTAGE_RANGE = { min: 1, max: 12, step: 0.5 };
export const RESISTANCE_RANGE = { min: 1, max: 20, step: 1 };

// A real ammeter is never exact; ±2% keeps measurements believable while
// still making I = U / R obvious from the data.
const AMMETER_ERROR = 0.02;

export const idealCurrent = (voltage: number, resistance: number) =>
  voltage / resistance;

export const readAmmeter = (voltage: number, resistance: number) => {
  const noise = 1 + (Math.random() * 2 - 1) * AMMETER_ERROR;

  return Math.round(idealCurrent(voltage, resistance) * noise * 100) / 100;
};
