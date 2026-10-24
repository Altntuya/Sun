import { useQuery } from '@apollo/client';
import {
  EDULAB_CLASSROOM_CREATE,
  EDULAB_CLASSROOM_LIST,
  EDULAB_CLASSROOM_REMOVE,
  EDULAB_CLASSROOM_UPDATE,
} from '@/classroom/graphql';
import { IClassroom, IClassroomInput } from '@/classroom/types';
import { useEdulabMutation } from '~/utils/useEdulabMutation';

export const useClassrooms = () => {
  const { data, loading, error } = useQuery<{
    edulabClassroomList: IClassroom[];
  }>(EDULAB_CLASSROOM_LIST, { fetchPolicy: 'cache-and-network' });

  return { classrooms: data?.edulabClassroomList ?? [], loading, error };
};

// A classroom's name and teachers show up on teacher, student and assignment
// lists too, and removing one clears it from assignments.
const evictFields = [
  'edulabClassroomList',
  'edulabClassroomDetail',
  'edulabTeacherList',
  'edulabStudentList',
  'edulabAssignmentList',
  'edulabAssignmentDetail',
];

export const useClassroomCreate = () =>
  useEdulabMutation<IClassroomInput>(EDULAB_CLASSROOM_CREATE, {
    evictFields,
    successTitle: 'Анги үүслээ',
  });

export const useClassroomUpdate = () =>
  useEdulabMutation<IClassroomInput & { _id: string }>(
    EDULAB_CLASSROOM_UPDATE,
    { evictFields, successTitle: 'Анги шинэчлэгдлээ' },
  );

export const useClassroomRemove = () =>
  useEdulabMutation<{ _id: string }>(EDULAB_CLASSROOM_REMOVE, {
    evictFields,
    successTitle: 'Анги устгагдлаа',
  });
