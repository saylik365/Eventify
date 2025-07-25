import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './dashboard/DashboardLayout';
import AdminDashboard from './AdminDashboard';
import OwnerDashboard from './OwnerDashboard';
import CohostDashboard from './CohostDashboard';
import GuestDashboard from './GuestDashboard';
import UserDashboard from './UserDashboard';

const Dashboard = () => {
  const { globalRole, user, ownerOf, cohostOf, guestOf } = useAuth();
  let role = globalRole;
  if (role !== 'admin') {
    if (ownerOf && ownerOf.length > 0) role = 'owner';
    else if (cohostOf && cohostOf.length > 0) role = 'cohost';
    else if (guestOf && guestOf.length > 0) role = 'guest';
    else role = 'user';
  }
  let Content;
  switch (role) {
    case 'admin':
      Content = <AdminDashboard />;
      break;
    case 'owner':
      Content = <OwnerDashboard />;
      break;
    case 'cohost':
      Content = <CohostDashboard />;
      break;
    case 'guest':
      Content = <GuestDashboard />;
      break;
    default:
      Content = <UserDashboard />;
  }
  return (
    <DashboardLayout role={role} user={user}>
      {Content}
    </DashboardLayout>
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
