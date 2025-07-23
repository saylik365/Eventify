import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './dashboard/DashboardLayout';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Card from '../components/Card';

const OwnerDashboard = () => {
  const [ownedEvents, setOwnedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await api.get('/events/mine');
        setOwnedEvents(res.data);
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
          <h1 className="text-3xl font-bold mb-8 text-center">Owner Dashboard</h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <Card>
              <h2 className="text-xl font-bold mb-2">Create Event</h2>
              <button onClick={() => navigate('/create-event')} className="bg-green-500 text-white px-4 py-2 rounded">Create Event</button>
            </Card>
            <Card>
              <h2 className="text-xl font-bold mb-2">My Events</h2>
              <ul>
                {ownedEvents.map(e => (
                  <li key={e._id} className="mb-2">
                    <span className="font-semibold">{e.title}</span>
                    <span className="ml-2 text-xs text-gray-500">{new Date(e.date).toLocaleDateString()}</span>
                    <button onClick={() => navigate(`/event/${e._id}/manage`)} className="ml-4 bg-blue-500 text-white px-2 py-1 rounded text-xs">Manage</button>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default OwnerDashboard;
