import { Schema } from 'mongoose';

import { mongooseStringRandomId } from 'erxes-api-shared/utils';

export const classroomSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    name: { type: String, required: true, label: 'Name' },
    grade: { type: Number, label: 'Grade' },
    description: { type: String, label: 'Description' },
    teacherIds: { type: [String], default: [], label: 'Teachers' },
    createdBy: { type: String, label: 'Created by' },
  },
  {
    timestamps: true,
  },
);
