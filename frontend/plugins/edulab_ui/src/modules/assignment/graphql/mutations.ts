import { gql } from '@apollo/client';

export const EDULAB_ASSIGNMENT_CREATE = gql`
  mutation edulabAssignmentCreate(
    $title: String!
    $description: String
    $type: EdulabAssignmentType!
    $labKey: String
    $rubric: String
    $maxScore: Float!
    $dueDate: Date
    $classroomId: String
  ) {
    edulabAssignmentCreate(
      title: $title
      description: $description
      type: $type
      labKey: $labKey
      rubric: $rubric
      maxScore: $maxScore
      dueDate: $dueDate
      classroomId: $classroomId
    ) {
      _id
    }
  }
`;

export const EDULAB_ASSIGNMENT_REMOVE = gql`
  mutation edulabAssignmentRemove($_id: String!) {
    edulabAssignmentRemove(_id: $_id) {
      _id
    }
  }
`;
