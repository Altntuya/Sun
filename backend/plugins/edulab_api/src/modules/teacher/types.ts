import { Document } from 'mongoose';

export interface ITeacher {
  userId: string;
  subject?: string;
  phone?: string;
}

export interface ITeacherDocument extends ITeacher, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
