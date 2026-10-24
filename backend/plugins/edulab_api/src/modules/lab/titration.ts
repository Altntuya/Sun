import { ILabDefinition } from '@/lab/types';
import { round } from '@/lab/utils';

// Phenolphthalein turns pink at pH 8.2. With a strong acid and strong base the
// pH jumps from ~4 to ~10 within one drop, so the endpoint is judged by how
// much base went in past the equivalence point (`overshoot`), not by pH.
const PINK_FROM_PH = 8.2;
const ENDPOINT_TOLERANCE_ML = 0.1;

const describeEndpoint = (finalPh: number, overshoot: number, baseVolume: number) => {
  if (finalPh < PINK_FROM_PH) {
    return 'эквивалент цэгт хүрээгүй (өнгө өөрчлөгдөөгүй)';
  }

  if (overshoot <= ENDPOINT_TOLERANCE_ML) {
    return 'эквивалент цэгт зөв зогссон (анхны цайвар ягаан дусал)';
  }

  return `эквивалент цэгээс ${overshoot} мл хэтрүүлсэн — C(HCl) ойролцоогоор ${round((overshoot / (baseVolume - overshoot)) * 100, 1)}%-иар өндөр гарна`;
};

const isAtEndpoint = (finalPh: number, overshoot: number) =>
  finalPh >= PINK_FROM_PH && overshoot <= ENDPOINT_TOLERANCE_ML;

export const titration: ILabDefinition = {
  key: 'titration',
  title: 'Хүчил-шүлтийн титрлэлт (HCl + NaOH, фенолфталеин)',
  variables: [
    { key: 'acidVolume', label: 'HCl-ийн эзэлхүүн', unit: 'мл' },
    { key: 'baseConcentration', label: 'NaOH-ийн концентраци', unit: 'моль/л' },
    { key: 'baseVolume', label: 'Зарцуулсан NaOH', unit: 'мл' },
    {
      key: 'overshoot',
      label: 'Эквивалент цэгээс хойш нэмсэн NaOH',
      unit: 'мл',
      allowZero: true,
    },
    { key: 'finalPh', label: 'Зогсох үеийн pH', unit: '' },
  ],
  describeFacts: (measurements) => {
    const trials = measurements.map(
      ({ acidVolume, baseConcentration, baseVolume, overshoot, finalPh }, index) => {
        const acidConcentration = (baseConcentration * baseVolume) / acidVolume;

        return {
          acidConcentration,
          valid: isAtEndpoint(finalPh, overshoot),
          line: `${index + 1}. V(HCl)=${acidVolume} мл, C(NaOH)=${baseConcentration} М, V(NaOH)=${baseVolume} мл, pH=${finalPh} — ${describeEndpoint(finalPh, overshoot, baseVolume)}; эндээс C(HCl)=${round(acidConcentration, 4)} моль/л`,
        };
      },
    );
    const valid = trials.filter((trial) => trial.valid);
    const facts = [
      ...trials.map((trial) => trial.line),
      'Томьёо: C(HCl) = C(NaOH)·V(NaOH) / V(HCl); эзэлхүүний нэгж ижил байх ёстой.',
      `Эквивалент цэгт зөв зогссон туршилт: ${valid.length} / ${trials.length}.`,
    ];

    if (valid.length) {
      const values = valid.map((trial) => trial.acidConcentration);
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
      const spread =
        ((Math.max(...values) - Math.min(...values)) / mean) * 100;

      facts.push(
        `Зөв туршилтуудын дундаж C(HCl) = ${round(mean, 4)} моль/л.`,
        valid.length > 1
          ? `Зөв туршилтуудын хоорондын зөрүү ${round(spread, 1)}% (2%-иас бага бол давтагдах чадвар сайн).`
          : 'Зөв туршилт ганц байгаа тул давтагдах чадварыг шалгах боломжгүй.',
      );
    } else {
      facts.push(
        'Нэг ч туршилт эквивалент цэгт зөв зогсоогүй тул найдвартай C(HCl) тооцоолох боломжгүй.',
      );
    }

    const overshot = trials.filter(
      (trial, index) =>
        !trial.valid && measurements[index].finalPh >= PINK_FROM_PH,
    );

    if (overshot.length) {
      facts.push(
        `Хэтрүүлсэн ${overshot.length} туршилтыг дунджид оруулбал C(HCl) бодит утгаасаа өндөр гарна.`,
      );
    }

    return facts;
  },
};
