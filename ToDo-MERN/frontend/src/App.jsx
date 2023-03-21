import './App.css'
import { Toaster } from 'react-hot-toast';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home';
import EditProfile from './pages/EditProfile';
import Auth from './pages/Auth';
import PrivateRoutes from './components/PrivateRoutes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoutes />,
    children: [
      {
        path: '/',
        element: <Home />,
        id: 'root'
      },
      {
        path: 'edit-profile',
        element: < EditProfile />
      }
    ]
  },
  {
    path: 'auth',
    element: < Auth />
  }
])

function App() {
  return (
    <>
      <Toaster
        position='top-right'
        toastOptions={{
          style: {
            fontSize: '16px'
          }
        }}
      ></Toaster>
      <RouterProvider router={router} />
    </>
  )
}

export default App;
