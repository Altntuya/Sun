import { IContext } from '~/connectionResolvers';
import { IStudentDocument } from '@/student/types';

export const EdulabStudent = {
  async classroom(
    student: IStudentDocument,
    _args: undefined,
    { models }: IContext,
  ) {
    return models.Classroom.findOne({ _id: student.classroomId });
  },

  customer(student: IStudentDocument) {
    return student.customerId
      ? { __typename: 'Customer', _id: student.customerId }
      : null;
  },

  async submissionCount(
    student: IStudentDocument,
    _args: undefined,
    { models }: IContext,
  ) {
    return models.Submission.countDocuments({ studentId: student._id });
  },
};
