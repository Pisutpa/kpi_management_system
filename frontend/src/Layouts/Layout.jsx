import React from 'react'  
import { Outlet } from 'react-router-dom'
import MainNav from '../components/MainNav'
const Layout = () => {
  return (
    <div>

        <h1><MainNav/></h1>
        <hr />
        <main>
            <Outlet />
        </main>
    </div>
  )
}
export default Layout