import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import EventCard from '../components/EventCard';

const Recommendations = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get('/recommendations');
        setEvents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError('Failed to fetch recommendations');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Recommended Events</h1>
      {loading ? (
        <div>Loading recommendations...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : events.length === 0 ? (
        <div className="text-center">No recommendations found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <EventCard
              key={event._id}
              title={event.title}
              date={event.date}
              location={event.location}
              description={event.description}
              attendees={event.attendees.length}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
