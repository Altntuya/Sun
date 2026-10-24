import { gql } from '@apollo/client';

export const EDULAB_SUBMISSION_CREATE = gql`
  mutation edulabSubmissionCreate(
    $assignmentId: String!
    $studentId: String!
    $hypothesis: String
    $answer: String!
    $measurements: [JSON]
  ) {
    edulabSubmissionCreate(
      assignmentId: $assignmentId
      studentId: $studentId
      hypothesis: $hypothesis
      answer: $answer
      measurements: $measurements
    ) {
      _id
    }
  }
`;

export const EDULAB_SUBMISSION_AI_CHECK = gql`
  mutation edulabSubmissionAiCheck($_id: String!) {
    edulabSubmissionAiCheck(_id: $_id) {
      _id
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
    }
  }
`;

export const EDULAB_SUBMISSION_REVIEW = gql`
  mutation edulabSubmissionReview(
    $_id: String!
    $score: Float!
    $teacherComment: String
  ) {
    edulabSubmissionReview(
      _id: $_id
      score: $score
      teacherComment: $teacherComment
    ) {
      _id
      status
      score
      teacherComment
      reviewedAt
    }
  }
`;
