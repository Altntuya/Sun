import { IContext } from '~/connectionResolvers';
import { GEMMA_TIMEOUT_MS } from '@/ai/gemma';
import { ISubmissionDocument } from '@/submission/types';

// Longer than the Gemma request timeout: a check still pending after this
// was cut off, typically by the service restarting mid-request.
const STALE_AI_CHECK_MS = GEMMA_TIMEOUT_MS + 30_000;

const isStaleAiCheck = (submission: ISubmissionDocument) => {
  if (submission.aiStatus !== 'pending') {
    return false;
  }

  const requestedAt = submission.aiRequestedAt ?? submission.updatedAt;

  return Date.now() - new Date(requestedAt).getTime() > STALE_AI_CHECK_MS;
};

export const EdulabSubmission = {
  customer(submission: ISubmissionDocument) {
    return submission.customerId
      ? { __typename: 'Customer', _id: submission.customerId }
      : null;
  },

  async student(
    submission: ISubmissionDocument,
    _args: undefined,
    { models }: IContext,
  ) {
    return submission.studentId
      ? models.Student.findOne({ _id: submission.studentId })
      : null;
  },

  async assignment(
    submission: ISubmissionDocument,
    _args: undefined,
    { models }: IContext,
  ) {
    return models.Assignment.findOne({ _id: submission.assignmentId });
  },

  aiStatus(submission: ISubmissionDocument) {
    return isStaleAiCheck(submission) ? 'failed' : submission.aiStatus;
  },

  aiError(submission: ISubmissionDocument) {
    return isStaleAiCheck(submission)
      ? 'AI шалгалт тасалдсан (хугацаа хэтэрсэн). "Дахин шалгах" дээр дарна уу.'
      : submission.aiError;
  },
};
