import { Model } from 'mongoose';

import { IUserDocument } from 'erxes-api-shared/core-types';
import { IModels } from '~/connectionResolvers';
import { assignmentSchema } from '@/assignment/db/definitions/assignment';
import { IAssignment, IAssignmentDocument } from '@/assignment/types';

export interface IAssignmentModel extends Model<IAssignmentDocument> {
  getAssignment(_id: string): Promise<IAssignmentDocument>;
  createAssignment(
    doc: IAssignment,
    user: IUserDocument,
  ): Promise<IAssignmentDocument>;
  updateAssignment(
    _id: string,
    doc: IAssignment,
  ): Promise<IAssignmentDocument | null>;
  removeAssignment(_id: string): Promise<IAssignmentDocument | null>;
}

const validateAssignment = async (models: IModels, doc: IAssignment) => {
  if (!doc.title?.trim()) {
    throw new Error('Assignment title is required');
  }

  if (doc.type === 'lab' && !doc.labKey) {
    throw new Error('A lab assignment must choose a lab simulation');
  }

  if (!(doc.maxScore > 0)) {
    throw new Error('Max score must be greater than zero');
  }

  if (doc.classroomId) {
    await models.Classroom.getClassroom(doc.classroomId);
  }
};

export const loadAssignmentClass = (models: IModels) => {
  class Assignment {
    public static async getAssignment(
      _id: string,
    ): Promise<IAssignmentDocument> {
      const assignment = await models.Assignment.findOne({ _id });

      if (!assignment) {
        throw new Error('Assignment not found');
      }

      return assignment;
    }

    public static async createAssignment(
      doc: IAssignment,
      user: IUserDocument,
    ): Promise<IAssignmentDocument> {
      await validateAssignment(models, doc);

      return models.Assignment.create({
        ...doc,
        labKey: doc.type === 'lab' ? doc.labKey : undefined,
        createdBy: user._id,
      });
    }

    public static async updateAssignment(
      _id: string,
      doc: IAssignment,
    ): Promise<IAssignmentDocument | null> {
      await models.Assignment.getAssignment(_id);

      await validateAssignment(models, doc);

      return models.Assignment.findOneAndUpdate(
        { _id },
        {
          $set: { ...doc, labKey: doc.type === 'lab' ? doc.labKey : null },
        },
        { new: true },
      );
    }

    public static async removeAssignment(
      _id: string,
    ): Promise<IAssignmentDocument | null> {
      await models.Assignment.getAssignment(_id);

      await models.Submission.deleteMany({ assignmentId: _id });

      return models.Assignment.findOneAndDelete({ _id });
    }
  }

  assignmentSchema.loadClass(Assignment);

  return assignmentSchema;
};
