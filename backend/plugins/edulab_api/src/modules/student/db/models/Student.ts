import { Model } from 'mongoose';

import { IModels } from '~/connectionResolvers';
import { studentSchema } from '@/student/db/definitions/student';
import { IStudent, IStudentDocument } from '@/student/types';

export interface IStudentModel extends Model<IStudentDocument> {
  getStudent(_id: string): Promise<IStudentDocument>;
  createStudent(doc: IStudent): Promise<IStudentDocument>;
  updateStudent(_id: string, doc: IStudent): Promise<IStudentDocument | null>;
  removeStudent(_id: string): Promise<IStudentDocument | null>;
}

const validateStudent = async (models: IModels, doc: IStudent) => {
  const firstName = doc.firstName?.trim();

  if (!firstName) {
    throw new Error('Сурагчийн нэр оруулна уу');
  }

  await models.Classroom.getClassroom(doc.classroomId);

  return { ...doc, firstName, lastName: doc.lastName?.trim() };
};

export const loadStudentClass = (models: IModels) => {
  class Student {
    public static async getStudent(_id: string): Promise<IStudentDocument> {
      const student = await models.Student.findOne({ _id });

      if (!student) {
        throw new Error('Сурагч олдсонгүй');
      }

      return student;
    }

    public static async createStudent(doc: IStudent): Promise<IStudentDocument> {
      return models.Student.create(await validateStudent(models, doc));
    }

    public static async updateStudent(
      _id: string,
      doc: IStudent,
    ): Promise<IStudentDocument | null> {
      await models.Student.getStudent(_id);

      return models.Student.findOneAndUpdate(
        { _id },
        { $set: await validateStudent(models, doc) },
        { new: true },
      );
    }

    public static async removeStudent(
      _id: string,
    ): Promise<IStudentDocument | null> {
      await models.Student.getStudent(_id);

      if (await models.Submission.exists({ studentId: _id })) {
        throw new Error(
          'Сурагч даалгавар илгээсэн тул устгах боломжгүй. Илгээлтүүд нь үнэлгээний түүх болж үлдэнэ',
        );
      }

      return models.Student.findOneAndDelete({ _id });
    }
  }

  studentSchema.loadClass(Student);

  return studentSchema;
};
