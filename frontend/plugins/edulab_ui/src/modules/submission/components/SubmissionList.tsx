import { useState } from 'react';
import { IconInbox } from '@tabler/icons-react';
import { Badge, Empty, Spinner, Table } from 'erxes-ui';
import { EdulabTable } from '~/components/EdulabTable';
import { IAssignment } from '@/assignment/types';
import { useSubmissions } from '@/submission/hooks/useSubmissions';
import { getSubmitterName } from '@/submission/types';
import { AiStatusBadge } from '@/submission/components/AiStatusBadge';
import { SubmissionReviewSheet } from '@/submission/components/SubmissionReviewSheet';
import { formatDate } from '~/utils/formatDate';

export const SubmissionList = ({ assignment }: { assignment: IAssignment }) => {
  const { submissions, loading, error } = useSubmissions(assignment._id);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Read the open submission from the live list so AI results that arrive
  // while the sheet is open show up in it.
  const selected = submissions.find(
    (submission) => submission._id === selectedId,
  );

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-destructive">{error.message}</p>;
  }

  if (!submissions.length) {
    return (
      <Empty>
        <Empty.Header>
          <Empty.Media variant="icon">
            <IconInbox />
          </Empty.Media>
          <Empty.Title>Илгээлт алга байна</Empty.Title>
          <Empty.Description>
            Сурагч даалгавраа илгээхэд энд харагдана.
          </Empty.Description>
        </Empty.Header>
      </Empty>
    );
  }

  return (
    <>
      <div className="rounded-lg border bg-background overflow-auto">
        <EdulabTable>
          <Table.Header>
            <Table.Row>
              <Table.Head className="w-[26%]">Сурагч</Table.Head>
              <Table.Head>Илгээсэн</Table.Head>
              {assignment.type === 'lab' && <Table.Head>Хэмжилт</Table.Head>}
              <Table.Head>AI оноо</Table.Head>
              <Table.Head>Төлөв</Table.Head>
              <Table.Head>Багшийн оноо</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {submissions.map((submission) => (
              <Table.Row
                key={submission._id}
                className="cursor-pointer"
                onClick={() => setSelectedId(submission._id)}
              >
                <Table.Cell
                  className="font-medium"
                  title={getSubmitterName(submission)}
                >
                  {getSubmitterName(submission)}
                </Table.Cell>
                <Table.Cell>{formatDate(submission.createdAt, true)}</Table.Cell>
                {assignment.type === 'lab' && (
                  <Table.Cell>{submission.measurements?.length ?? 0}</Table.Cell>
                )}
                <Table.Cell>
                  <AiStatusBadge
                    submission={submission}
                    maxScore={assignment.maxScore}
                  />
                </Table.Cell>
                <Table.Cell>
                  {submission.status === 'reviewed' ? (
                    <Badge variant="success">Үнэлсэн</Badge>
                  ) : (
                    <Badge variant="warning">Хүлээгдэж буй</Badge>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {submission.status === 'reviewed'
                    ? `${submission.score} / ${assignment.maxScore}`
                    : '—'}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </EdulabTable>
      </div>
      {selected && (
        <SubmissionReviewSheet
          assignment={assignment}
          submission={selected}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
};
