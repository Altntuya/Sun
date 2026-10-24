import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { EdulabPageHeader } from '@/EdulabPageHeader';
import { TeacherList } from '@/teacher/components/TeacherList';
import { TeacherSheet } from '@/teacher/components/TeacherSheet';

export const TeacherListPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <EdulabPageHeader
        section="Багш нар"
        actions={
          <TeacherSheet
            open={open}
            onOpenChange={setOpen}
            trigger={
              <Button>
                <IconPlus />
                Багш бүртгэх
              </Button>
            }
          />
        }
      />
      <div className="flex flex-col flex-auto overflow-auto">
        <TeacherList />
      </div>
    </div>
  );
};
