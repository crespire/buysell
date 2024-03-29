import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AuthProvider } from './providers/AuthProvider';
import { createContext } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import RouteError from './components/RouteError';
import Signup from './components/Signup';
import Signin from './components/SignIn';
import AccountVerify from './components/AccountVerify';
import PostsIndex from './components/PostsIndex';
import PostForm from './components/PostForm';
import SinglePost from './components/SinglePost';
import PostEditForm from './components/PostEditForm';
import PasswordReset from './components/PasswordReset';
import RequestPasswordReset from './components/RequestPasswordReset';
import UserDashboard from './components/UserDashboard';
import UserUpdate from './components/UserUpdate';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <PostsIndex />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'signin',
        element: <Signin />,
      },
      {
        path: 'verify-account/:token',
        element: <AccountVerify />,
      },
      {
        path: 'verify-account/',
        element: <AccountVerify />,
      },
      {
        path: 'reset-password/',
        element: <RequestPasswordReset />
      },
      {
        path: 'reset-password/:token',
        element: <PasswordReset />,
      },
      { 
        path: 'posts/new',
        element: <PostForm />,
      },
      {
        path: 'posts/:id',
        element: <SinglePost />,
      },
      {
        path: 'posts/:id/edit',
        element: <PostEditForm />
      },
      {
        path: 'dashboard',
        element: <UserDashboard />
      },
      {
        path: 'account',
        element: <UserUpdate />
      }
    ]
  }
]);

export const BaseUrlContext = createContext<string|null>(null);
export const baseUrl = 'https://buysell-backend.crespire.dev';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BaseUrlContext.Provider value={baseUrl}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </BaseUrlContext.Provider>
  </React.StrictMode>
);
