import { ReactNode } from 'react';
import { Button, Sheet, Spinner } from 'erxes-ui';

export const EdulabSheet = ({
  title,
  open,
  onOpenChange,
  trigger,
  children,
}: {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: ReactNode;
  children: ReactNode;
}) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    {trigger && <Sheet.Trigger asChild>{trigger}</Sheet.Trigger>}
    <Sheet.View className="flex-col p-0 sm:max-w-md">
      <Sheet.Header className="px-5 shrink-0">
        <Sheet.Title>{title}</Sheet.Title>
        <Sheet.Close />
      </Sheet.Header>
      {children}
    </Sheet.View>
  </Sheet>
);

export const EdulabSheetForm = ({
  onSubmit,
  loading,
  children,
}: {
  onSubmit: () => void;
  loading: boolean;
  children: ReactNode;
}) => (
  <form
    onSubmit={onSubmit}
    className="flex flex-col flex-1 min-h-0 bg-background"
  >
    <div className="flex-1 min-h-0 overflow-y-auto p-5 flex flex-col gap-5">
      {children}
    </div>
    <Sheet.Footer className="shrink-0 border-t bg-background">
      <Sheet.Close asChild>
        <Button variant="outline" type="button" size="lg">
          Болих
        </Button>
      </Sheet.Close>
      <Button type="submit" size="lg" disabled={loading}>
        {loading ? <Spinner /> : 'Хадгалах'}
      </Button>
    </Sheet.Footer>
  </form>
);
