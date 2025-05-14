import React from 'react'
import { Outlet } from 'react-router-dom'
import MainNav from '../components/MainNav'

const LayoutUser = () => {
  return (
    <div>
      <h1><MainNav /></h1>
      <main>
        <hr />
        <br />
        <Outlet />
      </main>
    </div>
  )
}
export default LayoutUser