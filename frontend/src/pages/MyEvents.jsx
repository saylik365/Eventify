import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function MyEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let fetchFn;
    if (user?.role === 'cohost') {
      fetchFn = api.get('/events/cohost');
    } else {
      fetchFn = api.get('/events/mine');
    }
    fetchFn
      .then(res => setEvents(res.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Events</h1>
      {events.length === 0 ? (
        <div className="text-center text-gray-500">No events found.</div>
      ) : (
        <ul className="divide-y">
          {events.map(e => (
            <li key={e._id} className="py-4">
              <div className="font-semibold text-lg">{e.title}</div>
              <div className="text-gray-500 text-sm">{e.date?.slice(0,10)} {e.time} | {e.location}</div>
              <div className="text-gray-700 mt-1">{e.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 