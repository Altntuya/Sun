import { useQuery } from '@apollo/client';
import {
  EDULAB_ASSIGNMENT_DETAIL,
  EDULAB_ASSIGNMENT_LIST,
} from '@/assignment/graphql/queries';
import {
  IAssignmentDetailResponse,
  IAssignmentListResponse,
} from '@/assignment/types';

export const useAssignments = () => {
  const { data, loading, error } = useQuery<IAssignmentListResponse>(
    EDULAB_ASSIGNMENT_LIST,
    { variables: { limit: 100 }, fetchPolicy: 'cache-and-network' },
  );

  return {
    assignments: data?.edulabAssignmentList.list ?? [],
    totalCount: data?.edulabAssignmentList.totalCount ?? 0,
    loading,
    error,
  };
};

export const useAssignmentDetail = (_id?: string) => {
  const { data, loading, error } = useQuery<IAssignmentDetailResponse>(
    EDULAB_ASSIGNMENT_DETAIL,
    { variables: { _id }, skip: !_id },
  );

  return { assignment: data?.edulabAssignmentDetail, loading, error };
};
