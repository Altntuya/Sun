import { useState } from 'react';
import { IconSchool } from '@tabler/icons-react';
import { Badge, Table } from 'erxes-ui';
import { EdulabTable } from '~/components/EdulabTable';
import { ListState, RowActions } from '~/components/ListState';
import { ClassroomSheet } from '@/classroom/components/ClassroomSheet';
import { useClassroomRemove, useClassrooms } from '@/classroom/hooks';
import { IClassroom, getTeacherName } from '@/classroom/types';

export const ClassroomList = () => {
  const { classrooms, loading, error } = useClassrooms();
  const remove = useClassroomRemove();
  const [editing, setEditing] = useState<IClassroom | undefined>();

  const state = (
    <ListState
      loading={loading}
      error={error}
      isEmpty={!classrooms.length}
      icon={<IconSchool />}
      emptyTitle="Анги алга байна"
      emptyDescription="“Шинэ анги” товчоор анги үүсгэж, багш оноогоорой."
    />
  );

  if (loading || error || !classrooms.length) {
    return state;
  }

  return (
    <div className="m-6 rounded-lg border bg-background overflow-auto">
      <EdulabTable>
        <Table.Header>
          <Table.Row>
            <Table.Head>Анги</Table.Head>
            <Table.Head>Түвшин</Table.Head>
            <Table.Head className="w-[40%]">Багш нар</Table.Head>
            <Table.Head>Сурагч</Table.Head>
            <Table.Head className="w-24" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {classrooms.map((classroom) => (
            <Table.Row key={classroom._id}>
              <Table.Cell className="font-medium">{classroom.name}</Table.Cell>
              <Table.Cell>{classroom.grade ?? '—'}</Table.Cell>
              <Table.Cell>
                <div className="flex flex-wrap gap-1">
                  {classroom.teachers?.length
                    ? classroom.teachers.map((teacher) => (
                        <Badge key={teacher._id} variant="secondary">
                          {getTeacherName(teacher)}
                        </Badge>
                      ))
                    : '—'}
                </div>
              </Table.Cell>
              <Table.Cell>{classroom.studentCount ?? 0}</Table.Cell>
              <Table.Cell>
                <RowActions
                  onEdit={() => setEditing(classroom)}
                  onRemove={() => remove.run({ _id: classroom._id })}
                  removeMessage={`"${classroom.name}" ангийг устгах уу?`}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </EdulabTable>
      <ClassroomSheet
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(undefined)}
        classroom={editing}
      />
    </div>
  );
};
