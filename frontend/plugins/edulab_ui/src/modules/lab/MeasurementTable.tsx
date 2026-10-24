import { IconTrash } from '@tabler/icons-react';
import { Button, Table } from 'erxes-ui';
import { EdulabTable } from '~/components/EdulabTable';
import { ILabVariable, LabMeasurement } from '@/lab/types';

export const MeasurementTable = ({
  variables,
  measurements,
  onRemove,
}: {
  variables: ILabVariable[];
  measurements: LabMeasurement[];
  onRemove?: (index: number) => void;
}) => (
  <EdulabTable>
    <Table.Header>
      <Table.Row>
        <Table.Head className="w-10">#</Table.Head>
        {variables.map((variable) => (
          <Table.Head key={variable.key}>
            {variable.unit ? `${variable.label} (${variable.unit})` : variable.label}
          </Table.Head>
        ))}
        {onRemove && <Table.Head className="w-14" />}
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {measurements.map((measurement, index) => (
        <Table.Row key={`${index}-${JSON.stringify(measurement)}`}>
          <Table.Cell>{index + 1}</Table.Cell>
          {variables.map((variable) => (
            <Table.Cell key={variable.key} className="tabular-nums">
              {measurement[variable.key]?.toFixed(variable.digits) ?? '—'}
            </Table.Cell>
          ))}
          {onRemove && (
            <Table.Cell>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Хэмжилт устгах"
                onClick={() => onRemove(index)}
              >
                <IconTrash />
              </Button>
            </Table.Cell>
          )}
        </Table.Row>
      ))}
    </Table.Body>
  </EdulabTable>
);
