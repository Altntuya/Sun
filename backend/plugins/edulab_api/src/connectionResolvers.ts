import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import mongoose from 'mongoose';

import { IAssignmentDocument } from '@/assignment/types';
import {
  IAssignmentModel,
  loadAssignmentClass,
} from '@/assignment/db/models/Assignment';
import { IClassroomDocument } from '@/classroom/types';
import {
  IClassroomModel,
  loadClassroomClass,
} from '@/classroom/db/models/Classroom';
import { IStudentDocument } from '@/student/types';
import { IStudentModel, loadStudentClass } from '@/student/db/models/Student';
import { ISubmissionDocument } from '@/submission/types';
import {
  ISubmissionModel,
  loadSubmissionClass,
} from '@/submission/db/models/Submission';
import { ITeacherDocument } from '@/teacher/types';
import { ITeacherModel, loadTeacherClass } from '@/teacher/db/models/Teacher';

export interface IModels {
  Assignment: IAssignmentModel;
  Submission: ISubmissionModel;
  Classroom: IClassroomModel;
  Teacher: ITeacherModel;
  Student: IStudentModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Assignment = db.model<IAssignmentDocument, IAssignmentModel>(
    'edulab_assignments',
    loadAssignmentClass(models),
  );

  models.Submission = db.model<ISubmissionDocument, ISubmissionModel>(
    'edulab_submissions',
    loadSubmissionClass(models),
  );

  models.Classroom = db.model<IClassroomDocument, IClassroomModel>(
    'edulab_classrooms',
    loadClassroomClass(models),
  );

  models.Teacher = db.model<ITeacherDocument, ITeacherModel>(
    'edulab_teachers',
    loadTeacherClass(models),
  );

  models.Student = db.model<IStudentDocument, IStudentModel>(
    'edulab_students',
    loadStudentClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
