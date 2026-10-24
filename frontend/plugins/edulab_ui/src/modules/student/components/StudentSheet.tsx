import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Input } from 'erxes-ui';
import { SelectCustomer } from 'ui-modules';
import { EdulabSheet, EdulabSheetForm } from '~/components/EdulabSheet';
import { SelectClassroom } from '@/classroom/components/SelectClassroom';
import { useStudentCreate, useStudentUpdate } from '@/student/hooks';
import { IStudent } from '@/student/types';

const studentSchema = z.object({
  lastName: z.string().optional(),
  firstName: z.string().trim().min(1, 'Нэр оруулна уу'),
  classroomId: z.string().min(1, 'Анги сонгоно уу'),
  studentCode: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  customerId: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

const TextField = ({
  form,
  name,
  label,
  placeholder,
}: {
  form: ReturnType<typeof useForm<StudentFormValues>>;
  name: 'lastName' | 'firstName' | 'studentCode' | 'parentName' | 'parentPhone';
  label: string;
  placeholder?: string;
}) => (
  <Form.Field
    control={form.control}
    name={name}
    render={({ field }) => (
      <Form.Item>
        <Form.Label>{label}</Form.Label>
        <Form.Control>
          <Input placeholder={placeholder} autoComplete="off" {...field} />
        </Form.Control>
        <Form.Message />
      </Form.Item>
    )}
  />
);

const StudentForm = ({
  student,
  defaultClassroomId,
  onDone,
}: {
  student?: IStudent;
  defaultClassroomId?: string;
  onDone: () => void;
}) => {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      lastName: student?.lastName ?? '',
      firstName: student?.firstName ?? '',
      classroomId: student?.classroomId ?? defaultClassroomId ?? '',
      studentCode: student?.studentCode ?? '',
      parentName: student?.parentName ?? '',
      parentPhone: student?.parentPhone ?? '',
      customerId: student?.customerId ?? '',
    },
  });
  const create = useStudentCreate();
  const update = useStudentUpdate();

  const handleSubmit = form.handleSubmit((values) => {
    const input = { ...values, customerId: values.customerId || undefined };

    return student
      ? update.run({ _id: student._id, ...input }, onDone)
      : create.run(input, onDone);
  });

  return (
    <Form {...form}>
      <EdulabSheetForm
        onSubmit={handleSubmit}
        loading={create.loading || update.loading}
      >
        <div className="grid grid-cols-2 gap-5">
          <TextField form={form} name="lastName" label="Овог" />
          <TextField form={form} name="firstName" label="Нэр" />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <Form.Field
            control={form.control}
            name="classroomId"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Анги</Form.Label>
                <Form.Control>
                  <SelectClassroom
                    value={field.value}
                    onValueChange={(value) => field.onChange(value ?? '')}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
          <TextField
            form={form}
            name="studentCode"
            label="Сурагчийн код"
            placeholder="Ж: S-1024"
          />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <TextField form={form} name="parentName" label="Эцэг эхийн нэр" />
          <TextField form={form} name="parentPhone" label="Эцэг эхийн утас" />
        </div>
        <Form.Field
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>erxes Contact (заавал биш)</Form.Label>
              <Form.Control>
                <SelectCustomer
                  mode="single"
                  value={field.value}
                  onValueChange={(value) =>
                    field.onChange(Array.isArray(value) ? value[0] : value)
                  }
                />
              </Form.Control>
              <p className="text-xs text-muted-foreground">
                Холбосон тохиолдолд сурагчийн илгээлтүүд Contacts хэсэгт мөн
                харагдана.
              </p>
              <Form.Message />
            </Form.Item>
          )}
        />
      </EdulabSheetForm>
    </Form>
  );
};

export const StudentSheet = ({
  open,
  onOpenChange,
  student,
  defaultClassroomId,
  trigger,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: IStudent;
  defaultClassroomId?: string;
  trigger?: React.ReactNode;
}) => (
  <EdulabSheet
    title={student ? 'Сурагч засах' : 'Шинэ сурагч'}
    open={open}
    onOpenChange={onOpenChange}
    trigger={trigger}
  >
    <StudentForm
      key={student?._id ?? `new-${defaultClassroomId ?? ''}`}
      student={student}
      defaultClassroomId={defaultClassroomId}
      onDone={() => onOpenChange(false)}
    />
  </EdulabSheet>
);
