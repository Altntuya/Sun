import { EdulabPageHeader } from '@/EdulabPageHeader';
import { AssignmentAddSheet } from '@/assignment/components/AssignmentAddSheet';
import { AssignmentList } from '@/assignment/components/AssignmentList';

export const AssignmentListPage = () => (
  <div className="flex flex-col h-full">
    <EdulabPageHeader actions={<AssignmentAddSheet />} />
    <div className="flex flex-col flex-auto overflow-auto">
      <AssignmentList />
    </div>
  </div>
);
