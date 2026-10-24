import { IContext } from '~/connectionResolvers';

export const teacherQueries = {
  edulabTeacherList: async (
    _root: undefined,
    _args: undefined,
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabTeacherRead');

    return models.Teacher.find().sort({ createdAt: 1 });
  },
};
