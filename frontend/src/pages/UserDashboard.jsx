import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { ownerOf, cohostOf, guestOf } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const joined = await api.get('/events/guest');
        setJoinedEvents(joined.data);
        const recs = await api.get('/recommendations');
        setRecommendations(recs.data);
      } catch {}
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  // RSVP stats
  const rsvpAccepted = joinedEvents.filter(e => e.rsvpStatus === 'accepted').length;
  const rsvpPending = joinedEvents.filter(e => e.rsvpStatus === 'pending').length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">Welcome to your Dashboard</h1>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Upcoming Events" value={joinedEvents.length} icon={<span>🎟️</span>} />
        <StatCard title="RSVP Accepted" value={rsvpAccepted} icon={<span>✅</span>} />
        <StatCard title="RSVP Pending" value={rsvpPending} icon={<span>⏳</span>} />
      </motion.div>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <h2 className="text-xl font-bold mb-2">Joined/Invited Events</h2>
          <ul>
            {joinedEvents.map(e => (
              <li key={e._id} className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
                <span className="font-semibold">{e.title}</span>
                <span className="ml-2 text-xs text-gray-500">{new Date(e.date).toLocaleDateString()}</span>
                <span className={`ml-2 text-xs font-semibold ${e.rsvpStatus === 'accepted' ? 'text-green-600' : 'text-yellow-600'}`}>{e.rsvpStatus}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="text-xl font-bold mb-2">Recommendations</h2>
          <ul>
            {recommendations.length === 0 && <li className="text-gray-400">No recommendations yet.</li>}
            {recommendations.map((rec, idx) => (
              <li key={idx} className="mb-2">{rec.title}</li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <button onClick={() => navigate('/create-event')} className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-600 transition">Create New Event</button>
      </div>
    </div>
  );
};

export default UserDashboard; 