// DashboardLayout.jsx
// Layout component for all dashboards

import React from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

const DashboardLayout = ({ children, role, user }) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar role={role} user={user} />
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <Topbar role={role} user={user} />
        {/* Main content */}
        <main className="flex-1 p-6 md:p-10 bg-gray-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 