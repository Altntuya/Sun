import { Model } from 'mongoose';

import { IModels } from '~/connectionResolvers';
import { teacherSchema } from '@/teacher/db/definitions/teacher';
import { ITeacher, ITeacherDocument } from '@/teacher/types';

export interface ITeacherModel extends Model<ITeacherDocument> {
  getTeacher(_id: string): Promise<ITeacherDocument>;
  createTeacher(doc: ITeacher): Promise<ITeacherDocument>;
  updateTeacher(_id: string, doc: ITeacher): Promise<ITeacherDocument | null>;
  removeTeacher(_id: string): Promise<ITeacherDocument | null>;
}

const validateTeacher = async (
  models: IModels,
  doc: ITeacher,
  _id?: string,
) => {
  if (!doc.userId) {
    throw new Error('Багшийн erxes хэрэглэгчийг сонгоно уу');
  }

  if (await models.Teacher.exists({ userId: doc.userId, _id: { $ne: _id } })) {
    throw new Error('Энэ хэрэглэгч аль хэдийн багшаар бүртгэлтэй байна');
  }
};

export const loadTeacherClass = (models: IModels) => {
  class Teacher {
    public static async getTeacher(_id: string): Promise<ITeacherDocument> {
      const teacher = await models.Teacher.findOne({ _id });

      if (!teacher) {
        throw new Error('Багш олдсонгүй');
      }

      return teacher;
    }

    public static async createTeacher(doc: ITeacher): Promise<ITeacherDocument> {
      await validateTeacher(models, doc);

      return models.Teacher.create(doc);
    }

    public static async updateTeacher(
      _id: string,
      doc: ITeacher,
    ): Promise<ITeacherDocument | null> {
      await models.Teacher.getTeacher(_id);
      await validateTeacher(models, doc, _id);

      return models.Teacher.findOneAndUpdate(
        { _id },
        { $set: doc },
        { new: true },
      );
    }

    public static async removeTeacher(
      _id: string,
    ): Promise<ITeacherDocument | null> {
      await models.Teacher.getTeacher(_id);

      await models.Classroom.updateMany(
        { teacherIds: _id },
        { $pull: { teacherIds: _id } },
      );

      return models.Teacher.findOneAndDelete({ _id });
    }
  }

  teacherSchema.loadClass(Teacher);

  return teacherSchema;
};
