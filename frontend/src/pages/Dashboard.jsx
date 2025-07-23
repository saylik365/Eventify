import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import OwnerDashboard from './OwnerDashboard';
import CohostDashboard from './CohostDashboard';
import GuestDashboard from './GuestDashboard';
import UserDashboard from './UserDashboard';

const Dashboard = () => {
  const { globalRole, ownerOf, cohostOf, guestOf } = useAuth();
  // Build tabs based on roles
  const tabs = [
    { key: 'user', label: 'User', show: true, component: <UserDashboard /> },
    { key: 'owner', label: 'Owner', show: ownerOf && ownerOf.length > 0, component: <OwnerDashboard /> },
    { key: 'cohost', label: 'Co-host', show: cohostOf && cohostOf.length > 0, component: <CohostDashboard /> },
    { key: 'guest', label: 'Guest', show: guestOf && guestOf.length > 0, component: <GuestDashboard /> },
    { key: 'admin', label: 'Admin', show: globalRole === 'admin', component: <AdminDashboard /> },
  ].filter(tab => tab.show);
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || 'user');
  const activeComponent = tabs.find(tab => tab.key === activeTab)?.component || <UserDashboard />;

  return (
    <div className="max-w-5xl mx-auto mt-8 bg-white rounded shadow p-4">
      <div className="flex border-b mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors duration-200 focus:outline-none ${activeTab === tab.key ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
            aria-selected={activeTab === tab.key}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {activeComponent}
      </div>
    </div>
  );
};

export default Dashboard;

export function Forbidden() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
        <p className="text-lg text-gray-700 mb-4">Forbidden: You do not have permission to access this page.</p>
        <a href="/" className="text-blue-600 hover:underline">Go Home</a>
      </div>
    </div>
  );
}
