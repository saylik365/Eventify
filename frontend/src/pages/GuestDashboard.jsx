import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import Card from '../components/Card';
import StatCard from '../components/StatCard';

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

  const accepted = guestEvents.filter(e => e.rsvpStatus === 'accepted').length;
  const pending = guestEvents.filter(e => e.rsvpStatus === 'pending').length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">Guest Dashboard</h1>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Invited Events" value={guestEvents.length} icon={<span>🎟️</span>} />
        <StatCard title="Accepted" value={accepted} icon={<span>✅</span>} />
        <StatCard title="Pending" value={pending} icon={<span>⏳</span>} />
      </motion.div>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <h2 className="text-xl font-bold mb-2">Events Invited To</h2>
          <ul>
            {guestEvents.map(e => (
              <li key={e._id} className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
                <span className="font-semibold">{e.title}</span>
                <span className="ml-2 text-xs text-gray-500">{new Date(e.date).toLocaleDateString()}</span>
                <span className={`ml-2 text-xs font-semibold ${e.rsvpStatus === 'accepted' ? 'text-green-600' : 'text-yellow-600'}`}>{e.rsvpStatus}</span>
                {e.rsvpStatus === 'accepted' && (
                  <button className="ml-4 bg-blue-500 text-white px-2 py-1 rounded text-xs">Join Event</button>
                )}
                {e.rsvpStatus === 'pending' && (
                  <button className="ml-4 bg-green-500 text-white px-2 py-1 rounded text-xs">Accept</button>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default GuestDashboard;
