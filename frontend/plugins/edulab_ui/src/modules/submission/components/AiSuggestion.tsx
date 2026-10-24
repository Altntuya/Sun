import { IconCheck, IconRefresh, IconSparkles } from '@tabler/icons-react';
import { Badge, Button, Card, Spinner } from 'erxes-ui';
import { useSubmissionAiCheck } from '@/submission/hooks/useSubmissions';
import { ISubmission } from '@/submission/types';

const criterionVariant = (score: number, max?: number) => {
  if (!max) {
    return 'secondary';
  }

  if (score >= max) {
    return 'success';
  }

  return score > 0 ? 'warning' : 'destructive';
};

const AiResult = ({
  submission,
  maxScore,
}: {
  submission: ISubmission;
  maxScore: number;
}) => (
  <div className="flex flex-col gap-3">
    <p className="text-2xl font-semibold">
      {submission.aiScore} / {maxScore}
    </p>
    {submission.aiCriteria?.length ? (
      // A list rather than a Table: erxes Table cells never wrap, and the
      // comments are full sentences.
      <ul className="flex flex-col divide-y rounded-md border bg-background">
        {submission.aiCriteria.map((item) => (
          <li key={item.criterion} className="flex flex-col gap-1 p-3">
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-medium">{item.criterion}</span>
              <Badge
                variant={criterionVariant(item.score, item.max)}
                className="shrink-0 tabular-nums"
              >
                {item.max ? `${item.score} / ${item.max}` : item.score}
              </Badge>
            </div>
            {item.comment && (
              <p className="text-sm text-muted-foreground">{item.comment}</p>
            )}
          </li>
        ))}
      </ul>
    ) : null}
    <p className="whitespace-pre-wrap text-sm">{submission.aiFeedback}</p>
    {submission.aiModel && (
      <p className="text-xs text-muted-foreground">Загвар: {submission.aiModel}</p>
    )}
  </div>
);

export const AiSuggestion = ({
  submission,
  maxScore,
  onApply,
}: {
  submission: ISubmission;
  maxScore: number;
  onApply: (score: number, feedback: string) => void;
}) => {
  const { aiCheckSubmission, loading } = useSubmissionAiCheck();
  const isPending = loading || submission.aiStatus === 'pending';
  const recheckLabel = submission.aiStatus ? 'Дахин шалгах' : 'AI-аар шалгах';

  const renderBody = () => {
    if (isPending) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner size="sm" />
          Gemma 4 хариултыг хэмжилттэй тулгаж шалгаж байна...
        </div>
      );
    }

    if (submission.aiStatus === 'failed') {
      return (
        <p className="text-sm text-destructive">
          AI шалгалт амжилтгүй: {submission.aiError}
        </p>
      );
    }

    if (submission.aiStatus === 'done') {
      return <AiResult submission={submission} maxScore={maxScore} />;
    }

    return (
      <p className="text-sm text-muted-foreground">
        Энэ илгээлтийг AI-аар шалгаагүй байна.
      </p>
    );
  };

  return (
    <Card className="border-info/40 bg-info/5">
      <Card.Header className="flex-row items-center justify-between space-y-0">
        <Card.Title className="flex items-center gap-2 text-base">
          <IconSparkles size={18} />
          AI санал болгосон үнэлгээ
        </Card.Title>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => aiCheckSubmission(submission._id)}
          >
            <IconRefresh />
            {recheckLabel}
          </Button>
          {submission.aiStatus === 'done' && (
            <Button
              type="button"
              size="sm"
              onClick={() =>
                onApply(submission.aiScore ?? 0, submission.aiFeedback ?? '')
              }
            >
              <IconCheck />
              Ашиглах
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Content>{renderBody()}</Card.Content>
    </Card>
  );
};
