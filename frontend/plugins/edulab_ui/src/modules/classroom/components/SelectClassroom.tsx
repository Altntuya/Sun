import { Select } from 'erxes-ui';
import { useClassrooms } from '@/classroom/hooks';

const ALL = '__all__';

// `allLabel` adds an option that clears the selection (used by filters and
// by assignments that are open to every class).
export const SelectClassroom = ({
  value,
  onValueChange,
  allLabel,
  placeholder = 'Анги сонгох',
}: {
  value?: string;
  onValueChange: (value?: string) => void;
  allLabel?: string;
  placeholder?: string;
}) => {
  const { classrooms, loading } = useClassrooms();

  return (
    <Select
      value={value || (allLabel ? ALL : undefined)}
      onValueChange={(next) => onValueChange(next === ALL ? undefined : next)}
      disabled={loading}
    >
      <Select.Trigger>
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>
      <Select.Content>
        {allLabel && <Select.Item value={ALL}>{allLabel}</Select.Item>}
        {classrooms.map((classroom) => (
          <Select.Item key={classroom._id} value={classroom._id}>
            {classroom.name}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};
