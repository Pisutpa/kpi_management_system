import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import useKpiStore from "../store/kpi-store";

function MainNav() {
    const navigate = useNavigate();
    const user = useKpiStore((s) => s.user);
    const logout = useKpiStore((s) => s.logout);
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md">
            <div className="mx-auto px-4 max-w-8xl">
                <div className="flex justify-between items-center h-16">


                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-white p-2 rounded-full shadow-md">
                                <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13 2L3 14h9v8l8-12h-9z" />
                                </svg>
                            </div>
                            <span className="text-white text-2xl font-bold">MyAppKpi</span>
                        </Link>
                    </div>
                    {user ? (
                        <div className="flex items-center gap-4 relative">
                            <span className="hidden lg:block text-white text-sm">Welcome, {user.username}</span>
                            <button
                                onClick={toggleDropdown}
                                className="relative flex items-center gap-2 hover:bg-indigo-600 px-2 py-2 rounded-md transition"
                            >
                                <div className="relative">
                                    <img
                                        className="w-9 h-9 rounded-full border-2 border-white"
                                        src="https://cdn.iconscout.com/icon/free/png-512/free-avatar-icon-download-in-svg-png-gif-file-formats--user-professor-avatars-flat-icons-pack-people-456317.png?f=webp&w=256"
                                        alt="profile"
                                    />
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                </div>
                                <ChevronDown className="text-white" />
                            </button>

                            {isOpen && (
                                <div className="absolute top-14 right-0 w-40 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                                    <NavLink
                                        to="/profile"
                                        className="block px-4 py-2 hover:bg-gray-100 transition"
                                    >
                                        Profile
                                    </NavLink>
                                    <hr className="border-gray-200" />
                                    <NavLink
                                        to="/user/my-users/"
                                        className="block px-4 py-2 hover:bg-gray-100 transition"
                                    >
                                        MyKpi
                                    </NavLink>
                                    <hr className="border-gray-200" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <NavLink
                                to="/login"
                                className="bg-indigo-800 text-white px-4 py-2 rounded-md hover:bg-indigo-900 transition text-sm"
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                className="border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-indigo-700 transition text-sm"
                            >
                                Register
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default MainNav;
