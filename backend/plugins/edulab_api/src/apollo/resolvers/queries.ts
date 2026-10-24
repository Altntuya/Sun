import { assignmentQueries } from '@/assignment/graphql/resolvers/queries/assignment';
import { classroomQueries } from '@/classroom/graphql/resolvers/queries/classroom';
import { studentQueries } from '@/student/graphql/resolvers/queries/student';
import { submissionQueries } from '@/submission/graphql/resolvers/queries/submission';
import { teacherQueries } from '@/teacher/graphql/resolvers/queries/teacher';

export const queries = {
  ...assignmentQueries,
  ...submissionQueries,
  ...classroomQueries,
  ...teacherQueries,
  ...studentQueries,
};
