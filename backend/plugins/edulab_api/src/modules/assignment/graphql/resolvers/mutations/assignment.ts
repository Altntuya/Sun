import { IContext } from '~/connectionResolvers';
import { IAssignment } from '@/assignment/types';

export const assignmentMutations = {
  edulabAssignmentCreate: async (
    _root: undefined,
    doc: IAssignment,
    { models, user, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabAssignmentManage');

    return models.Assignment.createAssignment(doc, user);
  },

  edulabAssignmentUpdate: async (
    _root: undefined,
    { _id, ...doc }: IAssignment & { _id: string },
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabAssignmentManage');

    return models.Assignment.updateAssignment(_id, doc);
  },

  edulabAssignmentRemove: async (
    _root: undefined,
    { _id }: { _id: string },
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('edulabAssignmentManage');

    return models.Assignment.removeAssignment(_id);
  },
};
