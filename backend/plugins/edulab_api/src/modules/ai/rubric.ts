export interface IRubricCriterion {
  name: string;
  max: number;
}

// "<n> оноо" anywhere in the line, e.g. "Таамаглал — 2 оноо" or
// "1 оноо — Тодорхой таамаглал".
const POINTS = /(\d+(?:[.,]\d+)?)\s*оноо/i;
const SEPARATORS = /^[\s—–\-:.)·•]+|[\s—–\-:.(·•]+$/g;

// Criterion names and points come from the teacher's rubric, not from the
// model: Gemma rewords names and breaks Mongolian vowel harmony when asked to
// copy them. Returns undefined unless every non-empty line has points.
export const parseRubric = (rubric?: string): IRubricCriterion[] | undefined => {
  const lines = (rubric ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return undefined;
  }

  const criteria: IRubricCriterion[] = [];

  for (const line of lines) {
    const match = POINTS.exec(line);

    if (!match) {
      return undefined;
    }

    const name = line.replace(match[0], '').replace(SEPARATORS, '').trim();

    if (!name) {
      return undefined;
    }

    criteria.push({ name, max: Number(match[1].replace(',', '.')) });
  }

  return criteria;
};
