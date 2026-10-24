import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  enum EdulabAssignmentType {
    text
    lab
  }

  type EdulabAssignment {
    _id: String!
    title: String!
    description: String
    type: EdulabAssignmentType!
    labKey: String
    rubric: String
    maxScore: Float!
    dueDate: Date
    classroomId: String
    classroom: EdulabClassroom
    createdBy: String
    createdAt: Date
    updatedAt: Date
    submissionCount: Int
  }

  type EdulabAssignmentListResponse {
    list: [EdulabAssignment]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const listParams = `
  searchValue: String
  type: EdulabAssignmentType
  classroomId: String
  ${GQL_CURSOR_PARAM_DEFS}
`;

export const queries = `
  edulabAssignmentList(${listParams}): EdulabAssignmentListResponse
  edulabAssignmentDetail(_id: String!): EdulabAssignment
`;

const mutationParams = `
  title: String!
  description: String
  type: EdulabAssignmentType!
  labKey: String
  rubric: String
  maxScore: Float!
  dueDate: Date
  classroomId: String
`;

export const mutations = `
  edulabAssignmentCreate(${mutationParams}): EdulabAssignment
  edulabAssignmentUpdate(_id: String!, ${mutationParams}): EdulabAssignment
  edulabAssignmentRemove(_id: String!): EdulabAssignment
`;
