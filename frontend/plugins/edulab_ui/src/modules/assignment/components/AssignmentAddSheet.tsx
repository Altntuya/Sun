import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IconPlus } from '@tabler/icons-react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Sheet,
  Spinner,
  Textarea,
} from 'erxes-ui';
import { useAssignmentCreate } from '@/assignment/hooks/useAssignmentMutations';
import { SelectClassroom } from '@/classroom/components/SelectClassroom';
import { LABS } from '@/lab/registry';

const assignmentSchema = z
  .object({
    title: z.string().trim().min(1, 'Даалгаврын нэр оруулна уу'),
    description: z.string().optional(),
    type: z.enum(['text', 'lab']),
    labKey: z.string().optional(),
    classroomId: z.string().optional(),
    rubric: z.string().optional(),
    maxScore: z.coerce.number().positive('Оноо 0-ээс их байх ёстой'),
    dueDate: z.date().optional(),
  })
  .refine((value) => value.type !== 'lab' || Boolean(value.labKey), {
    message: 'Lab сонгоно уу',
    path: ['labKey'],
  });

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

const DEFAULT_VALUES: AssignmentFormValues = {
  title: '',
  description: '',
  type: 'lab',
  labKey: 'ohmsLaw',
  rubric: '',
  maxScore: 10,
};

const AssignmentForm = ({ onDone }: { onDone: () => void }) => {
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: DEFAULT_VALUES,
  });
  const type = useWatch({ control: form.control, name: 'type' });
  const { createAssignment, loading } = useAssignmentCreate();

  const handleSubmit = (values: AssignmentFormValues) =>
    createAssignment(
      { ...values, labKey: values.type === 'lab' ? values.labKey : undefined },
      () => {
        form.reset(DEFAULT_VALUES);
        onDone();
      },
    );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col flex-1 min-h-0 bg-background"
      >
        <div className="flex-1 min-h-0 overflow-y-auto p-5 flex flex-col gap-5">
          <Form.Field
            control={form.control}
            name="title"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Даалгаврын нэр</Form.Label>
                <Form.Control>
                  <Input
                    placeholder="Ж: Омын хуулийг туршилтаар батлах"
                    autoComplete="off"
                    {...field}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
          <Form.Field
            control={form.control}
            name="type"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Төрөл</Form.Label>
                <Select onValueChange={field.onChange} value={field.value}>
                  <Form.Control>
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                  </Form.Control>
                  <Select.Content>
                    <Select.Item value="lab">Virtual lab</Select.Item>
                    <Select.Item value="text">Бичгийн даалгавар</Select.Item>
                  </Select.Content>
                </Select>
                <Form.Message />
              </Form.Item>
            )}
          />
          {type === 'lab' && (
            <Form.Field
              control={form.control}
              name="labKey"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Lab симуляц</Form.Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <Form.Control>
                      <Select.Trigger>
                        <Select.Value placeholder="Lab сонгох" />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {LABS.map((lab) => (
                        <Select.Item key={lab.key} value={lab.key}>
                          {lab.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                  <Form.Message />
                </Form.Item>
              )}
            />
          )}
          <Form.Field
            control={form.control}
            name="classroomId"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Анги</Form.Label>
                <Form.Control>
                  <SelectClassroom
                    value={field.value}
                    onValueChange={field.onChange}
                    allLabel="Бүх анги"
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
          <Form.Field
            control={form.control}
            name="description"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Даалгаврын тайлбар</Form.Label>
                <Form.Control>
                  <Textarea
                    placeholder="Сурагчид юу хийх ёстойг бичнэ үү"
                    {...field}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
          <Form.Field
            control={form.control}
            name="rubric"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Үнэлгээний шалгуур (rubric)</Form.Label>
                <Form.Control>
                  <Textarea
                    placeholder="Ж: Таамаглал — 2, 3+ хэмжилт — 3, дүгнэлт өгөгдөлтэй нийцсэн — 5"
                    {...field}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
          <div className="grid grid-cols-2 gap-5">
            <Form.Field
              control={form.control}
              name="maxScore"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Дээд оноо</Form.Label>
                  <Form.Control>
                    <Input type="number" min={1} {...field} />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Дуусах хугацаа</Form.Label>
                  <Form.Control>
                    <DatePicker
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(date instanceof Date ? date : undefined)
                      }
                      placeholder="Огноо сонгох"
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </div>
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
    </Form>
  );
};

export const AssignmentAddSheet = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Шинэ даалгавар
        </Button>
      </Sheet.Trigger>
      <Sheet.View className="flex-col p-0 sm:max-w-md">
        <Sheet.Header className="px-5 shrink-0">
          <Sheet.Title>Шинэ даалгавар</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <AssignmentForm onDone={() => setOpen(false)} />
      </Sheet.View>
    </Sheet>
  );
};
