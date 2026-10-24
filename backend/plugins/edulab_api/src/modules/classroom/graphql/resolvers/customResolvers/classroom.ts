import { IContext } from '~/connectionResolvers';
import { IClassroomDocument } from '@/classroom/types';

export const EdulabClassroom = {
  async teachers(
    classroom: IClassroomDocument,
    _args: undefined,
    { models }: IContext,
  ) {
    return models.Teacher.find({ _id: { $in: classroom.teacherIds ?? [] } });
  },

  async studentCount(
    classroom: IClassroomDocument,
    _args: undefined,
    { models }: IContext,
  ) {
    return models.Student.countDocuments({ classroomId: classroom._id });
  },
};
