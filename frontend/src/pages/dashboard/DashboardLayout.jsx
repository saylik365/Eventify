// DashboardLayout.jsx
// Layout component for all dashboards

import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar goes here */}
      {/* Sidebar goes here */}
      <main className="flex-1 p-4 bg-gray-50">{children}</main>
    </div>
  );
};

export default DashboardLayout; 