import { IPermissionConfig } from 'erxes-api-shared/core-types';

export const permissions: IPermissionConfig = {
  plugin: 'edulab',

  modules: [
    {
      name: 'classroom',
      description: 'Classrooms',
      scopes: [{ name: 'all', description: 'All classrooms' }],
      actions: [
        {
          title: 'View classrooms',
          name: 'edulabClassroomRead',
          description: 'View classrooms',
          always: true,
        },
        {
          title: 'Manage classrooms',
          name: 'edulabClassroomManage',
          description: 'Create, edit and delete classrooms',
        },
      ],
    },
    {
      name: 'teacher',
      description: 'Teachers',
      scopes: [{ name: 'all', description: 'All teachers' }],
      actions: [
        {
          title: 'View teachers',
          name: 'edulabTeacherRead',
          description: 'View teachers',
          always: true,
        },
        {
          title: 'Manage teachers',
          name: 'edulabTeacherManage',
          description: 'Register erxes users as teachers',
        },
      ],
    },
    {
      name: 'student',
      description: 'Students',
      scopes: [{ name: 'all', description: 'All students' }],
      actions: [
        {
          title: 'View students',
          name: 'edulabStudentRead',
          description: 'View students',
          always: true,
        },
        {
          title: 'Manage students',
          name: 'edulabStudentManage',
          description: 'Create, edit and delete students',
        },
      ],
    },
    {
      name: 'assignment',
      description: 'Assignments and virtual labs',
      ownerFields: ['createdBy'],

      scopes: [
        { name: 'own', description: 'Assignments the user created' },
        { name: 'all', description: 'All assignments' },
      ],

      actions: [
        {
          title: 'View assignments',
          name: 'edulabAssignmentRead',
          description: 'View assignments',
          always: true,
        },
        {
          title: 'Manage assignments',
          name: 'edulabAssignmentManage',
          description: 'Create, edit and delete assignments',
        },
      ],
    },
    {
      name: 'submission',
      description: 'Student submissions',
      ownerFields: ['submittedBy'],

      scopes: [
        { name: 'own', description: 'Submissions the user entered' },
        { name: 'all', description: 'All submissions' },
      ],

      actions: [
        {
          title: 'View submissions',
          name: 'edulabSubmissionRead',
          description: 'View submissions',
          always: true,
        },
        {
          title: 'Submit work',
          name: 'edulabSubmissionCreate',
          description: 'Submit a student answer or lab report',
        },
        {
          title: 'Review submissions',
          name: 'edulabSubmissionReview',
          description: 'Grade submissions',
        },
      ],
    },
  ],
};
