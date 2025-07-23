import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import DashboardLayout from './dashboard/DashboardLayout';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'; // Example for chart

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalEvents: 0, activeRsvps: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/reports');
        setStats(res.data);
      } catch {}
      setLoading(false);
    };
    fetchStats();
  }, []);

  // Example chart data
  // const data = [
  //   { name: 'Users', value: stats.totalUsers },
  //   { name: 'Events', value: stats.totalEvents },
  //   { name: 'Active RSVPs', value: stats.activeRsvps },
  // ];

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <DashboardLayout>
      <Topbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-8 mb-8">
            <StatCard title="Users" value={stats.totalUsers} icon={<span>👤</span>} />
            <StatCard title="Events" value={stats.totalEvents} icon={<span>🎉</span>} />
            <StatCard title="Active RSVPs" value={stats.activeRsvps} icon={<span>✅</span>} />
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h2 className="text-xl font-bold mb-2">User Management</h2>
              <a href="/admin" className="bg-blue-500 text-white px-4 py-2 rounded">Manage Users</a>
            </Card>
            <Card>
              <h2 className="text-xl font-bold mb-2">Event Moderation</h2>
              <a href="/admin" className="bg-red-500 text-white px-4 py-2 rounded">Moderate Events</a>
            </Card>
            <Card>
              <h2 className="text-xl font-bold mb-2">Reports</h2>
              <a href="/admin" className="bg-yellow-500 text-white px-4 py-2 rounded">View Reports</a>
            </Card>
            <Card>
              <h2 className="text-xl font-bold mb-2">System Stats (Chart)</h2>
              {/*
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
              */}
              <div className="text-gray-400">[Chart placeholder]</div>
            </Card>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard; 