import React from "react";
import { Link, useLocation } from "react-router-dom";
// Example icons (replace with Heroicons or SVGs as needed)
const icons = {
  dashboard: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-6 0v6m0 0H7m6 0h6" /></svg>
  ),
  events: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ),
  users: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 010 7.75" /></svg>
  ),
  analytics: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 17a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6a2 2 0 00-2 2v10zm-6 4a2 2 0 002-2V7a2 2 0 00-2-2H3a2 2 0 00-2 2v12a2 2 0 002 2h2z" /></svg>
  ),
};

const navByRole = {
  user: [
    { to: "/dashboard", label: "Dashboard", icon: icons.dashboard },
    { to: "/my-events", label: "My Events", icon: icons.events },
  ],
  owner: [
    { to: "/dashboard/owner", label: "Owner Dashboard", icon: icons.dashboard },
    { to: "/my-events", label: "My Events", icon: icons.events },
    { to: "/manage-cohosts", label: "Co-hosts", icon: icons.users },
    { to: "/analytics", label: "Analytics", icon: icons.analytics },
  ],
  cohost: [
    { to: "/dashboard/cohost", label: "Co-host Dashboard", icon: icons.dashboard },
    { to: "/my-events", label: "My Events", icon: icons.events },
  ],
  guest: [
    { to: "/dashboard/guest", label: "Guest Dashboard", icon: icons.dashboard },
    { to: "/my-events", label: "My Events", icon: icons.events },
  ],
  admin: [
    { to: "/dashboard/admin", label: "Admin Dashboard", icon: icons.dashboard },
    { to: "/admin", label: "User Management", icon: icons.users },
    { to: "/analytics", label: "Analytics", icon: icons.analytics },
  ],
};

const Sidebar = ({ role = "user", user }) => {
  const location = useLocation();
  const nav = navByRole[role] || navByRole.user;
  return (
    <aside className="w-20 md:w-64 bg-white shadow-lg h-screen p-4 flex flex-col items-center md:items-start sticky top-0 z-20">
      <div className="font-extrabold text-xl text-purple-700 mb-8 tracking-tight">Eventify</div>
      <ul className="w-full">
        {nav.map((item) => (
          <li key={item.to} className="mb-2">
            <Link
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium hover:bg-purple-50 hover:text-purple-700 ${location.pathname === item.to ? "bg-purple-100 text-purple-700" : "text-gray-700"}`}
            >
              <span>{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto w-full pt-8 hidden md:block">
        <div className="text-xs text-gray-400 mb-1">Logged in as</div>
        <div className="font-semibold text-gray-700 truncate">{user?.name || "User"}</div>
        <div className="text-xs text-purple-600 font-bold">{role.charAt(0).toUpperCase() + role.slice(1)}</div>
      </div>
    </aside>
  );
};

export default Sidebar; 