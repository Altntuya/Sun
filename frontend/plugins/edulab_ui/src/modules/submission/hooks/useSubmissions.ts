import { useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'erxes-ui';
import { EDULAB_SUBMISSION_LIST } from '@/submission/graphql/queries';
import {
  EDULAB_SUBMISSION_AI_CHECK,
  EDULAB_SUBMISSION_CREATE,
  EDULAB_SUBMISSION_REVIEW,
} from '@/submission/graphql/mutations';
import { LabMeasurement } from '@/lab/types';
import { ISubmissionListResponse } from '@/submission/types';
import { evictQueryFields } from '~/utils/useEdulabMutation';

export interface ISubmissionInput {
  assignmentId: string;
  studentId: string;
  hypothesis?: string;
  answer: string;
  measurements?: LabMeasurement[];
}

const AI_POLL_INTERVAL_MS = 3000;

const showError = (error: Error) =>
  toast({
    title: 'Алдаа гарлаа',
    description: error.message,
    variant: 'destructive',
  });

export const useSubmissions = (assignmentId?: string) => {
  const { data, loading, error, startPolling, stopPolling } =
    useQuery<ISubmissionListResponse>(EDULAB_SUBMISSION_LIST, {
      variables: { assignmentId, limit: 100 },
      skip: !assignmentId,
      // The list may have been cached before the student submitted.
      fetchPolicy: 'cache-and-network',
    });
  const submissions = data?.edulabSubmissionList.list ?? [];
  const hasPendingAi = submissions.some(
    (submission) => submission.aiStatus === 'pending',
  );

  // The AI grade is written a few seconds after the submission; poll only
  // while one is outstanding.
  useEffect(() => {
    if (hasPendingAi) {
      startPolling(AI_POLL_INTERVAL_MS);
    } else {
      stopPolling();
    }

    return stopPolling;
  }, [hasPendingAi, startPolling, stopPolling]);

  return { submissions, loading, error };
};

export const useSubmissionCreate = () => {
  // The submit page shows no list, so the assignment's submission list and
  // the submission counts are evicted for the pages that come next.
  const [mutate, { loading }] = useMutation(EDULAB_SUBMISSION_CREATE, {
    update: (cache) =>
      evictQueryFields(cache, [
        'edulabSubmissionList',
        'edulabAssignmentList',
        'edulabAssignmentDetail',
        'edulabStudentList',
      ]),
  });

  const createSubmission = (input: ISubmissionInput, onDone: () => void) =>
    mutate({
      variables: input,
      onCompleted: () => {
        toast({ title: 'Илгээлт амжилттай', variant: 'success' });
        onDone();
      },
      onError: showError,
    });

  return { createSubmission, loading };
};

export const useSubmissionAiCheck = () => {
  const [mutate, { loading }] = useMutation(EDULAB_SUBMISSION_AI_CHECK);

  const aiCheckSubmission = (_id: string) =>
    mutate({
      variables: { _id },
      onError: showError,
    });

  return { aiCheckSubmission, loading };
};

export const useSubmissionReview = () => {
  const [mutate, { loading }] = useMutation(EDULAB_SUBMISSION_REVIEW);

  const reviewSubmission = (
    variables: { _id: string; score: number; teacherComment?: string },
    onDone: () => void,
  ) =>
    mutate({
      variables,
      onCompleted: () => {
        toast({ title: 'Үнэлгээ хадгалагдлаа', variant: 'success' });
        onDone();
      },
      onError: showError,
    });

  return { reviewSubmission, loading };
};
