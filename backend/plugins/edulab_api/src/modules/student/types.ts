import { Document } from 'mongoose';

export interface IStudent {
  firstName: string;
  lastName?: string;
  classroomId: string;
  studentCode?: string;
  parentName?: string;
  parentPhone?: string;
  customerId?: string;
}

export interface IStudentDocument extends IStudent, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudentListParams {
  classroomId?: string;
  searchValue?: string;
}
