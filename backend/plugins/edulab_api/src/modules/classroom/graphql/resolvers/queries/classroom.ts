import { IContext } from '~/connectionResolvers';

export const classroomQueries = {
  edulabClassroomList: async (
    _root: undefined,
    _args: undefined,
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabClassroomRead');

    return models.Classroom.find().sort({ grade: 1, name: 1 });
  },

  edulabClassroomDetail: async (
    _root: undefined,
    { _id }: { _id: string },
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabClassroomRead');

    return models.Classroom.getClassroom(_id);
  },
};
