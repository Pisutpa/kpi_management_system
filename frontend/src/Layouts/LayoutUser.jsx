import React from 'react'
import { Outlet } from 'react-router-dom'

const LayoutUser = () => {
  return (
    <div>nav
        <Outlet/>
    </div>
  )
}
export default LayoutUser