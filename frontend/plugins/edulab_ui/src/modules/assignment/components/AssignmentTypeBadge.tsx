import { IconFlask, IconPencil } from '@tabler/icons-react';
import { Badge } from 'erxes-ui';
import { AssignmentType } from '@/assignment/types';

export const AssignmentTypeBadge = ({ type }: { type: AssignmentType }) =>
  type === 'lab' ? (
    <Badge variant="info">
      <IconFlask size={14} />
      Virtual lab
    </Badge>
  ) : (
    <Badge variant="secondary">
      <IconPencil size={14} />
      Бичгийн
    </Badge>
  );
