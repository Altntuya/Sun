import { ReactNode } from 'react';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { Button, Empty, Spinner, useConfirm } from 'erxes-ui';

// Renders the loading, error or empty state of a list, or null when the list
// has rows to show.
export const ListState = ({
  loading,
  error,
  isEmpty,
  icon,
  emptyTitle,
  emptyDescription,
}: {
  loading: boolean;
  error?: Error;
  isEmpty: boolean;
  icon: ReactNode;
  emptyTitle: string;
  emptyDescription: string;
}) => {
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="p-6 text-destructive">{error.message}</p>;
  }

  if (!isEmpty) {
    return null;
  }

  return (
    <Empty className="m-6">
      <Empty.Header>
        <Empty.Media variant="icon">{icon}</Empty.Media>
        <Empty.Title>{emptyTitle}</Empty.Title>
        <Empty.Description>{emptyDescription}</Empty.Description>
      </Empty.Header>
    </Empty>
  );
};

export const RowActions = ({
  onEdit,
  onRemove,
  removeMessage,
}: {
  onEdit: () => void;
  onRemove: () => void;
  removeMessage: string;
}) => {
  const { confirm } = useConfirm();

  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" aria-label="Засах" onClick={onEdit}>
        <IconPencil />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Устгах"
        onClick={() => confirm({ message: removeMessage }).then(onRemove)}
      >
        <IconTrash />
      </Button>
    </div>
  );
};
