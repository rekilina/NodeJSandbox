import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Toaster } from 'react-hot-toast';


import React from 'react'

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
      <Routes></Routes>
    </>
  )
}

export default App;
