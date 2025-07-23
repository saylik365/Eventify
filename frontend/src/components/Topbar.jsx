import React from "react";

const Topbar = () => {
  return (
    <header className="w-full bg-white shadow h-16 flex items-center px-6 justify-between">
      {/* Topbar content goes here */}
      <div className="font-bold text-xl">Dashboard</div>
      <div>{/* User info, notifications, etc. */}</div>
    </header>
  );
};

export default Topbar; 