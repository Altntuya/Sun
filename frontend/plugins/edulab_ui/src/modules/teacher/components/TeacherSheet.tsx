import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Input } from 'erxes-ui';
import { SelectMember } from 'ui-modules';
import { EdulabSheet, EdulabSheetForm } from '~/components/EdulabSheet';
import { useTeacherCreate, useTeacherUpdate } from '@/teacher/hooks';
import { ITeacher } from '@/teacher/types';

const teacherSchema = z.object({
  userId: z.string().min(1, 'erxes хэрэглэгч сонгоно уу'),
  subject: z.string().optional(),
  phone: z.string().optional(),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

const TeacherForm = ({
  teacher,
  onDone,
}: {
  teacher?: ITeacher;
  onDone: () => void;
}) => {
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      userId: teacher?.userId ?? '',
      subject: teacher?.subject ?? '',
      phone: teacher?.phone ?? '',
    },
  });
  const create = useTeacherCreate();
  const update = useTeacherUpdate();

  const handleSubmit = form.handleSubmit((values) =>
    teacher
      ? update.run({ _id: teacher._id, ...values }, onDone)
      : create.run(values, onDone),
  );

  return (
    <Form {...form}>
      <EdulabSheetForm
        onSubmit={handleSubmit}
        loading={create.loading || update.loading}
      >
        <Form.Field
          control={form.control}
          name="userId"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>erxes хэрэглэгч</Form.Label>
              <SelectMember.FormItem
                mode="single"
                value={field.value}
                onValueChange={(value) =>
                  field.onChange(Array.isArray(value) ? value[0] : value)
                }
                placeholder="Багш болох хэрэглэгчийг сонгох"
              />
              <p className="text-xs text-muted-foreground">
                Багш erxes-д энэ хэрэглэгчээр нэвтэрнэ.
              </p>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name="subject"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Заадаг хичээл</Form.Label>
              <Form.Control>
                <Input placeholder="Ж: Физик" {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name="phone"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Утас</Form.Label>
              <Form.Control>
                <Input type="tel" {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
      </EdulabSheetForm>
    </Form>
  );
};

export const TeacherSheet = ({
  open,
  onOpenChange,
  teacher,
  trigger,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher?: ITeacher;
  trigger?: React.ReactNode;
}) => (
  <EdulabSheet
    title={teacher ? 'Багш засах' : 'Багш бүртгэх'}
    open={open}
    onOpenChange={onOpenChange}
    trigger={trigger}
  >
    <TeacherForm
      key={teacher?._id ?? 'new'}
      teacher={teacher}
      onDone={() => onOpenChange(false)}
    />
  </EdulabSheet>
);
