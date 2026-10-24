import { gql } from '@apollo/client';

export const EDULAB_CLASSROOM_LIST = gql`
  query edulabClassroomList {
    edulabClassroomList {
      _id
      name
      grade
      description
      teacherIds
      teachers {
        _id
        subject
        user {
          _id
          email
          details {
            fullName
          }
        }
      }
      studentCount
    }
  }
`;

const CLASSROOM_PARAMS = `
  $name: String!
  $grade: Int
  $description: String
  $teacherIds: [String]
`;

const CLASSROOM_ARGS = `
  name: $name
  grade: $grade
  description: $description
  teacherIds: $teacherIds
`;

export const EDULAB_CLASSROOM_CREATE = gql`
  mutation edulabClassroomCreate(${CLASSROOM_PARAMS}) {
    edulabClassroomCreate(${CLASSROOM_ARGS}) {
      _id
    }
  }
`;

export const EDULAB_CLASSROOM_UPDATE = gql`
  mutation edulabClassroomUpdate($_id: String!, ${CLASSROOM_PARAMS}) {
    edulabClassroomUpdate(_id: $_id, ${CLASSROOM_ARGS}) {
      _id
    }
  }
`;

export const EDULAB_CLASSROOM_REMOVE = gql`
  mutation edulabClassroomRemove($_id: String!) {
    edulabClassroomRemove(_id: $_id) {
      _id
    }
  }
`;
