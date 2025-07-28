import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'

export default function App() {
  const routes = createBrowserRouter(
    [
      {
        path: "",
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/home',
        element: <Home />
      },
    ]
  )
  return (
    <RouterProvider router={routes} />
  )
}
