import { Schema } from 'mongoose';

import { mongooseStringRandomId } from 'erxes-api-shared/utils';

export const teacherSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    userId: { type: String, required: true, unique: true, label: 'erxes user' },
    subject: { type: String, label: 'Subject' },
    phone: { type: String, label: 'Phone' },
  },
  {
    timestamps: true,
  },
);
