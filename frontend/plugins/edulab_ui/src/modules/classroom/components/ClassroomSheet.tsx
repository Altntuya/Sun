import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Input, MultipleSelector, Textarea } from 'erxes-ui';
import { EdulabSheet, EdulabSheetForm } from '~/components/EdulabSheet';
import { useClassroomCreate, useClassroomUpdate } from '@/classroom/hooks';
import { IClassroom, getTeacherName } from '@/classroom/types';
import { useTeachers } from '@/teacher/hooks';

const classroomSchema = z.object({
  name: z.string().trim().min(1, 'Ангийн нэр оруулна уу'),
  grade: z.coerce.number().int().min(1).max(12).optional(),
  description: z.string().optional(),
  teacherIds: z.array(z.string()),
});

type ClassroomFormValues = z.infer<typeof classroomSchema>;

const ClassroomForm = ({
  classroom,
  onDone,
}: {
  classroom?: IClassroom;
  onDone: () => void;
}) => {
  const form = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      name: classroom?.name ?? '',
      grade: classroom?.grade,
      description: classroom?.description ?? '',
      teacherIds: classroom?.teacherIds ?? [],
    },
  });
  const { teachers } = useTeachers();
  const create = useClassroomCreate();
  const update = useClassroomUpdate();
  const teacherOptions = teachers.map((teacher) => ({
    value: teacher._id,
    label: getTeacherName(teacher),
  }));

  const handleSubmit = form.handleSubmit((values) =>
    classroom
      ? update.run({ _id: classroom._id, ...values }, onDone)
      : create.run(values, onDone),
  );

  return (
    <Form {...form}>
      <EdulabSheetForm
        onSubmit={handleSubmit}
        loading={create.loading || update.loading}
      >
        <div className="grid grid-cols-2 gap-5">
          <Form.Field
            control={form.control}
            name="name"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Ангийн нэр</Form.Label>
                <Form.Control>
                  <Input placeholder="Ж: 9А" autoComplete="off" {...field} />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
          <Form.Field
            control={form.control}
            name="grade"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Анги (1–12)</Form.Label>
                <Form.Control>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    {...field}
                    value={field.value ?? ''}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
        </div>
        <Form.Field
          control={form.control}
          name="teacherIds"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Хариуцсан багш нар</Form.Label>
              <MultipleSelector
                options={teacherOptions}
                value={teacherOptions.filter((option) =>
                  field.value.includes(option.value),
                )}
                onChange={(options) =>
                  field.onChange(options.map((option) => option.value))
                }
                placeholder="Багш сонгох"
                hidePlaceholderWhenSelected
                emptyIndicator={
                  <p className="text-center text-sm text-muted-foreground">
                    Эхлээд &quot;Багш нар&quot; хэсэгт багш бүртгэнэ үү
                  </p>
                }
              />
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name="description"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Тайлбар</Form.Label>
              <Form.Control>
                <Textarea {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
      </EdulabSheetForm>
    </Form>
  );
};

export const ClassroomSheet = ({
  open,
  onOpenChange,
  classroom,
  trigger,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroom?: IClassroom;
  trigger?: React.ReactNode;
}) => (
  <EdulabSheet
    title={classroom ? 'Анги засах' : 'Шинэ анги'}
    open={open}
    onOpenChange={onOpenChange}
    trigger={trigger}
  >
    <ClassroomForm
      key={classroom?._id ?? 'new'}
      classroom={classroom}
      onDone={() => onOpenChange(false)}
    />
  </EdulabSheet>
);
