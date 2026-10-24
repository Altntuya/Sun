import { IContext } from '~/connectionResolvers';
import { ISubmission, ISubmissionReview } from '@/submission/types';

export const submissionMutations = {
  edulabSubmissionCreate: async (
    _root: undefined,
    doc: ISubmission,
    { models, user, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabSubmissionCreate');

    return models.Submission.createSubmission(doc, user);
  },

  edulabSubmissionReview: async (
    _root: undefined,
    { _id, ...review }: ISubmissionReview & { _id: string },
    { models, user, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabSubmissionReview');

    return models.Submission.reviewSubmission(_id, review, user);
  },

  edulabSubmissionAiCheck: async (
    _root: undefined,
    { _id }: { _id: string },
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabSubmissionReview');

    return models.Submission.aiCheckSubmission(_id);
  },
};
