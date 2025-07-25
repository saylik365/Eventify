import React from "react";

const Topbar = ({ role = "user", user }) => {
  return (
    <header className="w-full bg-white shadow h-16 flex items-center px-6 justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <span className="font-bold text-xl text-purple-700 hidden md:inline">
          {role === "admin"
            ? "Admin Panel"
            : role.charAt(0).toUpperCase() + role.slice(1) + " Dashboard"}
        </span>
        <span className="text-gray-400 text-sm hidden md:inline">Welcome, {user?.name || "User"}!</span>
      </div>
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search events, users..."
          className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-gray-50 shadow-sm"
        />
      </div>
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative text-gray-500 hover:text-purple-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">3</span>
        </button>
        {/* User avatar */}
        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700 text-lg">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
      </div>
    </header>
  );
};

export default Topbar; 