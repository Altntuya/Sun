import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';

export type AssignmentType = 'text' | 'lab';

export interface IAssignment {
  title: string;
  description?: string;
  type: AssignmentType;
  labKey?: string;
  rubric?: string;
  maxScore: number;
  dueDate?: Date;
  classroomId?: string;
}

export interface IAssignmentDocument extends IAssignment, Document {
  _id: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAssignmentListParams extends ICursorPaginateParams {
  searchValue?: string;
  type?: AssignmentType;
  classroomId?: string;
}
