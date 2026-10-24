import { ComponentProps } from 'react';
import { Table, cn } from 'erxes-ui';

// erxes Table is `table-fixed` and its cells are `whitespace-nowrap p-0`, so
// long text spills into the next column. This pads every cell and cuts text
// off with an ellipsis; pass `title` on a cell to show the full value on hover.
export const EdulabTable = ({
  className,
  ...props
}: ComponentProps<typeof Table>) => (
  <Table
    className={cn('[&_td]:px-2 [&_td]:truncate [&_th]:truncate', className)}
    {...props}
  />
);
