import { LabMeasurement } from '@/lab/types';
import { getStudentName } from '@/student/types';

export type SubmissionStatus = 'submitted' | 'reviewed';

export type AiStatus = 'pending' | 'done' | 'failed';

export interface IAiCriterion {
  criterion: string;
  score: number;
  max?: number;
  comment?: string;
}

export interface ISubmission {
  _id: string;
  assignmentId: string;
  studentId?: string;
  student?: {
    _id: string;
    firstName: string;
    lastName?: string;
    classroom?: { _id: string; name: string };
  };
  customerId?: string;
  customer?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    primaryEmail?: string;
  };
  hypothesis?: string;
  answer: string;
  measurements?: LabMeasurement[];
  status: SubmissionStatus;
  score?: number;
  teacherComment?: string;
  reviewedAt?: string;
  aiStatus?: AiStatus;
  aiScore?: number;
  aiFeedback?: string;
  aiCriteria?: IAiCriterion[];
  aiError?: string;
  aiModel?: string;
  createdAt?: string;
}

export interface ISubmissionListResponse {
  edulabSubmissionList: {
    list: ISubmission[];
    totalCount: number;
  };
}

// Submissions made before students existed only carry a Contact.
export const getSubmitterName = (submission: ISubmission) => {
  if (submission.student) {
    return getStudentName(submission.student);
  }

  const { customer } = submission;
  const name = [customer?.firstName, customer?.lastName]
    .filter(Boolean)
    .join(' ');

  return name || customer?.primaryEmail || 'Тодорхойгүй сурагч';
};
