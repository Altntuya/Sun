import { useQuery } from '@apollo/client';
import {
  EDULAB_TEACHER_CREATE,
  EDULAB_TEACHER_LIST,
  EDULAB_TEACHER_REMOVE,
  EDULAB_TEACHER_UPDATE,
} from '@/teacher/graphql';
import { ITeacher, ITeacherInput } from '@/teacher/types';
import { useEdulabMutation } from '~/utils/useEdulabMutation';

export const useTeachers = () => {
  const { data, loading, error } = useQuery<{ edulabTeacherList: ITeacher[] }>(
    EDULAB_TEACHER_LIST,
    { fetchPolicy: 'cache-and-network' },
  );

  return { teachers: data?.edulabTeacherList ?? [], loading, error };
};

// Classrooms list their teachers, and removing a teacher takes them off.
const evictFields = ['edulabTeacherList', 'edulabClassroomList'];

export const useTeacherCreate = () =>
  useEdulabMutation<ITeacherInput>(EDULAB_TEACHER_CREATE, {
    evictFields,
    successTitle: 'Багш бүртгэгдлээ',
  });

export const useTeacherUpdate = () =>
  useEdulabMutation<ITeacherInput & { _id: string }>(EDULAB_TEACHER_UPDATE, {
    evictFields,
    successTitle: 'Багшийн мэдээлэл шинэчлэгдлээ',
  });

export const useTeacherRemove = () =>
  useEdulabMutation<{ _id: string }>(EDULAB_TEACHER_REMOVE, {
    evictFields,
    successTitle: 'Багш хасагдлаа',
  });
