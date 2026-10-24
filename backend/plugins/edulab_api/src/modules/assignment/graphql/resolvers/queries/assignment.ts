import { cursorPaginate, escapeRegExp } from 'erxes-api-shared/utils';
import { FilterQuery } from 'mongoose';
import { IContext } from '~/connectionResolvers';
import {
  IAssignmentDocument,
  IAssignmentListParams,
} from '@/assignment/types';

export const assignmentQueries = {
  edulabAssignmentList: async (
    _root: undefined,
    params: IAssignmentListParams,
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabAssignmentRead');

    const filter: FilterQuery<IAssignmentDocument> = {};

    if (params.type) {
      filter.type = params.type;
    }

    if (params.classroomId) {
      filter.classroomId = params.classroomId;
    }

    if (params.searchValue) {
      filter.title = new RegExp(`.*${escapeRegExp(params.searchValue)}.*`, 'i');
    }

    return cursorPaginate<IAssignmentDocument>({
      model: models.Assignment,
      params: { ...params, orderBy: { createdAt: -1 } },
      query: filter,
    });
  },

  edulabAssignmentDetail: async (
    _root: undefined,
    { _id }: { _id: string },
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabAssignmentRead');

    return models.Assignment.getAssignment(_id);
  },
};
