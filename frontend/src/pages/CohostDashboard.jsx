import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import DashboardLayout from './dashboard/DashboardLayout';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Card from '../components/Card';

const CohostDashboard = () => {
  const [cohostEvents, setCohostEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await api.get('/events/cohost');
        setCohostEvents(res.data);
      } catch {}
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <DashboardLayout>
      <Topbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Co-host Dashboard</h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <Card>
              <h2 className="text-xl font-bold mb-2">Assigned Events</h2>
              <ul>
                {cohostEvents.map(e => (
                  <li key={e._id} className="mb-2">
                    <span className="font-semibold">{e.title}</span>
                    <span className="ml-2 text-xs text-gray-500">{new Date(e.date).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h2 className="text-xl font-bold mb-2">Moderate RSVPs</h2>
              <div className="text-gray-500">RSVP moderation coming soon...</div>
            </Card>
          </motion.div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default CohostDashboard;
