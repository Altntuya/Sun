// Strong acid (HCl) titrated with strong base (NaOH), phenolphthalein
// indicator. All volumes in millilitres, concentrations in mol/L.

export const ACID_VOLUMES = [10, 20, 25];
export const BASE_CONCENTRATION = 0.1;
export const BURETTE_CAPACITY = 50;
export const PINK_FROM_PH = 8.2;
// Base added past the equivalence point; more than one drop counts as
// overshooting the endpoint.
export const ENDPOINT_TOLERANCE_ML = 0.1;

// Each session gets its own unknown acid so answers cannot be copied.
export const randomAcidConcentration = () =>
  Math.round((0.08 + Math.random() * 0.08) * 1000) / 1000;

export const solutionPh = (
  acidConcentration: number,
  acidVolume: number,
  baseVolume: number,
) => {
  const acidMol = (acidConcentration * acidVolume) / 1000;
  const baseMol = (BASE_CONCENTRATION * baseVolume) / 1000;
  const totalLitres = (acidVolume + baseVolume) / 1000;
  const excess = (acidMol - baseMol) / totalLitres;

  if (Math.abs(excess) < 1e-7) {
    return 7;
  }

  return excess > 0 ? -Math.log10(excess) : 14 + Math.log10(-excess);
};

// Colour and its name follow the same rule that grades the trial: colourless
// before equivalence, faint pink within one drop past it, then deepening with
// the excess base. Going by pH alone would disagree with the grading, since
// the pH one drop past equivalence depends on the volumes in the flask.
export const indicatorColor = (ph: number, overshoot: number) => {
  if (ph < PINK_FROM_PH) {
    return { fill: 'rgb(219 234 254 / 0.6)', label: 'Өнгөгүй', faint: false };
  }

  const faint = overshoot <= ENDPOINT_TOLERANCE_ML;
  const depth = faint ? 0 : Math.min(overshoot / 2, 1);
  const lightness = Math.round(86 - depth * 41);

  return {
    fill: `hsl(322 85% ${lightness}% / 0.85)`,
    label: faint ? 'Цайвар ягаан' : 'Тод ягаан',
    faint,
  };
};

export const equivalenceVolume = (
  acidConcentration: number,
  acidVolume: number,
) => (acidConcentration * acidVolume) / BASE_CONCENTRATION;

export const isAtEndpoint = (finalPh: number, overshoot: number) =>
  finalPh >= PINK_FROM_PH && overshoot <= ENDPOINT_TOLERANCE_ML;

export const roundVolume = (value: number) => Math.round(value * 100) / 100;

// Two sliders set the added base: a coarse one to get close and a fine one,
// one drop per step, to land on the first faint pink. The endpoint is less
// than two drops wide, too narrow to hit on a single 0–50 ml slider.
export const DROP_ML = 0.05;
export const COARSE = { min: 0, max: BURETTE_CAPACITY, step: 0.5 };
export const FINE = { min: -1, max: 1, step: DROP_ML };

// From about pH 2.8 a strong acid is a few drops from equivalence.
export const NEAR_ENDPOINT_PH = 2.8;

// pH sampled every drop from 0 to `volume`, for the live titration curve.
export const curveUpTo = (
  acidConcentration: number,
  acidVolume: number,
  volume: number,
) => {
  const points = [];

  for (let v = 0; v < volume; v = roundVolume(v + DROP_ML)) {
    points.push({ volume: v, ph: solutionPh(acidConcentration, acidVolume, v) });
  }

  points.push({ volume, ph: solutionPh(acidConcentration, acidVolume, volume) });

  return points;
};
