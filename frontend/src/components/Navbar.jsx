import React from "react";
import gitImage from "/github-img.jpg";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const navItemClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-[#21262d] text-white"
        : "text-[#c9d1d9] hover:bg-[#21262d] hover:text-white"
    }`;

  return (
    <nav className="border-b border-[#30363d] bg-[#0d1117] px-4 py-3 text-[#c9d1d9] sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3">
        <NavLink
          to="/"
          className="group flex items-center gap-3 rounded-md px-2 py-1 transition-colors hover:bg-[#161b22]"
        >
          <img
            src={gitImage}
            alt="github logo"
            className="h-8 w-8 rounded-full border border-[#30363d] object-cover"
          />
          <div className="leading-tight">
            <h3 className="text-sm font-semibold text-white">GitHub Clone</h3>
            <p className="text-xs text-[#8b949e] group-hover:text-[#c9d1d9]">
              Dashboard
            </p>
          </div>
        </NavLink>

        <div className="flex items-center gap-2">
          <NavLink to="/create" className={navItemClass}>
            Create Repository
          </NavLink>

          <NavLink to="/users" className={navItemClass}>
            Users
          </NavLink>

          <NavLink to="/profile" className={navItemClass}>
            Profile
          </NavLink>

          <button 
            onClick={handleLogout}
            className="rounded-md px-3 py-2 text-sm font-medium text-[#f85149] hover:bg-[#f85149]/10 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
