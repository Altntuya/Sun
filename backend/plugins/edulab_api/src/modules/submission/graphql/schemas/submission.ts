import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  extend type Customer @key(fields: "_id") {
    _id: String @external
  }

  enum EdulabSubmissionStatus {
    submitted
    reviewed
  }

  enum EdulabAiStatus {
    pending
    done
    failed
  }

  type EdulabAiCriterion {
    criterion: String!
    score: Float!
    max: Float
    comment: String
  }

  type EdulabSubmission {
    _id: String!
    assignmentId: String!
    assignment: EdulabAssignment
    studentId: String
    student: EdulabStudent
    customerId: String
    customer: Customer
    hypothesis: String
    answer: String!
    measurements: [JSON]
    status: EdulabSubmissionStatus!
    score: Float
    teacherComment: String
    submittedBy: String
    reviewedBy: String
    reviewedAt: Date
    aiStatus: EdulabAiStatus
    aiScore: Float
    aiFeedback: String
    aiCriteria: [EdulabAiCriterion]
    aiError: String
    aiModel: String
    aiCheckedAt: Date
    createdAt: Date
    updatedAt: Date
  }

  type EdulabSubmissionListResponse {
    list: [EdulabSubmission]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const listParams = `
  assignmentId: String
  studentId: String
  customerId: String
  status: EdulabSubmissionStatus
  ${GQL_CURSOR_PARAM_DEFS}
`;

export const queries = `
  edulabSubmissionList(${listParams}): EdulabSubmissionListResponse
  edulabSubmissionDetail(_id: String!): EdulabSubmission
`;

export const mutations = `
  edulabSubmissionCreate(
    assignmentId: String!
    studentId: String!
    hypothesis: String
    answer: String!
    measurements: [JSON]
  ): EdulabSubmission
  edulabSubmissionReview(
    _id: String!
    score: Float!
    teacherComment: String
  ): EdulabSubmission
  edulabSubmissionAiCheck(_id: String!): EdulabSubmission
`;
