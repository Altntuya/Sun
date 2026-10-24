import { Link, useNavigate, useParams } from 'react-router-dom';
import { IconPlayerPlay, IconTrash } from '@tabler/icons-react';
import { Button, Card, Spinner, useConfirm } from 'erxes-ui';
import { EdulabPageHeader } from '@/EdulabPageHeader';
import { AssignmentTypeBadge } from '@/assignment/components/AssignmentTypeBadge';
import { useAssignmentDetail } from '@/assignment/hooks/useAssignments';
import { useAssignmentRemove } from '@/assignment/hooks/useAssignmentMutations';
import { getLabLabel } from '@/lab/registry';
import { SubmissionList } from '@/submission/components/SubmissionList';
import { formatDate } from '~/utils/formatDate';

export const AssignmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const { assignment, loading, error } = useAssignmentDetail(id);
  const { removeAssignment, loading: removing } = useAssignmentRemove();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="flex flex-col h-full">
        <EdulabPageHeader />
        <p className="p-6 text-destructive">
          {error?.message ?? 'Даалгавар олдсонгүй'}
        </p>
      </div>
    );
  }

  const handleRemove = () =>
    confirm({
      message: 'Даалгавар болон түүний бүх илгээлтийг устгах уу?',
    }).then(() =>
      removeAssignment(assignment._id, () => navigate('/edulab/assignments')),
    );

  return (
    <div className="flex flex-col h-full">
      <EdulabPageHeader
        current={assignment.title}
        actions={
          <>
            <Button variant="outline" onClick={handleRemove} disabled={removing}>
              <IconTrash />
              Устгах
            </Button>
            <Button asChild>
              <Link to={`/edulab/assignments/${assignment._id}/submit`}>
                <IconPlayerPlay />
                {assignment.type === 'lab' ? 'Lab эхлүүлэх' : 'Даалгавар хийх'}
              </Link>
            </Button>
          </>
        }
      />
      <div className="flex flex-col flex-auto gap-6 overflow-auto p-6">
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <Card.Title>{assignment.title}</Card.Title>
              <AssignmentTypeBadge type={assignment.type} />
            </div>
            <Card.Description>
              {assignment.classroom?.name ?? 'Бүх анги'} ·{' '}
              {getLabLabel(assignment.labKey) || 'Бичгийн даалгавар'} · Дээд
              оноо {assignment.maxScore} · Хугацаа{' '}
              {formatDate(assignment.dueDate)}
            </Card.Description>
          </Card.Header>
          <Card.Content className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Тайлбар</p>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {assignment.description || '—'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Үнэлгээний шалгуур</p>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {assignment.rubric || '—'}
              </p>
            </div>
          </Card.Content>
        </Card>
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Илгээлтүүд</h2>
          <SubmissionList assignment={assignment} />
        </div>
      </div>
    </div>
  );
};
