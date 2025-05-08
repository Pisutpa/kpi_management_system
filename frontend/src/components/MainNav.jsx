import React from 'react'
import { Link } from 'react-router-dom'

const MainNav = () => {
    return (

        <nav className='bg-green-300 '>
            <div className='mx-auto px-4 '>
                <div className="flex justify-between  h-16">
                    <div className='flex items-center gap-4'>
                        <Link className='text-5xl font-bold' to="/">Logo</Link>
                    </div>
                    <div className='flex items-center gap-4'>

                        <Link to="/register">Register</Link>
                        <Link to="/login">Login</Link>
                    </div>


                </div>
            </div>
        </nav>

    )
}
export default MainNav