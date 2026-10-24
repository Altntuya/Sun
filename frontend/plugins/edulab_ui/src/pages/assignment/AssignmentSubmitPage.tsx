import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from 'erxes-ui';
import { EdulabPageHeader } from '@/EdulabPageHeader';
import { useAssignmentDetail } from '@/assignment/hooks/useAssignments';
import { SubmissionForm } from '@/submission/components/SubmissionForm';

export const AssignmentSubmitPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { assignment, loading, error } = useAssignmentDetail(id);

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

  return (
    <div className="flex flex-col h-full">
      <EdulabPageHeader current={assignment.title} />
      <div className="flex-auto overflow-auto">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
          <div>
            <h1 className="text-2xl font-semibold">{assignment.title}</h1>
            {assignment.description && (
              <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                {assignment.description}
              </p>
            )}
          </div>
          <SubmissionForm
            assignment={assignment}
            onSubmitted={() => navigate(`/edulab/assignments/${assignment._id}`)}
          />
        </div>
      </div>
    </div>
  );
};
