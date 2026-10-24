import { useQuery } from '@apollo/client';
import {
  EDULAB_STUDENT_CREATE,
  EDULAB_STUDENT_LIST,
  EDULAB_STUDENT_REMOVE,
  EDULAB_STUDENT_UPDATE,
} from '@/student/graphql';
import { IStudent, IStudentInput } from '@/student/types';
import { useEdulabMutation } from '~/utils/useEdulabMutation';

// cache-and-network: the submission form's student picker must show students
// added since it was last opened, from this tab or another.
export const useStudents = (classroomId?: string) => {
  const { data, loading, error } = useQuery<{ edulabStudentList: IStudent[] }>(
    EDULAB_STUDENT_LIST,
    { variables: { classroomId }, fetchPolicy: 'cache-and-network' },
  );

  return { students: data?.edulabStudentList ?? [], loading, error };
};

// Every per-classroom student list, plus classroom student counts.
const evictFields = ['edulabStudentList', 'edulabClassroomList'];

export const useStudentCreate = () =>
  useEdulabMutation<IStudentInput>(EDULAB_STUDENT_CREATE, {
    evictFields,
    successTitle: 'Сурагч бүртгэгдлээ',
  });

export const useStudentUpdate = () =>
  useEdulabMutation<IStudentInput & { _id: string }>(EDULAB_STUDENT_UPDATE, {
    evictFields,
    successTitle: 'Сурагчийн мэдээлэл шинэчлэгдлээ',
  });

export const useStudentRemove = () =>
  useEdulabMutation<{ _id: string }>(EDULAB_STUDENT_REMOVE, {
    evictFields,
    successTitle: 'Сурагч устгагдлаа',
  });
