import { IContext } from '~/connectionResolvers';
import { ITeacherDocument } from '@/teacher/types';

export const EdulabTeacher = {
  user(teacher: ITeacherDocument) {
    return { __typename: 'User', _id: teacher.userId };
  },

  async classrooms(
    teacher: ITeacherDocument,
    _args: undefined,
    { models }: IContext,
  ) {
    return models.Classroom.find({ teacherIds: teacher._id }).sort({ name: 1 });
  },
};
