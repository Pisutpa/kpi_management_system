import React, { Children } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Layout from '../Layouts/Layout';
import LayoutAdmin from '../Layouts/LayoutAdmin';
import Dashboard from '../pages/admin/Dashboard';
import Kpi from '../pages/admin/Kpi';
import ManageUser from '../pages/admin/ManageUser';
import LayoutUser from '../Layouts/LayoutUser';

import Homeuser from '../pages/user/Homeuser';
import Home from '../pages/home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ]
  },

  {
    path: '/admin',
    element: <LayoutAdmin />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'kpi', element: <Kpi/> },
      { path: 'manage', element: <ManageUser/> },
    ]
  },
  

  {
    path: '/user',
    element: <LayoutUser />,
    children: [
      { index: true, element: <Homeuser /> },
    
    ]
  },

])

const AppRoutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
export default AppRoutes