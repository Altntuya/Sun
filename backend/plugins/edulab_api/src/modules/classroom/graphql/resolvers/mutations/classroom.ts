import { IContext } from '~/connectionResolvers';
import { IClassroom } from '@/classroom/types';

export const classroomMutations = {
  edulabClassroomCreate: async (
    _root: undefined,
    doc: IClassroom,
    { models, user, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabClassroomManage');

    return models.Classroom.createClassroom(doc, user);
  },

  edulabClassroomUpdate: async (
    _root: undefined,
    { _id, ...doc }: IClassroom & { _id: string },
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabClassroomManage');

    return models.Classroom.updateClassroom(_id, doc);
  },

  edulabClassroomRemove: async (
    _root: undefined,
    { _id }: { _id: string },
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabClassroomManage');

    return models.Classroom.removeClassroom(_id);
  },
};
