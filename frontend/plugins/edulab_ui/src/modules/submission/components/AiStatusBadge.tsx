import { IconSparkles } from '@tabler/icons-react';
import { Badge, Spinner } from 'erxes-ui';
import { ISubmission } from '@/submission/types';

export const AiStatusBadge = ({
  submission,
  maxScore,
}: {
  submission: ISubmission;
  maxScore: number;
}) => {
  switch (submission.aiStatus) {
    case 'pending':
      return (
        <Badge variant="secondary">
          <Spinner size="sm" />
          Шалгаж байна
        </Badge>
      );
    case 'done':
      return (
        <Badge variant="info">
          <IconSparkles size={14} />
          {submission.aiScore} / {maxScore}
        </Badge>
      );
    case 'failed':
      return <Badge variant="destructive">AI алдаа</Badge>;
    default:
      return <span className="text-muted-foreground">—</span>;
  }
};
