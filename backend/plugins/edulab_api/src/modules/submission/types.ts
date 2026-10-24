import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';
import { LabMeasurement } from '@/lab/types';

export type SubmissionStatus = 'submitted' | 'reviewed';

export type AiStatus = 'pending' | 'done' | 'failed';

export interface ISubmission {
  assignmentId: string;
  studentId?: string;
  // Copied from the student's linked Contact; submissions made before
  // students existed carry only this.
  customerId?: string;
  hypothesis?: string;
  answer: string;
  measurements?: LabMeasurement[];
}

export interface ISubmissionReview {
  score: number;
  teacherComment?: string;
}

export interface ISubmissionDocument extends ISubmission, Document {
  _id: string;
  status: SubmissionStatus;
  score?: number;
  teacherComment?: string;
  submittedBy?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  aiStatus?: AiStatus;
  aiScore?: number;
  aiFeedback?: string;
  aiCriteria?: {
    criterion: string;
    score: number;
    max?: number;
    comment: string;
  }[];
  aiError?: string;
  aiModel?: string;
  aiRequestedAt?: Date;
  aiCheckedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubmissionListParams extends ICursorPaginateParams {
  assignmentId?: string;
  studentId?: string;
  customerId?: string;
  status?: SubmissionStatus;
}
