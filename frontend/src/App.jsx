import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'

export default function App() {
  const routes = createBrowserRouter(
    [
      {
        path: '/',
        element: <Home />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },

    ]
  )
  return (
    <RouterProvider router={routes} />
  )
}
