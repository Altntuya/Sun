export type AssignmentType = 'text' | 'lab';

export interface IAssignment {
  _id: string;
  title: string;
  description?: string;
  type: AssignmentType;
  labKey?: string;
  rubric?: string;
  maxScore: number;
  dueDate?: string;
  classroomId?: string;
  classroom?: { _id: string; name: string };
  createdAt?: string;
  submissionCount?: number;
}

export interface IAssignmentListResponse {
  edulabAssignmentList: {
    list: IAssignment[];
    totalCount: number;
  };
}

export interface IAssignmentDetailResponse {
  edulabAssignmentDetail: IAssignment;
}
