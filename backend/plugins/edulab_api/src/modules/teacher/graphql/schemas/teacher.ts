export const types = `
  extend type User @key(fields: "_id") {
    _id: String @external
  }

  type EdulabTeacher {
    _id: String!
    userId: String!
    user: User
    subject: String
    phone: String
    classrooms: [EdulabClassroom]
    createdAt: Date
  }
`;

export const queries = `
  edulabTeacherList: [EdulabTeacher]
`;

const mutationParams = `
  userId: String!
  subject: String
  phone: String
`;

export const mutations = `
  edulabTeacherCreate(${mutationParams}): EdulabTeacher
  edulabTeacherUpdate(_id: String!, ${mutationParams}): EdulabTeacher
  edulabTeacherRemove(_id: String!): EdulabTeacher
`;
