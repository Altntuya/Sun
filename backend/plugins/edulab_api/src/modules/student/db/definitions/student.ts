import { Schema } from 'mongoose';

import { mongooseStringRandomId } from 'erxes-api-shared/utils';

export const studentSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    firstName: { type: String, required: true, label: 'First name' },
    lastName: { type: String, label: 'Last name' },
    classroomId: {
      type: String,
      required: true,
      index: true,
      label: 'Classroom',
    },
    studentCode: { type: String, label: 'Student code' },
    parentName: { type: String, label: 'Parent name' },
    parentPhone: { type: String, label: 'Parent phone' },
    customerId: { type: String, index: true, label: 'erxes contact' },
  },
  {
    timestamps: true,
  },
);
