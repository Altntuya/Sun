import { useState } from 'react';
import { IconUserStar } from '@tabler/icons-react';
import { Badge, Table } from 'erxes-ui';
import { EdulabTable } from '~/components/EdulabTable';
import { ListState, RowActions } from '~/components/ListState';
import { getTeacherName } from '@/classroom/types';
import { TeacherSheet } from '@/teacher/components/TeacherSheet';
import { useTeacherRemove, useTeachers } from '@/teacher/hooks';
import { ITeacher } from '@/teacher/types';

export const TeacherList = () => {
  const { teachers, loading, error } = useTeachers();
  const remove = useTeacherRemove();
  const [editing, setEditing] = useState<ITeacher | undefined>();

  if (loading || error || !teachers.length) {
    return (
      <ListState
        loading={loading}
        error={error}
        isEmpty={!teachers.length}
        icon={<IconUserStar />}
        emptyTitle="Багш бүртгэгдээгүй байна"
        emptyDescription="“Багш бүртгэх” товчоор erxes хэрэглэгчийг багш болгоно."
      />
    );
  }

  return (
    <div className="m-6 rounded-lg border bg-background overflow-auto">
      <EdulabTable>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-[22%]">Багш</Table.Head>
            <Table.Head>И-мэйл</Table.Head>
            <Table.Head>Хичээл</Table.Head>
            <Table.Head>Утас</Table.Head>
            <Table.Head>Ангиуд</Table.Head>
            <Table.Head className="w-24" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {teachers.map((teacher) => (
            <Table.Row key={teacher._id}>
              <Table.Cell className="font-medium" title={getTeacherName(teacher)}>
                {getTeacherName(teacher)}
              </Table.Cell>
              <Table.Cell title={teacher.user?.email}>
                {teacher.user?.email ?? '—'}
              </Table.Cell>
              <Table.Cell>{teacher.subject || '—'}</Table.Cell>
              <Table.Cell>{teacher.phone || '—'}</Table.Cell>
              <Table.Cell>
                <div className="flex flex-wrap gap-1">
                  {teacher.classrooms?.length
                    ? teacher.classrooms.map((classroom) => (
                        <Badge key={classroom._id} variant="secondary">
                          {classroom.name}
                        </Badge>
                      ))
                    : '—'}
                </div>
              </Table.Cell>
              <Table.Cell>
                <RowActions
                  onEdit={() => setEditing(teacher)}
                  onRemove={() => remove.run({ _id: teacher._id })}
                  removeMessage={`${getTeacherName(teacher)}-ийг багшаас хасах уу? Ангиудаас нь мөн хасагдана.`}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </EdulabTable>
      <TeacherSheet
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(undefined)}
        teacher={editing}
      />
    </div>
  );
};
