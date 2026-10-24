import { IContext } from '~/connectionResolvers';
import { ITeacher } from '@/teacher/types';

export const teacherMutations = {
  edulabTeacherCreate: async (
    _root: undefined,
    doc: ITeacher,
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabTeacherManage');

    return models.Teacher.createTeacher(doc);
  },

  edulabTeacherUpdate: async (
    _root: undefined,
    { _id, ...doc }: ITeacher & { _id: string },
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabTeacherManage');

    return models.Teacher.updateTeacher(_id, doc);
  },

  edulabTeacherRemove: async (
    _root: undefined,
    { _id }: { _id: string },
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabTeacherManage');

    return models.Teacher.removeTeacher(_id);
  },
};
