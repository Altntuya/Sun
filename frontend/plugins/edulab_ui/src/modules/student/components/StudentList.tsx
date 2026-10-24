import { useState } from 'react';
import { IconUsers } from '@tabler/icons-react';
import { Badge, Table } from 'erxes-ui';
import { EdulabTable } from '~/components/EdulabTable';
import { ListState, RowActions } from '~/components/ListState';
import { StudentSheet } from '@/student/components/StudentSheet';
import { useStudentRemove, useStudents } from '@/student/hooks';
import { IStudent, getStudentName } from '@/student/types';

export const StudentList = ({ classroomId }: { classroomId?: string }) => {
  const { students, loading, error } = useStudents(classroomId);
  const remove = useStudentRemove();
  const [editing, setEditing] = useState<IStudent | undefined>();

  if (loading || error || !students.length) {
    return (
      <ListState
        loading={loading}
        error={error}
        isEmpty={!students.length}
        icon={<IconUsers />}
        emptyTitle="Сурагч алга байна"
        emptyDescription={
          classroomId
            ? 'Энэ ангид сурагч бүртгэгдээгүй байна.'
            : '“Шинэ сурагч” товчоор сурагч нэмнэ үү. Эхлээд анги үүсгэсэн байх хэрэгтэй.'
        }
      />
    );
  }

  return (
    <div className="m-6 rounded-lg border bg-background overflow-auto">
      <EdulabTable>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-[22%]">Сурагч</Table.Head>
            <Table.Head>Код</Table.Head>
            <Table.Head>Анги</Table.Head>
            <Table.Head>Эцэг эх</Table.Head>
            <Table.Head>Илгээлт</Table.Head>
            <Table.Head>Contact</Table.Head>
            <Table.Head className="w-24" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {students.map((student) => (
            <Table.Row key={student._id}>
              <Table.Cell className="font-medium" title={getStudentName(student)}>
                {getStudentName(student)}
              </Table.Cell>
              <Table.Cell>{student.studentCode || '—'}</Table.Cell>
              <Table.Cell>
                <Badge variant="secondary">{student.classroom?.name ?? '—'}</Badge>
              </Table.Cell>
              <Table.Cell>
                {[student.parentName, student.parentPhone]
                  .filter(Boolean)
                  .join(' · ') || '—'}
              </Table.Cell>
              <Table.Cell>{student.submissionCount ?? 0}</Table.Cell>
              <Table.Cell>
                {student.customerId ? (
                  <Badge variant="success">Холбосон</Badge>
                ) : (
                  '—'
                )}
              </Table.Cell>
              <Table.Cell>
                <RowActions
                  onEdit={() => setEditing(student)}
                  onRemove={() => remove.run({ _id: student._id })}
                  removeMessage={`${getStudentName(student)}-ийг устгах уу?`}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </EdulabTable>
      <StudentSheet
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(undefined)}
        student={editing}
      />
    </div>
  );
};
