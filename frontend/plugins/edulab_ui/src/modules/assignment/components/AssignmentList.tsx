import { useNavigate } from 'react-router-dom';
import { IconFlask } from '@tabler/icons-react';
import { Empty, Spinner, Table } from 'erxes-ui';
import { EdulabTable } from '~/components/EdulabTable';
import { useAssignments } from '@/assignment/hooks/useAssignments';
import { AssignmentTypeBadge } from '@/assignment/components/AssignmentTypeBadge';
import { getLabLabel } from '@/lab/registry';
import { formatDate } from '~/utils/formatDate';

export const AssignmentList = () => {
  const { assignments, loading, error } = useAssignments();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="p-6 text-destructive">{error.message}</p>;
  }

  if (!assignments.length) {
    return (
      <Empty className="m-6">
        <Empty.Header>
          <Empty.Media variant="icon">
            <IconFlask />
          </Empty.Media>
          <Empty.Title>Даалгавар алга байна</Empty.Title>
          <Empty.Description>
            &quot;Шинэ даалгавар&quot; товчоор эхний lab эсвэл бичгийн
            даалгавраа үүсгэнэ үү.
          </Empty.Description>
        </Empty.Header>
      </Empty>
    );
  }

  return (
    <div className="m-6 rounded-lg border bg-background overflow-auto">
      <EdulabTable>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-[30%]">Даалгавар</Table.Head>
            <Table.Head>Анги</Table.Head>
            <Table.Head>Төрөл</Table.Head>
            <Table.Head className="w-[22%]">Lab</Table.Head>
            <Table.Head>Дээд оноо</Table.Head>
            <Table.Head>Хугацаа</Table.Head>
            <Table.Head>Илгээлт</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {assignments.map((assignment) => (
            <Table.Row
              key={assignment._id}
              className="cursor-pointer"
              onClick={() => navigate(`/edulab/assignments/${assignment._id}`)}
            >
              <Table.Cell className="font-medium" title={assignment.title}>
                {assignment.title}
              </Table.Cell>
              <Table.Cell>{assignment.classroom?.name ?? 'Бүх анги'}</Table.Cell>
              <Table.Cell>
                <AssignmentTypeBadge type={assignment.type} />
              </Table.Cell>
              <Table.Cell title={getLabLabel(assignment.labKey)}>
                {getLabLabel(assignment.labKey) || '—'}
              </Table.Cell>
              <Table.Cell>{assignment.maxScore}</Table.Cell>
              <Table.Cell>{formatDate(assignment.dueDate)}</Table.Cell>
              <Table.Cell>{assignment.submissionCount ?? 0}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </EdulabTable>
    </div>
  );
};
