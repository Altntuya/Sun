import { IContext } from '~/connectionResolvers';
import { IStudent } from '@/student/types';

export const studentMutations = {
  edulabStudentCreate: async (
    _root: undefined,
    doc: IStudent,
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabStudentManage');

    return models.Student.createStudent(doc);
  },

  edulabStudentUpdate: async (
    _root: undefined,
    { _id, ...doc }: IStudent & { _id: string },
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabStudentManage');

    return models.Student.updateStudent(_id, doc);
  },

  edulabStudentRemove: async (
    _root: undefined,
    { _id }: { _id: string },
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabStudentManage');

    return models.Student.removeStudent(_id);
  },
};
