import { escapeRegExp } from 'erxes-api-shared/utils';
import { FilterQuery } from 'mongoose';
import { IContext } from '~/connectionResolvers';
import { IStudentDocument, IStudentListParams } from '@/student/types';

export const studentQueries = {
  edulabStudentList: async (
    _root: undefined,
    { classroomId, searchValue }: IStudentListParams,
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabStudentRead');

    const filter: FilterQuery<IStudentDocument> = {};

    if (classroomId) {
      filter.classroomId = classroomId;
    }

    if (searchValue) {
      const regex = new RegExp(escapeRegExp(searchValue), 'i');

      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { studentCode: regex },
      ];
    }

    return models.Student.find(filter).sort({ lastName: 1, firstName: 1 });
  },
};
