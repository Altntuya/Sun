import { apolloCustomScalars } from 'erxes-api-shared/utils';
import { EdulabAssignment } from '@/assignment/graphql/resolvers/customResolvers/assignment';
import { EdulabClassroom } from '@/classroom/graphql/resolvers/customResolvers/classroom';
import { EdulabStudent } from '@/student/graphql/resolvers/customResolvers/student';
import { EdulabSubmission } from '@/submission/graphql/resolvers/customResolvers/submission';
import { EdulabTeacher } from '@/teacher/graphql/resolvers/customResolvers/teacher';
import { mutations } from './mutations';
import { queries } from './queries';

export const resolvers = {
  Mutation: {
    ...mutations,
  },
  Query: {
    ...queries,
  },
  ...apolloCustomScalars,
  EdulabAssignment,
  EdulabSubmission,
  EdulabClassroom,
  EdulabTeacher,
  EdulabStudent,
};
