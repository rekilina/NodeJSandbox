import './App.css'
import { Toaster } from 'react-hot-toast';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import React from 'react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    id: 'root',
    children: [
      {
        path: '/edit-profile',
        element: < EditProfile />
      }
    ]
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
