import { Model } from 'mongoose';

import { IUserDocument } from 'erxes-api-shared/core-types';
import { IModels } from '~/connectionResolvers';
import { classroomSchema } from '@/classroom/db/definitions/classroom';
import { IClassroom, IClassroomDocument } from '@/classroom/types';

export interface IClassroomModel extends Model<IClassroomDocument> {
  getClassroom(_id: string): Promise<IClassroomDocument>;
  createClassroom(
    doc: IClassroom,
    user: IUserDocument,
  ): Promise<IClassroomDocument>;
  updateClassroom(
    _id: string,
    doc: IClassroom,
  ): Promise<IClassroomDocument | null>;
  removeClassroom(_id: string): Promise<IClassroomDocument | null>;
}

const validateClassroom = async (
  models: IModels,
  doc: IClassroom,
  _id?: string,
) => {
  const name = doc.name?.trim();

  if (!name) {
    throw new Error('Ангийн нэр оруулна уу');
  }

  if (await models.Classroom.exists({ name, _id: { $ne: _id } })) {
    throw new Error(`"${name}" нэртэй анги аль хэдийн байна`);
  }

  return { ...doc, name };
};

export const loadClassroomClass = (models: IModels) => {
  class Classroom {
    public static async getClassroom(_id: string): Promise<IClassroomDocument> {
      const classroom = await models.Classroom.findOne({ _id });

      if (!classroom) {
        throw new Error('Анги олдсонгүй');
      }

      return classroom;
    }

    public static async createClassroom(
      doc: IClassroom,
      user: IUserDocument,
    ): Promise<IClassroomDocument> {
      return models.Classroom.create({
        ...(await validateClassroom(models, doc)),
        createdBy: user._id,
      });
    }

    public static async updateClassroom(
      _id: string,
      doc: IClassroom,
    ): Promise<IClassroomDocument | null> {
      await models.Classroom.getClassroom(_id);

      return models.Classroom.findOneAndUpdate(
        { _id },
        { $set: await validateClassroom(models, doc, _id) },
        { new: true },
      );
    }

    public static async removeClassroom(
      _id: string,
    ): Promise<IClassroomDocument | null> {
      await models.Classroom.getClassroom(_id);

      if (await models.Student.exists({ classroomId: _id })) {
        throw new Error(
          'Ангид сурагч бүртгэлтэй байна. Эхлээд сурагчдыг өөр ангид шилжүүлнэ үү',
        );
      }

      await models.Assignment.updateMany(
        { classroomId: _id },
        { $unset: { classroomId: 1 } },
      );

      return models.Classroom.findOneAndDelete({ _id });
    }
  }

  classroomSchema.loadClass(Classroom);

  return classroomSchema;
};
