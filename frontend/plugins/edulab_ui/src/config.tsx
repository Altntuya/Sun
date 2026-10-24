import { IconFlask } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui';

export const CONFIG: IUIConfig = {
  name: 'edulab',
  path: 'edulab',
  icon: IconFlask,
  navigationGroup: {
    name: 'edulab',
    defaultPath: 'edulab/assignments',
    icon: IconFlask,
  },

  modules: [
    {
      name: 'assignments',
      icon: IconFlask,
      path: 'edulab/assignments',
    },
    {
      name: 'classrooms',
      icon: IconFlask,
      path: 'edulab/classrooms',
    },
    {
      name: 'teachers',
      icon: IconFlask,
      path: 'edulab/teachers',
    },
    {
      name: 'students',
      icon: IconFlask,
      path: 'edulab/students',
    },
  ],
};
