import { useMutation } from '@apollo/client';
import { toast } from 'erxes-ui';
import {
  EDULAB_ASSIGNMENT_CREATE,
  EDULAB_ASSIGNMENT_REMOVE,
} from '@/assignment/graphql/mutations';
import { evictQueryFields } from '~/utils/useEdulabMutation';
import { AssignmentType } from '@/assignment/types';

export interface IAssignmentInput {
  title: string;
  description?: string;
  type: AssignmentType;
  labKey?: string;
  rubric?: string;
  maxScore: number;
  dueDate?: Date;
  classroomId?: string;
}

const showError = (error: Error) =>
  toast({
    title: 'Алдаа гарлаа',
    description: error.message,
    variant: 'destructive',
  });

export const useAssignmentCreate = () => {
  const [mutate, { loading }] = useMutation(EDULAB_ASSIGNMENT_CREATE, {
    update: (cache) => evictQueryFields(cache, ['edulabAssignmentList']),
  });

  const createAssignment = (input: IAssignmentInput, onDone: () => void) =>
    mutate({
      variables: input,
      onCompleted: () => {
        toast({ title: 'Даалгавар үүслээ', variant: 'success' });
        onDone();
      },
      onError: showError,
    });

  return { createAssignment, loading };
};

export const useAssignmentRemove = () => {
  // Removing an assignment also deletes its submissions. Its detail query is
  // left alone: the page showing it navigates away, and evicting it would make
  // that page refetch and flash "not found" first.
  const [mutate, { loading }] = useMutation(EDULAB_ASSIGNMENT_REMOVE, {
    update: (cache) =>
      evictQueryFields(cache, [
        'edulabAssignmentList',
        'edulabSubmissionList',
        'edulabStudentList',
      ]),
  });

  const removeAssignment = (_id: string, onDone?: () => void) =>
    mutate({
      variables: { _id },
      onCompleted: () => {
        toast({ title: 'Даалгавар устгагдлаа', variant: 'success' });
        onDone?.();
      },
      onError: showError,
    });

  return { removeAssignment, loading };
};
