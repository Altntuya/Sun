export interface IStudent {
  _id: string;
  firstName: string;
  lastName?: string;
  classroomId: string;
  classroom?: { _id: string; name: string };
  studentCode?: string;
  parentName?: string;
  parentPhone?: string;
  customerId?: string;
  submissionCount?: number;
}

export interface IStudentInput {
  firstName: string;
  lastName?: string;
  classroomId: string;
  studentCode?: string;
  parentName?: string;
  parentPhone?: string;
  customerId?: string;
}

export const getStudentName = (student?: {
  firstName?: string;
  lastName?: string;
}) =>
  [student?.lastName, student?.firstName].filter(Boolean).join(' ') ||
  'Нэргүй сурагч';
