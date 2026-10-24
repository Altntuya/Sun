import { gql } from '@apollo/client';

export const EDULAB_TEACHER_LIST = gql`
  query edulabTeacherList {
    edulabTeacherList {
      _id
      userId
      subject
      phone
      user {
        _id
        email
        details {
          fullName
        }
      }
      classrooms {
        _id
        name
      }
    }
  }
`;

const TEACHER_PARAMS = `$userId: String!, $subject: String, $phone: String`;
const TEACHER_ARGS = `userId: $userId, subject: $subject, phone: $phone`;

export const EDULAB_TEACHER_CREATE = gql`
  mutation edulabTeacherCreate(${TEACHER_PARAMS}) {
    edulabTeacherCreate(${TEACHER_ARGS}) {
      _id
    }
  }
`;

export const EDULAB_TEACHER_UPDATE = gql`
  mutation edulabTeacherUpdate($_id: String!, ${TEACHER_PARAMS}) {
    edulabTeacherUpdate(_id: $_id, ${TEACHER_ARGS}) {
      _id
    }
  }
`;

export const EDULAB_TEACHER_REMOVE = gql`
  mutation edulabTeacherRemove($_id: String!) {
    edulabTeacherRemove(_id: $_id) {
      _id
    }
  }
`;
