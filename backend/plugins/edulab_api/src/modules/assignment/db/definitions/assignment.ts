import { Schema } from 'mongoose';

import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { ASSIGNMENT_TYPES } from '@/assignment/constants';
import { LAB_KEYS } from '@/lab/registry';

export const assignmentSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    title: { type: String, required: true, label: 'Title' },
    description: { type: String, label: 'Description' },
    type: {
      type: String,
      enum: ASSIGNMENT_TYPES,
      required: true,
      default: 'text',
      label: 'Type',
    },
    labKey: { type: String, enum: LAB_KEYS, label: 'Lab simulation' },
    rubric: { type: String, label: 'Grading rubric' },
    maxScore: { type: Number, required: true, default: 10, label: 'Max score' },
    dueDate: { type: Date, label: 'Due date' },
    classroomId: { type: String, index: true, label: 'Classroom' },
    createdBy: { type: String, label: 'Created by' },
  },
  {
    timestamps: true,
  },
);
