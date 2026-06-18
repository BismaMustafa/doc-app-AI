import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false); // new state
 const {token,setToken,userData} = useContext(AppContext)
 const logout = () =>{
    setToken(false)
    localStorage.removeItem('token',)
 }

  return (
    <div className="flex items-center justify-between px-5 py-4 mb-5 border-b border-gray-300 bg-white shadow-sm relative">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="logo"
          className="h-10 w-auto cursor-pointer"
        />
      </div>

      {/* Center: Nav Links (hidden on small screens) */}
      <ul className="hidden md:flex items-center space-x-8 text-base font-medium">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-blue-700 font-bold border-b-2 border-blue-700 pb-1"
              : "text-gray-700 hover:text-blue-700"
          }
        >
          <li>Home</li>
        </NavLink>
        <NavLink
          to="/doctors"
          className={({ isActive }) =>
            isActive
              ? "text-blue-700 font-bold border-b-2 border-blue-700 pb-1"
              : "text-gray-700 hover:text-blue-700"
          }
        >
          <li>All Doctors</li>
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "text-blue-700 font-bold border-b-2 border-blue-700 pb-1"
              : "text-gray-700 hover:text-blue-700"
          }
        >
          <li>About</li>
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive
              ? "text-blue-700 font-bold border-b-2 border-blue-700 pb-1"
              : "text-gray-700 hover:text-blue-700"
          }
        >
          <li>Contact</li>
        </NavLink>
      </ul>

      {/* Right: Profile/Account or Menu Icon */}
      <div className="flex items-center gap-4">
        {/* Desktop: Account/Profile */}
        <div>
          {token && userData ? (
            <div className="relative flex items-center gap-2 cursor-pointer">
              {/* Profile Pic + Dropdown Icon */}
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2"
              >
                <img
                  className="w-9 rounded-full"
                  src={userData.image}
                  alt="profile"
                />
                <img
                  className="w-2.5"
                  src={assets.dropdown_icon}
                  alt="dropdown"
                />
              </div>

              {/* Dropdown Menu - conditional render */}
              {showProfileMenu && (
                <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg p-4 text-sm font-medium z-50 min-w-[180px]">
                  <p
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/my-profile");
                    }}
                    className="cursor-pointer hover:text-black text-gray-600 mb-2"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/my-appointments");
                    }}
                    className="cursor-pointer hover:text-black text-gray-600 mb-2"
                  >
                    My Appointments
                  </p>
                  <p
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout()
                    }}
                    className="cursor-pointer hover:text-black text-gray-600"
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden md:block bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-full transition duration-300 cursor-pointer"
            >
              Create Account
            </button>
          )}
        </div>

        {/* Mobile: Menu Icon */}
        <div className="md:hidden">
          <img
            onClick={() => setShowMenu(true)}
            className="w-7 cursor-pointer"
            src={assets.menu_icon}
            alt="menu"
          />
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`${
          showMenu ? "fixed" : "hidden"
        } md:hidden top-0 right-0 w-full h-full bg-white z-50 transition-all`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <img className="w-36" src={assets.logo} alt="logo" />
          <img
            className="w-7 cursor-pointer"
            onClick={() => setShowMenu(false)}
            src={assets.cross_icon}
            alt="close"
          />
        </div>
        <ul className="flex flex-col items-center gap-4 mt-5 px-5 text-lg font-medium">
          <NavLink onClick={() => setShowMenu(false)} to="/">
            <p className="px-4 py-2 rounded cursor-pointer">Home</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/doctors">
            <p className="px-4 py-2 rounded cursor-pointer">All Doctors</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/about">
            <p className="px-4 py-2 rounded cursor-pointer">About</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/contact">
            <p className="px-4 py-2 rounded cursor-pointer">Contact</p>
          </NavLink>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
