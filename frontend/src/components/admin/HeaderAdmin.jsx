import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useKpiStore from "../../store/kpi-store";

const HeaderAdmin = () => {
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
    <header className="bg-gradient-to-r from-indigo-700 to-indigo-900 h-16 flex items-center px-6 shadow-md">
      <div className="flex justify-end w-full relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 hover:bg-indigo-800 px-3 py-2 rounded-md border border-indigo-600 shadow cursor-pointer transition text-white"
        >
          <div className="relative">
            <img
              className="w-9 h-9 rounded-full border-2 border-white"
              src="https://cdn.iconscout.com/icon/free/png-512/free-avatar-icon-download-in-svg-png-gif-file-formats--user-professor-avatars-flat-icons-pack-people-456317.png?f=webp&w=256"
              alt="User avatar"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <span className="hidden md:block text-sm">{user ? user.username : "Admin"}</span>
          <ChevronDown size={18} />
        </button>

        {isOpen && (
          <div className="absolute top-14 right-0 w-40 bg-white rounded-md shadow-lg z-50 overflow-hidden">
            <button
              onClick={() => navigate("/admin/profile")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
            >
              Profile
            </button>
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
    </header>
  );
};

export default HeaderAdmin;
