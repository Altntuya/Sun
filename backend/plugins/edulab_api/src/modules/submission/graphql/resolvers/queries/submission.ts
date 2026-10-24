import { cursorPaginate } from 'erxes-api-shared/utils';
import { FilterQuery } from 'mongoose';
import { IContext } from '~/connectionResolvers';
import {
  ISubmissionDocument,
  ISubmissionListParams,
} from '@/submission/types';

export const submissionQueries = {
  edulabSubmissionList: async (
    _root: undefined,
    params: ISubmissionListParams,
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabSubmissionRead');

    const filter: FilterQuery<ISubmissionDocument> = {};

    if (params.assignmentId) {
      filter.assignmentId = params.assignmentId;
    }

    if (params.studentId) {
      filter.studentId = params.studentId;
    }

    if (params.customerId) {
      filter.customerId = params.customerId;
    }

    if (params.status) {
      filter.status = params.status;
    }

    return cursorPaginate<ISubmissionDocument>({
      model: models.Submission,
      params: { ...params, orderBy: { createdAt: -1 } },
      query: filter,
    });
  },

  edulabSubmissionDetail: async (
    _root: undefined,
    { _id }: { _id: string },
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabSubmissionRead');

    return models.Submission.getSubmission(_id);
  },
};
