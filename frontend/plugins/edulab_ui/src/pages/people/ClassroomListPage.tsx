import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { EdulabPageHeader } from '@/EdulabPageHeader';
import { ClassroomList } from '@/classroom/components/ClassroomList';
import { ClassroomSheet } from '@/classroom/components/ClassroomSheet';

export const ClassroomListPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <EdulabPageHeader
        section="Ангиуд"
        actions={
          <ClassroomSheet
            open={open}
            onOpenChange={setOpen}
            trigger={
              <Button>
                <IconPlus />
                Шинэ анги
              </Button>
            }
          />
        }
      />
      <div className="flex flex-col flex-auto overflow-auto">
        <ClassroomList />
      </div>
    </div>
  );
};
