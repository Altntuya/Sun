export const types = `
  type EdulabStudent {
    _id: String!
    firstName: String!
    lastName: String
    classroomId: String!
    classroom: EdulabClassroom
    studentCode: String
    parentName: String
    parentPhone: String
    customerId: String
    customer: Customer
    submissionCount: Int
    createdAt: Date
  }
`;

export const queries = `
  edulabStudentList(classroomId: String, searchValue: String): [EdulabStudent]
`;

const mutationParams = `
  firstName: String!
  lastName: String
  classroomId: String!
  studentCode: String
  parentName: String
  parentPhone: String
  customerId: String
`;

export const mutations = `
  edulabStudentCreate(${mutationParams}): EdulabStudent
  edulabStudentUpdate(_id: String!, ${mutationParams}): EdulabStudent
  edulabStudentRemove(_id: String!): EdulabStudent
`;
