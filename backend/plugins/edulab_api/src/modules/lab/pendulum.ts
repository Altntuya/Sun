import { ILabDefinition } from '@/lab/types';
import { distinct, percentOff, round, trendWithin } from '@/lab/utils';

const G = 9.81;

export const pendulum: ILabDefinition = {
  key: 'pendulum',
  title: 'Математик дүүжин (хэлбэлзлийн үе)',
  variables: [
    { key: 'length', label: 'Утасны урт L', unit: 'м' },
    { key: 'mass', label: 'Бөмбөлгийн масс m', unit: 'кг' },
    { key: 'period', label: 'Хэмжсэн үе T', unit: 'с' },
  ],
  describeFacts: (measurements) => {
    const rows = measurements.map(({ length, mass, period }, index) => {
      const expected = 2 * Math.PI * Math.sqrt(length / G);
      const g = (4 * Math.PI ** 2 * length) / period ** 2;

      return {
        line: `${index + 1}. L=${length} м, m=${mass} кг, хэмжсэн T=${period} с, онолын 2π√(L/g)=${round(expected)} с, зөрүү ${percentOff(period, expected)}%, эндээс g≈${round(g)} м/с²`,
        off: percentOff(period, expected),
        g,
      };
    });
    const facts = [
      ...rows.map((row) => row.line),
      `Хамгийн их зөрүү онолын T-ээс: ${Math.max(...rows.map((row) => row.off))}%.`,
      `Хэмжилтээс гаргасан g-ийн дундаж: ${round(rows.reduce((sum, row) => sum + row.g, 0) / rows.length)} м/с² (жинхэнэ нь 9.81).`,
      `Уртын ялгаатай утга: ${distinct(measurements, 'length').length}, массын ялгаатай утга: ${distinct(measurements, 'mass').length}.`,
    ];
    const longerIsSlower = trendWithin(
      measurements,
      'mass',
      'length',
      'period',
      'up',
    );

    if (longerIsSlower !== undefined) {
      facts.push(
        longerIsSlower
          ? 'Тогтмол массад L ихсэх тусам T ихэссэн.'
          : 'Тогтмол массад L ихсэхэд T тогтвортой ихсээгүй.',
      );
    }

    // Mass must not matter: compare readings that share a length.
    const byLength = new Map<number, number[]>();

    for (const { length, period } of measurements) {
      byLength.set(length, [...(byLength.get(length) ?? []), period]);
    }

    const massSpreads = [...byLength.entries()]
      .filter(
        ([length]) =>
          distinct(
            measurements.filter((m) => m.length === length),
            'mass',
          ).length > 1,
      )
      .map(([, periods]) =>
        percentOff(Math.max(...periods), Math.min(...periods)),
      );

    facts.push(
      massSpreads.length
        ? `Ижил урттай боловч өөр масстай хэмжилтүүдийн T-ийн зөрүү хамгийн ихдээ ${Math.max(...massSpreads)}% — масс үед нөлөөлөөгүй (хэмжилтийн алдааны хэмжээнд).`
        : 'Ижил уртад массыг өөрчилж хэмжээгүй тул массын нөлөөг шалгаагүй.',
    );

    return facts;
  },
};
