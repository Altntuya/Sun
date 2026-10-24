import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { AppLayout, Spinner } from 'erxes-ui';
import { EdulabNavigation } from './EdulabNavigation';

const AssignmentListPage = lazy(() =>
  import('~/pages/assignment/AssignmentListPage').then((module) => ({
    default: module.AssignmentListPage,
  })),
);

const AssignmentDetailPage = lazy(() =>
  import('~/pages/assignment/AssignmentDetailPage').then((module) => ({
    default: module.AssignmentDetailPage,
  })),
);

const AssignmentSubmitPage = lazy(() =>
  import('~/pages/assignment/AssignmentSubmitPage').then((module) => ({
    default: module.AssignmentSubmitPage,
  })),
);

const ClassroomListPage = lazy(() =>
  import('~/pages/people/ClassroomListPage').then((module) => ({
    default: module.ClassroomListPage,
  })),
);

const TeacherListPage = lazy(() =>
  import('~/pages/people/TeacherListPage').then((module) => ({
    default: module.TeacherListPage,
  })),
);

const StudentListPage = lazy(() =>
  import('~/pages/people/StudentListPage').then((module) => ({
    default: module.StudentListPage,
  })),
);

export const EdulabMain = () => {
  return (
    <AppLayout id="edulab" title="EduLab" sidebar={<EdulabNavigation />}>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route index element={<Navigate to="assignments" replace />} />
          <Route path="assignments" element={<AssignmentListPage />} />
          <Route path="assignments/:id" element={<AssignmentDetailPage />} />
          <Route
            path="assignments/:id/submit"
            element={<AssignmentSubmitPage />}
          />
          <Route path="classrooms" element={<ClassroomListPage />} />
          <Route path="teachers" element={<TeacherListPage />} />
          <Route path="students" element={<StudentListPage />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
};
