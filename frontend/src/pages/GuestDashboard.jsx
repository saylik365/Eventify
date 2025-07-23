import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import DashboardLayout from './dashboard/DashboardLayout';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Card from '../components/Card';

const GuestDashboard = () => {
  const [guestEvents, setGuestEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await api.get('/events/guest');
        setGuestEvents(res.data);
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
          <h1 className="text-3xl font-bold mb-8 text-center">Guest Dashboard</h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <Card>
              <h2 className="text-xl font-bold mb-2">Events Invited To</h2>
              <ul>
                {guestEvents.map(e => (
                  <li key={e._id} className="mb-2">
                    <span className="font-semibold">{e.title}</span>
                    <span className="ml-2 text-xs text-gray-500">{new Date(e.date).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h2 className="text-xl font-bold mb-2">RSVP</h2>
              <div className="text-gray-500">RSVP functionality coming soon...</div>
            </Card>
          </motion.div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default GuestDashboard;
