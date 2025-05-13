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

import ProtectRouteUser from './ProtectRouteUser';
import ProtectRouteAdmin from './ProtectRouteAdmin';
import EditManageUser from '../pages/admin/EditManageUser';
import EditKpi from '../pages/admin/EditKpi';
import Home from '../pages/Home';



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
    // element: <LayoutAdmin />,
    element: <ProtectRouteAdmin element={<LayoutAdmin />} />,

    children: [
      { index: true, element: <Dashboard /> },
      { path: 'kpi', element: <Kpi/> },
      { path: 'kpi/:id', element: <EditKpi/> },
      { path: 'manage', element: <ManageUser/> },
      { path: 'manage/:id', element: <EditManageUser/> },
    ]
  },
  

{
  path: '/user',
  element: <ProtectRouteUser element={<LayoutUser />} />,
  children: [
    { path: 'my-users', element: <Homeuser /> }  
  ]
}


])

const AppRoutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
export default AppRoutes