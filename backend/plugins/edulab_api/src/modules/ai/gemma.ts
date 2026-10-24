const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export const GEMMA_TIMEOUT_MS = 90_000;

interface IListedModel {
  name: string;
  supportedGenerationMethods?: string[];
}

interface IGenerateContentResponse {
  candidates?: {
    content?: { parts?: { text?: string; thought?: boolean }[] };
  }[];
  error?: { message?: string };
}

class GemmaApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

let candidateModels: string[] | undefined;
let workingModel: string | undefined;

const getApiKey = () => {
  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    throw new Error('GOOGLE_AI_API_KEY is not set in .env');
  }

  return apiKey;
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': getApiKey(),
      },
      signal: AbortSignal.timeout(GEMMA_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new GemmaApiError(
        `Gemma ${GEMMA_TIMEOUT_MS / 1000} секундэд хариу өгсөнгүй`,
        504,
      );
    }

    throw error;
  }
  const body = (await response.json()) as T & { error?: { message?: string } };

  if (!response.ok) {
    throw new GemmaApiError(
      body.error?.message || `Gemma API error ${response.status}`,
      response.status,
    );
  }

  return body;
};

const parameterSize = (name: string) =>
  Number(/(\d+)b/i.exec(name)?.[1] ?? 0);

// Mixture-of-experts sizes such as `26b-a4b` answer several times faster than
// dense ones of similar quality, so they go first; then larger before smaller.
const byPreference = (a: string, b: string) => {
  const moe = Number(/-a\d+b/i.test(b)) - Number(/-a\d+b/i.test(a));

  return moe || parameterSize(b) - parameterSize(a);
};

const getCandidateModels = async (): Promise<string[]> => {
  if (process.env.GEMMA_MODEL) {
    return [process.env.GEMMA_MODEL.replace(/^models\//, '')];
  }

  if (!candidateModels) {
    const { models = [] } = await request<{ models?: IListedModel[] }>(
      'models?pageSize=1000',
    );

    candidateModels = models
      .filter(
        (model) =>
          /gemma-4/i.test(model.name) &&
          model.supportedGenerationMethods?.includes('generateContent'),
      )
      .map((model) => model.name.replace(/^models\//, ''))
      .sort(byPreference);
  }

  if (!candidateModels.length) {
    throw new Error('No Gemma 4 model is available for this API key');
  }

  // Try the model that last answered first.
  return workingModel
    ? [workingModel, ...candidateModels.filter((m) => m !== workingModel)]
    : candidateModels;
};

const isRetryable = (error: unknown) =>
  error instanceof GemmaApiError && (error.status >= 500 || error.status === 429);

// Measured on gemma-4-26b-a4b-it: default thinking takes ~30 s per lab grade,
// `minimal` ~4 s with the same scores, including on answers whose conclusion
// contradicts the measurements. Models that reject the setting get none.
const FAST_THINKING = { thinkingConfig: { thinkingLevel: 'minimal' } };
const modelsWithoutThinkingLevel = new Set<string>();

const callModel = (model: string, prompt: string, fast: boolean) =>
  request<IGenerateContentResponse>(`models/${model}:generateContent`, {
    method: 'POST',
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, ...(fast ? FAST_THINKING : {}) },
    }),
  });

const generateOnce = async (model: string, prompt: string) => {
  let body: IGenerateContentResponse;

  try {
    body = await callModel(model, prompt, !modelsWithoutThinkingLevel.has(model));
  } catch (error) {
    if (
      !(error instanceof GemmaApiError) ||
      error.status !== 400 ||
      !/thinking/i.test(error.message)
    ) {
      throw error;
    }

    modelsWithoutThinkingLevel.add(model);
    body = await callModel(model, prompt, false);
  }
  // Thinking models return their reasoning as separate `thought` parts.
  const text = (body.candidates?.[0]?.content?.parts ?? [])
    .filter((part) => !part.thought)
    .map((part) => part.text ?? '')
    .join('')
    .trim();

  if (!text) {
    throw new Error('Gemma returned an empty response');
  }

  return text;
};

// A Gemma 4 size can be briefly unavailable (500, 429, timeout); the next
// available size is tried before the check is reported as failed.
export const generateWithGemma = async (
  prompt: string,
): Promise<{ text: string; model: string }> => {
  const errors: string[] = [];

  for (const model of await getCandidateModels()) {
    try {
      const text = await generateOnce(model, prompt);

      workingModel = model;

      return { text, model };
    } catch (error) {
      if (!isRetryable(error)) {
        throw error;
      }

      errors.push(`${model}: ${(error as Error).message}`);
    }
  }

  throw new Error(`Gemma загварууд хариу өгсөнгүй — ${errors.join('; ')}`);
};
