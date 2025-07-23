import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const locations = ['All', 'NYC', 'LA', 'SF', 'Chicago'];
const types = ['All', 'Tech', 'Art', 'Business', 'Music'];

export default function Events() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [location, setLocation] = useState('All');
  const [type, setType] = useState('All');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get('/events')
      .then(res => setEvents(res.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  let filtered = events.filter(ev =>
    (location === 'All' || ev.location === location) &&
    (type === 'All' || (ev.tags && ev.tags.includes(type))) &&
    (!date || (ev.date && ev.date.slice(0, 10) === date))
  );

  const featured = filtered.filter(ev => ev.featured);
  const others = filtered.filter(ev => !ev.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-10 px-4">
      <h1 className="text-4xl font-bold text-blue-700 text-center mb-8">All Events</h1>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <select value={location} onChange={e => setLocation(e.target.value)} className="border rounded px-3 py-2" aria-label="Filter by location">
          {locations.map(l => <option key={l}>{l}</option>)}
        </select>
        <select value={type} onChange={e => setType(e.target.value)} className="border rounded px-3 py-2" aria-label="Filter by type">
          {types.map(t => <option key={t}>{t}</option>)}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border rounded px-3 py-2" aria-label="Filter by date" />
      </div>
      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <span className="loader border-4 border-blue-200 border-t-blue-600 rounded-full w-12 h-12 animate-spin" aria-label="Loading events"></span>
        </div>
      ) : (
        <>
          {/* Featured Events */}
          {featured.length > 0 && (
            <section className="mb-10 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-yellow-600">Featured Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featured.map(ev => (
                  <div key={ev._id} className="bg-yellow-100 border-l-4 border-yellow-500 rounded-xl p-6 shadow">
                    <h3 className="font-bold text-xl mb-1">{ev.title}</h3>
                    <p className="text-gray-700 mb-1">By {ev.owner?.name || 'Unknown'} | {ev.date?.slice(0,10)} {ev.time} | {ev.location}</p>
                    <p className="text-gray-600 mb-2">{ev.description}</p>
                    <span className="inline-block bg-yellow-400 text-white text-xs px-2 py-1 rounded">Featured</span>
                    <button
                      className="ml-4 text-blue-700 underline font-semibold"
                      aria-label={`View details for ${ev.title}`}
                      onClick={() => navigate(`/event/${ev._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
          {/* Other Events */}
          <section className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-blue-700">All Events</h2>
            {others.length === 0 ? (
              <div className="text-center text-gray-500">No events found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {others.map(ev => (
                  <div key={ev._id} className="bg-white rounded-xl p-6 shadow border border-blue-100">
                    <h3 className="font-bold text-lg mb-1">{ev.title}</h3>
                    <p className="text-gray-700 mb-1">By {ev.owner?.name || 'Unknown'} | {ev.date?.slice(0,10)} {ev.time} | {ev.location}</p>
                    <p className="text-gray-600 mb-2">{ev.description}</p>
                    <button
                      className="text-blue-600 hover:underline font-semibold"
                      aria-label={`View details for ${ev.title}`}
                      onClick={() => navigate(`/event/${ev._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
} 