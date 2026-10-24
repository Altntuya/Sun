import { Select } from 'erxes-ui';
import { useStudents } from '@/student/hooks';
import { getStudentName } from '@/student/types';

// Lists the students of one class, or of every class when none is given.
export const SelectStudent = ({
  classroomId,
  value,
  onValueChange,
}: {
  classroomId?: string;
  value?: string;
  onValueChange: (value: string) => void;
}) => {
  const { students, loading } = useStudents(classroomId);

  return (
    <Select value={value || undefined} onValueChange={onValueChange}>
      <Select.Trigger disabled={loading}>
        <Select.Value
          placeholder={
            !loading && !students.length
              ? 'Сурагч бүртгэгдээгүй байна'
              : 'Сурагч сонгох'
          }
        />
      </Select.Trigger>
      <Select.Content>
        {students.map((student) => (
          <Select.Item key={student._id} value={student._id}>
            {getStudentName(student)}
            {!classroomId && student.classroom
              ? ` (${student.classroom.name})`
              : ''}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};
