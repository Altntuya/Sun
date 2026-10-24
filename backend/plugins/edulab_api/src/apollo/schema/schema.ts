import {
  mutations as AssignmentMutations,
  queries as AssignmentQueries,
  types as AssignmentTypes,
} from '@/assignment/graphql/schemas/assignment';
import {
  mutations as ClassroomMutations,
  queries as ClassroomQueries,
  types as ClassroomTypes,
} from '@/classroom/graphql/schemas/classroom';
import {
  mutations as StudentMutations,
  queries as StudentQueries,
  types as StudentTypes,
} from '@/student/graphql/schemas/student';
import {
  mutations as SubmissionMutations,
  queries as SubmissionQueries,
  types as SubmissionTypes,
} from '@/submission/graphql/schemas/submission';
import {
  mutations as TeacherMutations,
  queries as TeacherQueries,
  types as TeacherTypes,
} from '@/teacher/graphql/schemas/teacher';

export const types = `
  ${AssignmentTypes}
  ${SubmissionTypes}
  ${ClassroomTypes}
  ${TeacherTypes}
  ${StudentTypes}
`;

export const queries = `
  ${AssignmentQueries}
  ${SubmissionQueries}
  ${ClassroomQueries}
  ${TeacherQueries}
  ${StudentQueries}
`;

export const mutations = `
  ${AssignmentMutations}
  ${SubmissionMutations}
  ${ClassroomMutations}
  ${TeacherMutations}
  ${StudentMutations}
`;
