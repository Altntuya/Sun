import { Schema } from 'mongoose';

import { mongooseStringRandomId } from 'erxes-api-shared/utils';

export const submissionSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    assignmentId: {
      type: String,
      required: true,
      index: true,
      label: 'Assignment',
    },
    studentId: { type: String, index: true, label: 'Student' },
    customerId: { type: String, index: true, label: 'erxes contact' },
    hypothesis: { type: String, label: 'Hypothesis' },
    answer: { type: String, required: true, label: 'Answer' },
    // Shape depends on the lab: { [variable key]: number } per reading.
    measurements: { type: [Schema.Types.Mixed], label: 'Lab measurements' },
    status: {
      type: String,
      enum: ['submitted', 'reviewed'],
      default: 'submitted',
      index: true,
      label: 'Status',
    },
    score: { type: Number, label: 'Score' },
    teacherComment: { type: String, label: 'Teacher comment' },
    submittedBy: { type: String, label: 'Submitted by' },
    reviewedBy: { type: String, label: 'Reviewed by' },
    reviewedAt: { type: Date, label: 'Reviewed at' },
    aiStatus: {
      type: String,
      enum: ['pending', 'done', 'failed'],
      label: 'AI check status',
    },
    aiScore: { type: Number, label: 'AI suggested score' },
    aiFeedback: { type: String, label: 'AI feedback' },
    aiCriteria: { type: [Schema.Types.Mixed], label: 'AI per-criterion scores' },
    aiError: { type: String, label: 'AI error' },
    aiModel: { type: String, label: 'AI model' },
    aiRequestedAt: { type: Date, label: 'AI check requested at' },
    aiCheckedAt: { type: Date, label: 'AI checked at' },
  },
  {
    timestamps: true,
  },
);
