import React from "react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md h-full p-4 hidden md:block">
      {/* Sidebar content goes here */}
      <div className="font-bold text-lg mb-4">Eventify</div>
      <ul>
        <li className="mb-2">Dashboard</li>
        {/* Add more sidebar links here */}
      </ul>
    </aside>
  );
};

export default Sidebar; 