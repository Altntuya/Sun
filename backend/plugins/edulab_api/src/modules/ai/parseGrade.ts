interface IRawGrade {
  score?: unknown;
  feedback?: unknown;
  criteria?: unknown;
}

export interface IAiCriterion {
  criterion: string;
  score: number;
  max?: number;
  comment: string;
}

const parseCriteria = (raw: unknown): IAiCriterion[] =>
  (Array.isArray(raw) ? raw : [])
    .map((item: Record<string, unknown>) => {
      const rawMax = Number(item?.max);
      const max = Number.isFinite(rawMax) && rawMax > 0 ? rawMax : undefined;
      const score = Number(item?.score);

      return {
        criterion: String(item?.criterion ?? '').trim(),
        score: max === undefined ? score : Math.min(score, max),
        max,
        comment: String(item?.comment ?? '').trim(),
      };
    })
    .filter((item) => item.criterion && Number.isFinite(item.score));

// Returns every balanced {...} block in the text, ignoring braces inside
// strings, so reasoning that mentions "{U/R}" cannot swallow the real answer.
const findObjectBlocks = (text: string): string[] => {
  const blocks: string[] = [];

  for (let start = text.indexOf('{'); start !== -1; start = text.indexOf('{', start + 1)) {
    let depth = 0;
    let inString = false;

    for (let i = start; i < text.length; i++) {
      const char = text[i];

      if (inString) {
        if (char === '\\') i++;
        else if (char === '"') inString = false;
        continue;
      }

      if (char === '"') inString = true;
      else if (char === '{') depth++;
      else if (char === '}' && --depth === 0) {
        blocks.push(text.slice(start, i + 1));
        break;
      }
    }
  }

  return blocks;
};

const tryParse = (block: string): IRawGrade | undefined => {
  try {
    const parsed = JSON.parse(block) as unknown;

    return parsed && typeof parsed === 'object' && 'score' in parsed
      ? (parsed as IRawGrade)
      : undefined;
  } catch {
    return undefined;
  }
};

// Last resort for near-JSON such as {score: 2, feedback: '...'}.
const scrapeFields = (text: string): IRawGrade | undefined => {
  const score = /["']?score["']?\s*[:=]\s*(-?\d+(?:\.\d+)?)/i.exec(text)?.[1];

  if (score === undefined) {
    return undefined;
  }

  const feedback = /["']?feedback["']?\s*[:=]\s*["']([\s\S]*?)["']\s*[,}]/i.exec(
    text,
  )?.[1];

  return { score, feedback };
};

export const parseGrade = (text: string, maxScore: number) => {
  const cleaned = text.replace(/```(?:json)?/gi, '');
  const parsed = findObjectBlocks(cleaned)
    .map(tryParse)
    .filter((block): block is IRawGrade => Boolean(block));
  // Each item in `criteria` has its own `score`; the grade itself is the
  // object that also carries `feedback`.
  const raw =
    parsed.filter((block) => 'feedback' in block).pop() ??
    parsed.pop() ??
    scrapeFields(cleaned);
  const score = Number(raw?.score);

  if (!raw || !Number.isFinite(score)) {
    throw new Error(
      `Gemma-ийн хариунаас оноо олдсонгүй: ${cleaned.slice(0, 300)}`,
    );
  }

  return {
    score: Math.min(maxScore, Math.max(0, Math.round(score * 2) / 2)),
    feedback: String(raw.feedback ?? '').trim(),
    criteria: parseCriteria(raw.criteria),
  };
};
