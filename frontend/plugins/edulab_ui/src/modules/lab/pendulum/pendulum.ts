export const G = 9.81;
export const LENGTH_RANGE = { min: 0.2, max: 2, step: 0.1 };
export const MASS_RANGE = { min: 0.05, max: 1, step: 0.05 };
export const SWINGS_TIMED = 10;

// A hand-held stopwatch is off by up to ~0.15 s at start and stop; timing ten
// swings and dividing keeps the period realistic yet readable.
const REACTION_ERROR_S = 0.15;

export const idealPeriod = (length: number) =>
  2 * Math.PI * Math.sqrt(length / G);

// Mass is deliberately ignored: the period of a simple pendulum does not
// depend on it, which is what the lab lets students discover.
export const timeSwings = (length: number) => {
  const reaction = (Math.random() * 2 - 1) * REACTION_ERROR_S;
  const total = idealPeriod(length) * SWINGS_TIMED + reaction;

  return {
    total: Math.round(total * 100) / 100,
    period: Math.round((total / SWINGS_TIMED) * 100) / 100,
  };
};
