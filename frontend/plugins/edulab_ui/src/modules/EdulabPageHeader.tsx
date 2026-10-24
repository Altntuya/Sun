import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { IconFlask } from '@tabler/icons-react';
import { Breadcrumb, Button, Separator } from 'erxes-ui';
import { PageHeader } from 'ui-modules';

// `section` names a top-level page other than assignments; `current` is a
// record shown under the assignments breadcrumb.
export const EdulabPageHeader = ({
  section,
  current,
  actions,
}: {
  section?: string;
  current?: string;
  actions?: ReactNode;
}) => {
  const root = section ?? 'Даалгавар';

  return (
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            <Breadcrumb.Item>
              {section ? (
                <Breadcrumb.Page className="flex items-center gap-2 px-2">
                  <IconFlask size={16} />
                  {section}
                </Breadcrumb.Page>
              ) : (
                <Button variant="ghost" asChild>
                  <Link to="/edulab/assignments">
                    <IconFlask />
                    Даалгавар
                  </Link>
                </Button>
              )}
            </Breadcrumb.Item>
            {current && (
              <>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.Page>{current}</Breadcrumb.Page>
                </Breadcrumb.Item>
              </>
            )}
          </Breadcrumb.List>
        </Breadcrumb>
        <Separator.Inline />
        <PageHeader.FavoriteToggleButton
          breadcrumb={current ? [root, current] : [root]}
        />
      </PageHeader.Start>
      {actions && (
        <PageHeader.End className="gap-2">{actions}</PageHeader.End>
      )}
    </PageHeader>
  );
};
