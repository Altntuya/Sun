import { gql } from '@apollo/client';

const ASSIGNMENT_FIELDS = `
  _id
  title
  description
  type
  labKey
  rubric
  maxScore
  dueDate
  classroomId
  classroom {
    _id
    name
  }
  createdAt
  submissionCount
`;

export const EDULAB_ASSIGNMENT_LIST = gql`
  query edulabAssignmentList($limit: Int) {
    edulabAssignmentList(limit: $limit) {
      list {
        ${ASSIGNMENT_FIELDS}
      }
      totalCount
    }
  }
`;

export const EDULAB_ASSIGNMENT_DETAIL = gql`
  query edulabAssignmentDetail($_id: String!) {
    edulabAssignmentDetail(_id: $_id) {
      ${ASSIGNMENT_FIELDS}
    }
  }
`;
