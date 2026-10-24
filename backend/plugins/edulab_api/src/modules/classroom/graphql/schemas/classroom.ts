export const types = `
  type EdulabClassroom {
    _id: String!
    name: String!
    grade: Int
    description: String
    teacherIds: [String]
    teachers: [EdulabTeacher]
    studentCount: Int
    createdAt: Date
  }
`;

export const queries = `
  edulabClassroomList: [EdulabClassroom]
  edulabClassroomDetail(_id: String!): EdulabClassroom
`;

const mutationParams = `
  name: String!
  grade: Int
  description: String
  teacherIds: [String]
`;

export const mutations = `
  edulabClassroomCreate(${mutationParams}): EdulabClassroom
  edulabClassroomUpdate(_id: String!, ${mutationParams}): EdulabClassroom
  edulabClassroomRemove(_id: String!): EdulabClassroom
`;
