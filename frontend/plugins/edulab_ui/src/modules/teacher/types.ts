import { IClassroomTeacher } from '@/classroom/types';

export interface ITeacher extends IClassroomTeacher {
  userId: string;
  phone?: string;
  classrooms?: { _id: string; name: string }[];
}

export interface ITeacherInput {
  userId: string;
  subject?: string;
  phone?: string;
}
