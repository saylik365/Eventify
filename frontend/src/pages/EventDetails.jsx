import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rsvped, setRsvped] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;
  const role = user?.role;
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
        if (userId && res.data.guests?.some(g => g.userId === userId && g.rsvpStatus === 'accepted')) {
          setRsvped(true);
        }
      } catch (err) {
        setError('Failed to fetch event');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
    // eslint-disable-next-line
  }, [id, userId]);

  const handleRsvp = async () => {
    setRsvpLoading(true);
    try {
      await api.post(`/events/${id}/rsvp`, { rsvpStatus: 'accepted' });
      setRsvped(true);
      setEvent((prev) => ({ ...prev, guests: prev.guests.map(g => g.userId === userId ? { ...g, rsvpStatus: 'accepted' } : g) }));
    } catch (err) {
      setError('Failed to RSVP');
    } finally {
      setRsvpLoading(false);
    }
  };

  const isOwner = event && (event.owner?._id === userId || event.owner === userId);
  const isCoHost = event && event.coHosts?.some(c => c._id === userId || c === userId);
  const isAdmin = role === 'admin';
  const isGuest = event && event.guests?.some(g => g.userId === userId);
  const canReport = user && !isOwner && !isCoHost && !isAdmin;

  const handleReport = async () => {
    if (!reportReason) return;
    setReportLoading(true);
    try {
      await api.post('/events/reports', {
        type: 'event',
        targetId: event._id,
        reason: reportReason,
      });
      setShowReport(false);
      setReportReason('');
      toast.success('Event reported!');
    } catch {
      toast.error('Failed to report event');
    } finally {
      setReportLoading(false);
    }
  };

  const handleAdminDelete = async () => {
    if (!event?._id) return;
    try {
      await api.delete(`/events/${event._id}`);
      toast.success('Event deleted!');
      // Optionally redirect to events page
      window.location.href = '/events';
    } catch {
      toast.error('Failed to delete event');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[200px]"><span className="loader border-4 border-blue-200 border-t-blue-600 rounded-full w-12 h-12 animate-spin" aria-label="Loading event details"></span></div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!event) return null;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 mt-8 rounded shadow w-full">
      <Helmet>
        <title>{event.title} | Eventify</title>
        <meta name="description" content={event.description?.slice(0, 150)} />
      </Helmet>
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
        {event.title}
        {/* Role badge */}
        {isOwner && <span className="px-2 py-1 rounded bg-purple-600 text-white text-xs font-semibold">Owner</span>}
        {!isOwner && isCoHost && <span className="px-2 py-1 rounded bg-yellow-500 text-white text-xs font-semibold">Co-host</span>}
        {!isOwner && !isCoHost && isGuest && <span className="px-2 py-1 rounded bg-blue-600 text-white text-xs font-semibold">Guest</span>}
      </h2>
      <div className="mb-2 text-gray-600">{event.date ? new Date(event.date).toLocaleString() : ''}</div>
      <div className="mb-2 font-medium">Location: {event.location}</div>
      <div className="mb-4">{event.description}</div>
      <div className="mb-4">Attendees: {event.guests?.length || 0}</div>
      <ul className="mb-4 list-disc list-inside text-gray-700">
        {event.guests?.map((g, idx) => (
          <li key={idx}>{g.name || g.userId} ({g.rsvpStatus})</li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 mb-4">
        {(isOwner || isCoHost) && (
          <>
            <button className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition" aria-label="Edit event">Edit</button>
            <button className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition" aria-label="Delete event">Delete</button>
          </>
        )}
        {isAdmin && event?._id && (
          <button onClick={handleAdminDelete} className="px-3 py-1 rounded bg-red-700 text-white hover:bg-red-800 transition" aria-label="Admin delete event">Admin Delete</button>
        )}
        {isGuest && (
          <button
            onClick={handleRsvp}
            disabled={rsvped || rsvpLoading}
            className={`px-4 py-1 rounded text-white ${rsvped ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition`}
            aria-label={rsvped ? 'RSVPed' : 'RSVP to this event'}
          >
            {rsvped ? 'RSVPed' : rsvpLoading ? 'RSVPing...' : 'RSVP'}
          </button>
        )}
        {(isOwner || isCoHost) && (
          <Link to={`/event/${event._id}/manage`} className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition" aria-label="Manage co-hosts and guests">Manage Co-Hosts & Guests</Link>
        )}
        {canReport && (
          <>
            <button onClick={() => setShowReport(true)} className="px-3 py-1 rounded bg-red-200 text-red-700 hover:bg-red-300 transition" aria-label="Report event">Report</button>
            {showReport && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs relative">
                  <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setShowReport(false)}>&times;</button>
                  <h3 className="text-lg font-bold mb-2">Report Event</h3>
                  <select value={reportReason} onChange={e => setReportReason(e.target.value)} className="w-full border rounded px-2 py-1 mb-3">
                    <option value="">Select reason</option>
                    <option value="spam">Spam</option>
                    <option value="inappropriate">Inappropriate</option>
                    <option value="other">Other</option>
                  </select>
                  <button onClick={handleReport} disabled={!reportReason || reportLoading} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition mb-2">{reportLoading ? 'Reporting...' : 'Submit Report'}</button>
                  <button onClick={() => setShowReport(false)} className="w-full bg-gray-200 text-gray-700 py-2 rounded">Cancel</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
