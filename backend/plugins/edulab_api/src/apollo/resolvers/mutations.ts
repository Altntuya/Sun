import { assignmentMutations } from '@/assignment/graphql/resolvers/mutations/assignment';
import { classroomMutations } from '@/classroom/graphql/resolvers/mutations/classroom';
import { studentMutations } from '@/student/graphql/resolvers/mutations/student';
import { submissionMutations } from '@/submission/graphql/resolvers/mutations/submission';
import { teacherMutations } from '@/teacher/graphql/resolvers/mutations/teacher';

export const mutations = {
  ...assignmentMutations,
  ...submissionMutations,
  ...classroomMutations,
  ...teacherMutations,
  ...studentMutations,
};
