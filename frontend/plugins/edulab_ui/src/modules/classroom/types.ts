export interface IClassroomTeacher {
  _id: string;
  subject?: string;
  user?: { _id: string; email?: string; details?: { fullName?: string } };
}

export interface IClassroom {
  _id: string;
  name: string;
  grade?: number;
  description?: string;
  teacherIds?: string[];
  teachers?: IClassroomTeacher[];
  studentCount?: number;
}

export interface IClassroomInput {
  name: string;
  grade?: number;
  description?: string;
  teacherIds?: string[];
}

export const getTeacherName = (teacher?: IClassroomTeacher) =>
  teacher?.user?.details?.fullName || teacher?.user?.email || 'Нэргүй багш';
