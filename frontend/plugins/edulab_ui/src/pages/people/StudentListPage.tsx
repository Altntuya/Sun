import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { EdulabPageHeader } from '@/EdulabPageHeader';
import { SelectClassroom } from '@/classroom/components/SelectClassroom';
import { StudentList } from '@/student/components/StudentList';
import { StudentSheet } from '@/student/components/StudentSheet';

export const StudentListPage = () => {
  const [open, setOpen] = useState(false);
  const [classroomId, setClassroomId] = useState<string | undefined>();

  return (
    <div className="flex flex-col h-full">
      <EdulabPageHeader
        section="Сурагчид"
        actions={
          <>
            <div className="w-44">
              <SelectClassroom
                value={classroomId}
                onValueChange={setClassroomId}
                allLabel="Бүх анги"
              />
            </div>
            <StudentSheet
              open={open}
              onOpenChange={setOpen}
              defaultClassroomId={classroomId}
              trigger={
                <Button>
                  <IconPlus />
                  Шинэ сурагч
                </Button>
              }
            />
          </>
        }
      />
      <div className="flex flex-col flex-auto overflow-auto">
        <StudentList classroomId={classroomId} />
      </div>
    </div>
  );
};
