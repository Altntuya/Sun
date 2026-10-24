import { Model } from 'mongoose';

import { IUserDocument } from 'erxes-api-shared/core-types';
import { IModels } from '~/connectionResolvers';
import { gradeSubmission } from '@/ai/gradeSubmission';
import { IAssignmentDocument } from '@/assignment/types';
import { getLab, validateMeasurements } from '@/lab/registry';
import { submissionSchema } from '@/submission/db/definitions/submission';
import {
  ISubmission,
  ISubmissionDocument,
  ISubmissionReview,
} from '@/submission/types';

export interface ISubmissionModel extends Model<ISubmissionDocument> {
  getSubmission(_id: string): Promise<ISubmissionDocument>;
  createSubmission(
    doc: ISubmission,
    user: IUserDocument,
  ): Promise<ISubmissionDocument>;
  reviewSubmission(
    _id: string,
    review: ISubmissionReview,
    user: IUserDocument,
  ): Promise<ISubmissionDocument | null>;
  aiCheckSubmission(_id: string): Promise<ISubmissionDocument | null>;
}

// Only the latest request may write its result; an older run that finishes
// late must not overwrite a newer one.
const runAiCheck = async (
  models: IModels,
  assignment: IAssignmentDocument,
  submission: ISubmissionDocument,
  requestedAt: Date,
) => {
  const latest = { _id: submission._id, aiRequestedAt: requestedAt };

  try {
    const grade = await gradeSubmission(assignment, submission);

    await models.Submission.updateOne(latest, {
      $set: {
        aiStatus: 'done',
        aiScore: grade.score,
        aiFeedback: grade.feedback,
        aiCriteria: grade.criteria,
        aiModel: grade.model,
        aiCheckedAt: new Date(),
      },
    });
  } catch (error) {
    await models.Submission.updateOne(latest, {
      $set: {
        aiStatus: 'failed',
        aiError: error instanceof Error ? error.message : String(error),
        aiCheckedAt: new Date(),
      },
    });
  }
};

export const loadSubmissionClass = (models: IModels) => {
  class Submission {
    public static async getSubmission(
      _id: string,
    ): Promise<ISubmissionDocument> {
      const submission = await models.Submission.findOne({ _id });

      if (!submission) {
        throw new Error('Submission not found');
      }

      return submission;
    }

    public static async createSubmission(
      doc: ISubmission,
      user: IUserDocument,
    ): Promise<ISubmissionDocument> {
      const assignment = await models.Assignment.getAssignment(
        doc.assignmentId,
      );

      if (!doc.studentId) {
        throw new Error('Илгээж буй сурагчаа сонгоно уу');
      }

      const student = await models.Student.getStudent(doc.studentId);

      if (
        assignment.classroomId &&
        student.classroomId !== assignment.classroomId
      ) {
        throw new Error('Энэ сурагч тухайн даалгаврын ангид харьяалагддаггүй');
      }

      if (!doc.answer?.trim()) {
        throw new Error('The answer cannot be empty');
      }

      const measurements =
        assignment.type === 'lab'
          ? validateMeasurements(getLab(assignment.labKey), doc.measurements)
          : [];

      const submission = await models.Submission.create({
        ...doc,
        customerId: student.customerId,
        measurements,
        status: 'submitted',
        aiStatus: 'pending',
        submittedBy: user._id,
      });

      return (await models.Submission.aiCheckSubmission(submission._id)) ?? submission;
    }

    // Grading can take tens of seconds, so it never runs inside a request:
    // the submission is marked pending and the UI polls for the result.
    public static async aiCheckSubmission(
      _id: string,
    ): Promise<ISubmissionDocument | null> {
      const submission = await models.Submission.getSubmission(_id);
      const assignment = await models.Assignment.getAssignment(
        submission.assignmentId,
      );
      const requestedAt = new Date();

      const pending = await models.Submission.findOneAndUpdate(
        { _id },
        {
          $set: { aiStatus: 'pending', aiRequestedAt: requestedAt },
          $unset: { aiError: 1 },
        },
        { new: true },
      );

      void runAiCheck(models, assignment, submission, requestedAt);

      return pending;
    }

    public static async reviewSubmission(
      _id: string,
      { score, teacherComment }: ISubmissionReview,
      user: IUserDocument,
    ): Promise<ISubmissionDocument | null> {
      const submission = await models.Submission.getSubmission(_id);
      const assignment = await models.Assignment.getAssignment(
        submission.assignmentId,
      );

      if (!Number.isFinite(score) || score < 0 || score > assignment.maxScore) {
        throw new Error(`Score must be between 0 and ${assignment.maxScore}`);
      }

      return models.Submission.findOneAndUpdate(
        { _id },
        {
          $set: {
            score,
            teacherComment,
            status: 'reviewed',
            reviewedBy: user._id,
            reviewedAt: new Date(),
          },
        },
        { new: true },
      );
    }
  }

  submissionSchema.loadClass(Submission);

  return submissionSchema;
};
