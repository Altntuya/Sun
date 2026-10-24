import { IContext } from '~/connectionResolvers';
import { IAssignmentDocument } from '@/assignment/types';

export const EdulabAssignment = {
  async classroom(
    assignment: IAssignmentDocument,
    _args: undefined,
    { models }: IContext,
  ) {
    return assignment.classroomId
      ? models.Classroom.findOne({ _id: assignment.classroomId })
      : null;
  },

  async submissionCount(
    assignment: IAssignmentDocument,
    _args: undefined,
    { models }: IContext,
  ) {
    return models.Submission.countDocuments({ assignmentId: assignment._id });
  },
};
