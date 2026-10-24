import { gql } from '@apollo/client';

export const EDULAB_SUBMISSION_LIST = gql`
  query edulabSubmissionList($assignmentId: String, $limit: Int) {
    edulabSubmissionList(assignmentId: $assignmentId, limit: $limit) {
      list {
        _id
        assignmentId
        studentId
        student {
          _id
          firstName
          lastName
          classroom {
            _id
            name
          }
        }
        customerId
        customer {
          _id
          firstName
          lastName
          primaryEmail
        }
        hypothesis
        answer
        measurements
        status
        score
        teacherComment
        reviewedAt
        aiStatus
        aiScore
        aiFeedback
        aiCriteria {
          criterion
          score
          max
          comment
        }
        aiError
        aiModel
        createdAt
      }
      totalCount
    }
  }
`;
