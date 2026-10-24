import { ReactNode } from 'react';
import { Card } from 'erxes-ui';
import { MeasurementTable } from '@/lab/MeasurementTable';
import { ILabDefinition, LabMeasurement } from '@/lab/types';

// Shared frame for every simulation: the apparatus on top, the recorded
// measurements and the lab's chart below.
export const LabWorkbench = ({
  lab,
  measurements,
  onChange,
  apparatus,
}: {
  lab: Pick<ILabDefinition, 'variables' | 'Chart' | 'hint'>;
  measurements: LabMeasurement[];
  onChange: (measurements: LabMeasurement[]) => void;
  apparatus: ReactNode;
}) => (
  <div className="flex flex-col gap-4">
    <Card>
      <Card.Content className="grid gap-6 pt-6 md:grid-cols-2">
        {apparatus}
      </Card.Content>
    </Card>
    <Card>
      <Card.Header>
        <Card.Title>Хэмжилтийн хүснэгт ({measurements.length})</Card.Title>
      </Card.Header>
      {/* Side by side only on wide screens: a lab's table has up to six
          columns and its numbers get cut off in half the card. */}
      <Card.Content className="grid gap-6 xl:grid-cols-2">
        {measurements.length ? (
          <>
            <MeasurementTable
              variables={lab.variables}
              measurements={measurements}
              onRemove={(index) =>
                onChange(measurements.filter((_, i) => i !== index))
              }
            />
            <lab.Chart measurements={measurements} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground md:col-span-2">
            {lab.hint}
          </p>
        )}
      </Card.Content>
    </Card>
  </div>
);
