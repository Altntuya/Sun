import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Button,
  Form,
  Input,
  Label,
  Sheet,
  Spinner,
  Textarea,
} from 'erxes-ui';
import { IAssignment } from '@/assignment/types';
import { MeasurementTable } from '@/lab/MeasurementTable';
import { getLab } from '@/lab/registry';
import { AiSuggestion } from '@/submission/components/AiSuggestion';
import { useSubmissionReview } from '@/submission/hooks/useSubmissions';
import { ISubmission, getSubmitterName } from '@/submission/types';

const buildSchema = (maxScore: number) =>
  z.object({
    score: z.coerce
      .number()
      .min(0, 'Оноо 0-ээс бага байж болохгүй')
      .max(maxScore, `Оноо ${maxScore}-аас их байж болохгүй`),
    teacherComment: z.string().optional(),
  });

type ReviewFormValues = z.infer<ReturnType<typeof buildSchema>>;

const ReadOnlyBlock = ({ label, text }: { label: string; text?: string }) => (
  <div className="flex flex-col gap-1">
    <Label>{label}</Label>
    <p className="whitespace-pre-wrap rounded-md border bg-accent p-3 text-sm">
      {text || '—'}
    </p>
  </div>
);

export const SubmissionReviewSheet = ({
  assignment,
  submission,
  onClose,
}: {
  assignment: IAssignment;
  submission: ISubmission;
  onClose: () => void;
}) => {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(buildSchema(assignment.maxScore)),
    defaultValues: {
      score: submission.score ?? 0,
      teacherComment: submission.teacherComment ?? '',
    },
  });
  const { reviewSubmission, loading } = useSubmissionReview();
  const lab = assignment.type === 'lab' ? getLab(assignment.labKey) : undefined;
  const measurements = submission.measurements ?? [];

  const handleSubmit = (values: ReviewFormValues) =>
    reviewSubmission({ _id: submission._id, ...values }, onClose);

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <Sheet.View className="flex-col p-0 sm:max-w-2xl">
        <Sheet.Header className="px-5 shrink-0">
          <Sheet.Title>
            {getSubmitterName(submission)}
            {submission.student?.classroom
              ? ` · ${submission.student.classroom.name}`
              : ''}
          </Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col flex-1 min-h-0 bg-background"
          >
            <div className="flex-1 min-h-0 overflow-y-auto p-5 flex flex-col gap-5">
              {lab && (
                <ReadOnlyBlock label="Таамаглал" text={submission.hypothesis} />
              )}
              {lab && measurements.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Label>Хэмжилтүүд — {lab.label}</Label>
                  <MeasurementTable
                    variables={lab.variables}
                    measurements={measurements}
                  />
                  <lab.Chart measurements={measurements} />
                </div>
              )}
              <ReadOnlyBlock
                label={lab ? 'Дүгнэлт' : 'Хариулт'}
                text={submission.answer}
              />
              {assignment.rubric && (
                <ReadOnlyBlock label="Үнэлгээний шалгуур" text={assignment.rubric} />
              )}
              <AiSuggestion
                submission={submission}
                maxScore={assignment.maxScore}
                onApply={(score, feedback) => {
                  form.setValue('score', score, { shouldValidate: true });
                  form.setValue('teacherComment', feedback);
                }}
              />
              <Form.Field
                control={form.control}
                name="score"
                render={({ field }) => (
                  <Form.Item className="max-w-40">
                    <Form.Label>Оноо (/{assignment.maxScore})</Form.Label>
                    <Form.Control>
                      <Input
                        type="number"
                        min={0}
                        max={assignment.maxScore}
                        step={0.5}
                        {...field}
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="teacherComment"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Багшийн тайлбар</Form.Label>
                    <Form.Control>
                      <Textarea placeholder="Сурагчид өгөх зөвлөмж" {...field} />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            </div>
            <Sheet.Footer className="shrink-0 border-t bg-background">
              <Sheet.Close asChild>
                <Button variant="outline" type="button" size="lg">
                  Болих
                </Button>
              </Sheet.Close>
              <Button type="submit" size="lg" disabled={loading}>
                {loading ? <Spinner /> : 'Үнэлгээ батлах'}
              </Button>
            </Sheet.Footer>
          </form>
        </Form>
      </Sheet.View>
    </Sheet>
  );
};
