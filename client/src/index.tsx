import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AuthProvider } from './providers/AuthProvider';
import { createContext } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Signup from './components/Signup';
import Signin from './components/SignIn';
import AccountVerify from './components/AccountVerify';
import PostsIndex from './components/PostsIndex';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
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
      }
    ]
  }
])

export const BaseUrlContext = createContext<string|null>(null);
const baseUrl = 'http://localhost:3000';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BaseUrlContext.Provider value={baseUrl}>
        <RouterProvider router={router} />
      </BaseUrlContext.Provider>
    </AuthProvider>
  </React.StrictMode>
);
