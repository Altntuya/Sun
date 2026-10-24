import { Document } from 'mongoose';

export interface IClassroom {
  name: string;
  grade?: number;
  description?: string;
  teacherIds?: string[];
}

export interface IClassroomDocument extends IClassroom, Document {
  _id: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
