import EditorFileSelectPage from '../containers/EditorFileSelect';
import ForgotPasswordUserPage from '../containers/ForgotPasswordUserPage/Loadable';
import HomePage from '../containers/HomePage';
import LoginAdminPage from '../containers/LoginAdminPage/Loadable';
import LoginUserPage from '../containers/LoginUserPage/Loadable';
import ResetPasswordPage from '../containers/ResetPasswordPage/Loadable';
import SignupUserPage from '../containers/SignupUserPage/Loadable';
import VerifyEmail from '../containers/VerifyEmail/Loadable';

const publicRoutes = [
  {
    exact: true,
    path: '/',
    // component: LoginUserPage,
    component: HomePage,
  },
  {
    exact: true,
    path: '/verify/:email/:code',
    component: VerifyEmail,
  },
  {
    exact: true,
    path: '/verify/:email',
    component: VerifyEmail,
  },
  {
    exact: true,
    path: '/editor-file-select',
    component: EditorFileSelectPage,
  },
  {
    exact: true,
    path: '/login-admin',
    component: LoginAdminPage,
  },
  {
    exact: true,
    path: '/login-user',
    component: LoginUserPage,
  },
  {
    exact: true,
    path: '/signup-user',
    component: SignupUserPage,
  },
  {
    exact: true,
    path: '/forgot-password-user',
    component: ForgotPasswordUserPage,
  },
  {
    exact: true,
    path: '/reset-password/:email/:code',
    component: ResetPasswordPage,
  },
  {
    exact: true,
    path: '/reset-password/:email',
    component: ResetPasswordPage,
  },
];

export default publicRoutes;
