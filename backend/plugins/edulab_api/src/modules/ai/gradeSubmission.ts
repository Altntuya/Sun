import { IAssignmentDocument } from '@/assignment/types';
import { ISubmissionDocument } from '@/submission/types';
import { generateWithGemma } from '@/ai/gemma';
import { describeMeasurements, getLab } from '@/lab/registry';
import { IAiCriterion, parseGrade } from '@/ai/parseGrade';
import { IRubricCriterion, parseRubric } from '@/ai/rubric';

export interface IAiGrade {
  score: number;
  feedback: string;
  criteria: IAiCriterion[];
  model: string;
}

export const buildGradingPrompt = (
  assignment: IAssignmentDocument,
  submission: ISubmissionDocument,
) => {
  const isLab = assignment.type === 'lab';
  const rubric = parseRubric(assignment.rubric);

  return [
    'Чи ерөнхий боловсролын сургуулийн туршлагатай физикийн багш.',
    'Сурагчийн ажлыг доорх үнэлгээний шалгуурын дагуу үнэл.',
    isLab
      ? 'Сурагчийн дүгнэлтийг заавал "Хэмжилтийн баримт" хэсэгтэй тулга. Баримттай зөрчилдсөн дүгнэлтэд оноо бүү өг. Баримтууд серверт тооцоологдсон бөгөөд үнэн зөв. Таамаглал буруу байж болох бөгөөд энэ нь алдаа биш — буруу таамаглалыг "зөв" гэж бүү магт, харин хэмжилт түүнийг баталсан эсвэл няцаасныг тодорхой хэл.'
      : '',
    '',
    `## Даалгавар: ${assignment.title}`,
    isLab ? `Lab: ${getLab(assignment.labKey).title}` : '',
    assignment.description ? `Тайлбар: ${assignment.description}` : '',
    `Дээд оноо: ${assignment.maxScore}`,
    '',
    '## Үнэлгээний шалгуур',
    rubric
      ? rubric.map((c, i) => `${i + 1}. ${c.name} (${c.max} оноо)`).join('\n')
      : assignment.rubric?.trim() ||
        'Хариулт асуултад зөв, бүрэн, үндэслэлтэй хариулсан эсэхээр үнэл.',
    '',
    ...(isLab
      ? [
          '## Сурагчийн таамаглал',
          submission.hypothesis?.trim() || '(бичээгүй)',
          '',
          '## Хэмжилтийн баримт',
          describeMeasurements(assignment.labKey, submission.measurements),
          '',
        ]
      : []),
    `## Сурагчийн ${isLab ? 'дүгнэлт' : 'хариулт'}`,
    submission.answer,
    '',
    '## Хариултын хэлбэр',
    'Зөвхөн нэг JSON объект буцаа, өөр текст бүү бич:',
    `{"criteria": [{"criterion": "<шалгуурын нэр>", "max": <тухайн шалгуурын дээд оноо>, "score": <авсан оноо, 0-max>, "comment": "<1 өгүүлбэр: яагаад>"}], "score": <criteria-ийн score-уудын нийлбэр, 0-${assignment.maxScore}, 0.5-ын алхамтай>, "feedback": "<сурагчид \\"Та\\" гэж хандсан 2-3 өгүүлбэр: юу сайн болсон, юуг засах, дараагийн алхам>"}`,
    rubric
      ? `criteria-д яг ${rubric.length} элемент, шалгуурын дарааллаар оруул.`
      : 'Шалгуур бүрийг criteria-д тус тусад нь оруул. Шалгуурын max-уудын нийлбэр нь дээд оноотой тэнцүү байна.',
    '',
    '## Бичих дүрэм',
    '- Зөвхөн кирилл үсгээр, монгол хэлний зөв бичгийн дүрмийн дагуу бич. Эгшиг зохицлыг баримтал: "өгөгдөлтэй", "хэмжилттэй", "уртаар" гэх мэт.',
    '- Ерөнхий боловсролын физикийн сурах бичгийн нэр томьёо хэрэглэ: "хувьсах хэмжигдэхүүн", "хэлбэлзлийн үе", "эсэргүүцэл", "гүйдлийн хүч". Үг зохиож болохгүй.',
    '- Богино, энгийн өгүүлбэрээр бич. Тоог хэмжилтийн баримтаас хуулж бич.',
  ]
    .filter((line) => line !== '')
    .join('\n');
};

// Puts the rubric's own names and points on the model's per-criterion scores
// when the model returned one entry per rubric line, in order.
const alignWithRubric = (
  criteria: IAiCriterion[],
  rubric?: IRubricCriterion[],
): IAiCriterion[] => {
  if (!rubric || criteria.length !== rubric.length) {
    return criteria;
  }

  return criteria.map((item, index) => ({
    ...item,
    criterion: rubric[index].name,
    max: rubric[index].max,
    score: Math.min(Math.max(item.score, 0), rubric[index].max),
  }));
};

export const gradeSubmission = async (
  assignment: IAssignmentDocument,
  submission: ISubmissionDocument,
): Promise<IAiGrade> => {
  const { text, model } = await generateWithGemma(
    buildGradingPrompt(assignment, submission),
  );

  const grade = parseGrade(text, assignment.maxScore);
  const criteria = alignWithRubric(grade.criteria, parseRubric(assignment.rubric));
  // When the breakdown is reliable, the total is its sum, not the model's.
  const score =
    criteria.length && criteria.every((item) => item.max !== undefined)
      ? Math.min(
          assignment.maxScore,
          criteria.reduce((sum, item) => sum + item.score, 0),
        )
      : grade.score;

  return { ...grade, criteria, score, model };
};
