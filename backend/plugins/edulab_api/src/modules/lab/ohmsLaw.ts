import { ILabDefinition } from '@/lab/types';
import { distinct, percentOff, round, trendWithin } from '@/lab/utils';

export const ohmsLaw: ILabDefinition = {
  key: 'ohmsLaw',
  title: 'Омын хууль (цахилгаан хэлхээ)',
  variables: [
    { key: 'voltage', label: 'Хүчдэл U', unit: 'В' },
    { key: 'resistance', label: 'Эсэргүүцэл R', unit: 'Ом' },
    { key: 'current', label: 'Хэмжсэн гүйдэл I', unit: 'А' },
  ],
  describeFacts: (measurements) => {
    const rows = measurements.map(({ voltage, resistance, current }, index) => {
      const expected = voltage / resistance;

      return {
        line: `${index + 1}. U=${voltage} В, R=${resistance} Ом, хэмжсэн I=${current} А, онолын U/R=${round(expected)} А, зөрүү ${percentOff(current, expected)}%`,
        off: percentOff(current, expected),
      };
    });
    const voltages = distinct(measurements, 'voltage');
    const facts = [
      ...rows.map((row) => row.line),
      `Хамгийн их зөрүү U/R-ээс: ${Math.max(...rows.map((row) => row.off))}%.`,
      voltages.length === 1
        ? `Хүчдэлийг ${voltages[0]} В-д тогтмол барьсан.`
        : `Хүчдэлийг тогтмол бариагүй (${voltages.length} өөр утга).`,
      `Эсэргүүцлийн ялгаатай утгын тоо: ${distinct(measurements, 'resistance').length}.`,
    ];
    const falls = trendWithin(
      measurements,
      'voltage',
      'resistance',
      'current',
      'down',
    );

    if (falls !== undefined) {
      facts.push(
        falls
          ? 'Тогтмол хүчдэлд R ихсэх тусам хэмжсэн I багассан (урвуу хамаарал).'
          : 'Тогтмол хүчдэлд R ихсэхэд I тогтвортой багасаагүй.',
      );
    }

    return facts;
  },
};
