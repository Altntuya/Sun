import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IconSend } from '@tabler/icons-react';
import { Button, Card, Form, Spinner, Textarea } from 'erxes-ui';
import { IAssignment } from '@/assignment/types';
import { getLab } from '@/lab/registry';
import { SelectStudent } from '@/student/components/SelectStudent';
import { useSubmissionCreate } from '@/submission/hooks/useSubmissions';

const buildSchema = (isLab: boolean) =>
  z.object({
    studentId: z.string().min(1, 'Сурагчаа сонгоно уу'),
    hypothesis: isLab
      ? z.string().trim().min(1, 'Туршилтын өмнө таамаглалаа бичнэ үү')
      : z.string().optional(),
    measurements: isLab
      ? z
          .array(z.record(z.number()))
          .min(1, 'Дор хаяж нэг хэмжилт хийнэ үү')
      : z.array(z.record(z.number())),
    answer: z.string().trim().min(1, 'Хариулт, дүгнэлтээ бичнэ үү'),
  });

type SubmissionFormValues = z.infer<ReturnType<typeof buildSchema>>;

const Step = ({
  index,
  title,
  description,
  children,
}: {
  index: number;
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <section className="flex flex-col gap-3">
    <div>
      <h3 className="text-base font-semibold">
        {index}. {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    {children}
  </section>
);

export const SubmissionForm = ({
  assignment,
  onSubmitted,
}: {
  assignment: IAssignment;
  onSubmitted: () => void;
}) => {
  const lab = assignment.type === 'lab' ? getLab(assignment.labKey) : undefined;
  const isLab = Boolean(lab);
  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(buildSchema(isLab)),
    defaultValues: {
      studentId: '',
      hypothesis: '',
      measurements: [],
      answer: '',
    },
  });
  const { createSubmission, loading } = useSubmissionCreate();

  const handleSubmit = (values: SubmissionFormValues) =>
    createSubmission(
      {
        assignmentId: assignment._id,
        studentId: values.studentId,
        hypothesis: values.hypothesis,
        answer: values.answer,
        measurements: isLab ? values.measurements : undefined,
      },
      onSubmitted,
    );

  let step = 1;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-8"
      >
        <Step
          index={step++}
          title="Сурагч"
          description={
            assignment.classroom
              ? `${assignment.classroom.name} ангийн сурагчид`
              : undefined
          }
        >
          <Form.Field
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <Form.Item className="max-w-sm">
                <Form.Control>
                  <SelectStudent
                    classroomId={assignment.classroomId}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
        </Step>

        {lab && (
          <Step
            index={step++}
            title="Таамаглал"
            description="Туршилт хийхээсээ өмнө юу болно гэж бодож байгаагаа бичнэ үү."
          >
            <Form.Field
              control={form.control}
              name="hypothesis"
              render={({ field }) => (
                <Form.Item>
                  <Form.Control>
                    <Textarea placeholder="Миний таамаглал..." {...field} />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </Step>
        )}

        {lab && (
          <Step
            index={step++}
            title="Туршилт ба хэмжилт"
            description={lab.label}
          >
            <Form.Field
              control={form.control}
              name="measurements"
              render={({ field }) => (
                <Form.Item>
                  <lab.Simulation
                    measurements={field.value}
                    onChange={field.onChange}
                  />
                  <Form.Message />
                </Form.Item>
              )}
            />
          </Step>
        )}

        <Step
          index={step++}
          title={isLab ? 'Дүгнэлт' : 'Хариулт'}
          description={
            isLab
              ? 'Хэмжилтүүд таны таамаглалыг баталсан уу, няцаасан уу? Тоогоор тайлбарлана уу.'
              : undefined
          }
        >
          <Form.Field
            control={form.control}
            name="answer"
            render={({ field }) => (
              <Form.Item>
                <Form.Control>
                  <Textarea
                    className="min-h-32"
                    placeholder={isLab ? 'Миний дүгнэлт...' : 'Миний хариулт...'}
                    {...field}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
        </Step>

        <Card className="flex items-center justify-end gap-3 p-4">
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? <Spinner /> : <IconSend />}
            Илгээх
          </Button>
        </Card>
      </form>
    </Form>
  );
};
