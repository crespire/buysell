import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AuthProvider } from './providers/AuthProvider';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Hero from './components/Hero';
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
        element: <Hero />,
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
        path: 'posts',
        element: <PostsIndex />,
      }
    ]
  }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
