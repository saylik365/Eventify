import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './dashboard/DashboardLayout';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const [ownedEvents, setOwnedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { ownerOf, cohostOf, guestOf } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const [owned, joined] = await Promise.all([
          api.get('/events/mine'),
          api.get('/events/guest'),
        ]);
        setOwnedEvents(owned.data);
        setJoinedEvents(joined.data);
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
          <h1 className="text-3xl font-bold mb-8 text-center">User Dashboard</h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-8">
            <Card>
              <h2 className="text-xl font-bold mb-2">Create Event</h2>
              <button onClick={() => navigate('/create-event')} className="bg-green-500 text-white px-4 py-2 rounded">Create Event</button>
            </Card>
            <Card>
              <h2 className="text-xl font-bold mb-2">Joined/Invited Events</h2>
              <ul>
                {joinedEvents.map(e => (
                  <li key={e._id} className="mb-2">{e.title}</li>
                ))}
              </ul>
            </Card>
            <Card>
              <h2 className="text-xl font-bold mb-2">Profile</h2>
              <button onClick={() => navigate('/profile')} className="bg-blue-500 text-white px-4 py-2 rounded">Update Profile</button>
            </Card>
            {/* Role navigation */}
            {(ownerOf && ownerOf.length > 0) && (
              <Card>
                <h2 className="text-xl font-bold mb-2">Owner Tools</h2>
                <button onClick={() => navigate('/dashboard/owner')} className="bg-purple-500 text-white px-4 py-2 rounded">Go to Owner Dashboard</button>
              </Card>
            )}
            {(cohostOf && cohostOf.length > 0) && (
              <Card>
                <h2 className="text-xl font-bold mb-2">Cohost Tools</h2>
                <button onClick={() => navigate('/dashboard/cohost')} className="bg-yellow-500 text-white px-4 py-2 rounded">Go to Cohost Dashboard</button>
              </Card>
            )}
            {(guestOf && guestOf.length > 0) && (
              <Card>
                <h2 className="text-xl font-bold mb-2">Guest Tools</h2>
                <button onClick={() => navigate('/dashboard/guest')} className="bg-pink-500 text-white px-4 py-2 rounded">Go to Guest Dashboard</button>
              </Card>
            )}
          </motion.div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard; 