import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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

  // Guest RSVP stats (across all owned events)
  let totalGuests = 0, accepted = 0, pending = 0;
  ownedEvents.forEach(e => {
    if (Array.isArray(e.guests)) {
      totalGuests += e.guests.length;
      accepted += e.guests.filter(g => g.rsvpStatus === 'accepted').length;
      pending += e.guests.filter(g => g.rsvpStatus === 'pending').length;
    }
  });

  // Analytics chart data
  const chartData = ownedEvents.map(e => ({ name: e.title, Guests: e.guests?.length || 0 }));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">Owner Dashboard</h1>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard title="My Events" value={ownedEvents.length} icon={<span>🎉</span>} />
        <StatCard title="Total Guests" value={totalGuests} icon={<span>👥</span>} />
        <StatCard title="RSVP Accepted" value={accepted} icon={<span>✅</span>} />
      </motion.div>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <h2 className="text-xl font-bold mb-2">My Events</h2>
          <ul>
            {ownedEvents.map(e => (
              <li key={e._id} className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
                <span className="font-semibold">{e.title}</span>
                <span className="ml-2 text-xs text-gray-500">{new Date(e.date).toLocaleDateString()}</span>
                <button onClick={() => navigate(`/event/${e._id}/manage`)} className="ml-4 bg-blue-500 text-white px-2 py-1 rounded text-xs">Manage</button>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="text-xl font-bold mb-2">Guest RSVP Stats</h2>
          <div className="flex gap-4">
            <span className="text-green-600 font-semibold">Accepted: {accepted}</span>
            <span className="text-yellow-600 font-semibold">Pending: {pending}</span>
          </div>
        </Card>
      </div>
      <div className="mb-8">
        <Card>
          <h2 className="text-xl font-bold mb-2">Event Analytics</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Guests" fill="#a78bfa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <button onClick={() => navigate('/create-event')} className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-600 transition">Create New Event</button>
        <button onClick={() => navigate('/manage-cohosts')} className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-purple-600 transition">Add Co-host</button>
      </div>
    </div>
  );
};

export default OwnerDashboard;
