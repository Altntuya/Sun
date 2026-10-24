import { gql } from '@apollo/client';

export const EDULAB_STUDENT_LIST = gql`
  query edulabStudentList($classroomId: String, $searchValue: String) {
    edulabStudentList(classroomId: $classroomId, searchValue: $searchValue) {
      _id
      firstName
      lastName
      classroomId
      classroom {
        _id
        name
      }
      studentCode
      parentName
      parentPhone
      customerId
      submissionCount
    }
  }
`;

const STUDENT_PARAMS = `
  $firstName: String!
  $lastName: String
  $classroomId: String!
  $studentCode: String
  $parentName: String
  $parentPhone: String
  $customerId: String
`;

const STUDENT_ARGS = `
  firstName: $firstName
  lastName: $lastName
  classroomId: $classroomId
  studentCode: $studentCode
  parentName: $parentName
  parentPhone: $parentPhone
  customerId: $customerId
`;

export const EDULAB_STUDENT_CREATE = gql`
  mutation edulabStudentCreate(${STUDENT_PARAMS}) {
    edulabStudentCreate(${STUDENT_ARGS}) {
      _id
    }
  }
`;

export const EDULAB_STUDENT_UPDATE = gql`
  mutation edulabStudentUpdate($_id: String!, ${STUDENT_PARAMS}) {
    edulabStudentUpdate(_id: $_id, ${STUDENT_ARGS}) {
      _id
    }
  }
`;

export const EDULAB_STUDENT_REMOVE = gql`
  mutation edulabStudentRemove($_id: String!) {
    edulabStudentRemove(_id: $_id) {
      _id
    }
  }
`;
