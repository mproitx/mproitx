import { lazy } from 'react';
import type { ReactNode } from 'react';

// Lazy load pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ContentBrowserPage = lazy(() => import('./pages/ContentBrowserPage'));
const ContentViewerPage = lazy(() => import('./pages/ContentViewerPage'));
const RecentlyViewedPage = lazy(() => import('./pages/RecentlyViewedPage'));
const DownloadsPage = lazy(() => import('./pages/DownloadsPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const InstallGuidePage = lazy(() => import('./pages/InstallGuidePage'));
const AIHelperPage = lazy(() => import('./pages/AIHelperPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const MCQTestPage = lazy(() => import('./pages/MCQTestPage'));
const TakeMCQTestPage = lazy(() => import('./pages/TakeMCQTestPage'));
const MCQTestResultPage = lazy(() => import('./pages/MCQTestResultPage'));
const MCQTestHistoryPage = lazy(() => import('./pages/MCQTestHistoryPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminContentUploadPage = lazy(() => import('./pages/admin/AdminContentUploadPage'));
const AdminMCQUploadPage = lazy(() => import('./pages/admin/AdminMCQUploadPage'));
const AdminStudentManagementPage = lazy(() => import('./pages/admin/AdminStudentManagementPage'));
const AdminNotificationsPage = lazy(() => import('./pages/admin/AdminNotificationsPage'));
const AdminContentManagementPage = lazy(() => import('./pages/admin/AdminContentManagementPage'));
const AdminIITJEEUploadPage = lazy(() => import('./pages/admin/AdminIITJEEUploadPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    visible: false,
  },
  {
    name: 'Signup',
    path: '/signup',
    element: <SignupPage />,
    visible: false,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    name: 'Content Browser',
    path: '/content/:category',
    element: <ContentBrowserPage />,
    visible: false,
  },
  {
    name: 'Content Viewer',
    path: '/content/view/:id',
    element: <ContentViewerPage />,
    visible: false,
  },
  {
    name: 'Recently Viewed',
    path: '/recently-viewed',
    element: <RecentlyViewedPage />,
    visible: false,
  },
  {
    name: 'Downloads',
    path: '/downloads',
    element: <DownloadsPage />,
    visible: false,
  },
  {
    name: 'Notifications',
    path: '/notifications',
    element: <NotificationsPage />,
    visible: false,
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <ProfilePage />,
    visible: false,
  },
  {
    name: 'Install Guide',
    path: '/install-guide',
    element: <InstallGuidePage />,
    visible: false,
  },
  {
    name: 'AI Helper',
    path: '/ai-helper',
    element: <AIHelperPage />,
  },
  {
    name: 'Leaderboard',
    path: '/leaderboard',
    element: <LeaderboardPage />,
  },
  {
    name: 'MCQ Test',
    path: '/mcq-test',
    element: <MCQTestPage />,
  },
  {
    name: 'Take MCQ Test',
    path: '/mcq-test/take',
    element: <TakeMCQTestPage />,
    visible: false,
  },
  {
    name: 'MCQ Test Result',
    path: '/mcq-test/result',
    element: <MCQTestResultPage />,
    visible: false,
  },
  {
    name: 'MCQ Test History',
    path: '/mcq-test/history',
    element: <MCQTestHistoryPage />,
    visible: false,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <AdminDashboardPage />,
    visible: false,
  },
  {
    name: 'Admin Upload',
    path: '/admin/upload',
    element: <AdminContentUploadPage />,
    visible: false,
  },
  {
    name: 'Admin MCQ Upload',
    path: '/admin/mcq-upload',
    element: <AdminMCQUploadPage />,
    visible: false,
  },
  {
    name: 'Admin Students',
    path: '/admin/students',
    element: <AdminStudentManagementPage />,
    visible: false,
  },
  {
    name: 'Admin Notifications',
    path: '/admin/notifications',
    element: <AdminNotificationsPage />,
    visible: false,
  },
  {
    name: 'Admin Content Management',
    path: '/admin/content-management',
    element: <AdminContentManagementPage />,
    visible: false,
  },
  {
    name: 'Admin IIT-JEE Upload',
    path: '/admin/iitjee-upload',
    element: <AdminIITJEEUploadPage />,
    visible: false,
  },
  {
    name: 'Not Found',
    path: '*',
    element: <NotFoundPage />,
    visible: false,
  },
];

export default routes;
