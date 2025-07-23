import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaTrash, FaFlag, FaStar, FaUserShield, FaUserSlash, FaUser, FaExclamationTriangle, FaBell } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [reports, setReports] = useState([]);
  const [userSort, setUserSort] = useState({ field: 'name', dir: 'asc' });
  const [eventPage, setEventPage] = useState(1);
  const [eventPerPage] = useState(5);
  const [userFilter, setUserFilter] = useState('');
  const [selectedUserEvents, setSelectedUserEvents] = useState(null);

  // Analytics
  const totalUsers = users.length;
  const totalEvents = events.length;
  const activeRsvps = events.reduce((sum, e) => sum + (e.rsvps || 0), 0);

  // Fetch real data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, eventRes, reportRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/events'),
          api.get('/admin/reports'),
        ]);
        setUsers(userRes.data);
        setEvents(eventRes.data);
        // If reportRes.data is an array, setReports; if it's an object (stats), setReports([])
        if (Array.isArray(reportRes.data)) {
          setReports(reportRes.data);
        } else {
          setReports([]); // or handle stats elsewhere
        }
      } catch (err) {
        toast.error('Failed to fetch admin data');
      }
    };
    fetchData();
  }, []);

  // Sorting/filtering
  const sortedUsers = [...users]
    .filter(u => u.name.toLowerCase().includes(userFilter.toLowerCase()) || u.email.toLowerCase().includes(userFilter.toLowerCase()))
    .sort((a, b) => {
      const dir = userSort.dir === 'asc' ? 1 : -1;
      if (a[userSort.field] < b[userSort.field]) return -1 * dir;
      if (a[userSort.field] > b[userSort.field]) return 1 * dir;
      return 0;
    });

  // Pagination
  const paginatedEvents = events.slice((eventPage - 1) * eventPerPage, eventPage * eventPerPage);
  const totalEventPages = Math.ceil(events.length / eventPerPage);

  // User actions
  const handlePromote = async (id) => {
    try {
      await api.post(`/auth/promote/${id}`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: 'admin' } : u));
      toast.success('User promoted to admin');
    } catch {
      toast.error('Failed to promote user');
    }
  };
  const handleDemote = async (id) => {
    try {
      await api.post(`/admin/demote/${id}`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: 'user' } : u));
      toast.info('User demoted to user');
    } catch {
      toast.error('Failed to demote user');
    }
  };
  const handleDeactivate = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/deactivate`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, active: false } : u));
      toast.warn('User deactivated');
    } catch {
      toast.error('Failed to deactivate user');
    }
  };
  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.error('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };
  const handleViewUserEvents = async (id) => {
    try {
      const res = await api.get(`/admin/users/${id}/events`);
      setSelectedUserEvents(res.data);
    } catch {
      toast.error('Failed to fetch user events');
    }
  };

  // Event actions
  const handleDeleteEvent = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      setEvents(prev => prev.filter(e => e._id !== id));
      toast.error('Event deleted');
    } catch {
      toast.error('Failed to delete event');
    }
  };
  const handleFlagEvent = async (id) => {
    try {
      await api.post(`/admin/events/${id}/flag`);
      setEvents(prev => prev.map(e => e._id === id ? { ...e, flagged: true } : e));
      toast.warn('Event flagged');
    } catch {
      toast.error('Failed to flag event');
    }
  };
  const handleFeatureEvent = async (id) => {
    try {
      await api.post(`/admin/events/${id}/feature`);
      setEvents(prev => prev.map(e => e._id === id ? { ...e, featured: true } : e));
      toast.success('Event featured');
    } catch {
      toast.error('Failed to feature event');
    }
  };

  // Moderation
  const handleWarnUser = async (id) => {
    try {
      await api.post(`/admin/users/${id}/warn`);
      toast.info('User warned');
    } catch {
      toast.error('Failed to warn user');
    }
  };
  const handleRemoveEvent = async (id) => handleDeleteEvent(id);

  // Animations
  const fade = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  // Defensive check for reports being an array
  const safeReports = Array.isArray(reports) ? reports : [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Analytics Widgets */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" {...fade}>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <FaUser className="text-3xl text-blue-500 mb-2" />
          <div className="text-2xl font-bold">{totalUsers}</div>
          <div className="text-gray-500">Total Users</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <FaStar className="text-3xl text-yellow-500 mb-2" />
          <div className="text-2xl font-bold">{totalEvents}</div>
          <div className="text-gray-500">Total Events</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <FaBell className="text-3xl text-green-500 mb-2" />
          <div className="text-2xl font-bold">{activeRsvps}</div>
          <div className="text-gray-500">Active RSVPs</div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div className="bg-white rounded-xl shadow p-6 mb-8" {...fade}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Users</h2>
          <input
            type="text"
            placeholder="Filter by name or email"
            className="border px-3 py-1 rounded"
            value={userFilter}
            onChange={e => setUserFilter(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 cursor-pointer" onClick={() => setUserSort({ field: 'name', dir: userSort.dir === 'asc' ? 'desc' : 'asc' })}>
                  Name {userSort.field === 'name' && (userSort.dir === 'asc' ? <FaArrowUp className="inline" /> : <FaArrowDown className="inline" />)}
                </th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2 cursor-pointer" onClick={() => setUserSort({ field: 'role', dir: userSort.dir === 'asc' ? 'desc' : 'asc' })}>
                  Role {userSort.field === 'role' && (userSort.dir === 'asc' ? <FaArrowUp className="inline" /> : <FaArrowDown className="inline" />)}
                </th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map(u => (
                <motion.tr key={u._id} {...fade}>
                  <td className="px-3 py-2 font-medium">{u.name}</td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span>
                  </td>
                  <td className="px-3 py-2">
                    {u.active ? <span className="text-green-600">Active</span> : <span className="text-red-500">Inactive</span>}
                  </td>
                  <td className="px-3 py-2 flex gap-2 flex-wrap">
                    {u.role === 'user' && <button onClick={() => handlePromote(u._id)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition flex items-center"><FaUserShield className="mr-1" />Promote</button>}
                    {u.role === 'admin' && <button onClick={() => handleDemote(u._id)} className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition flex items-center"><FaUserSlash className="mr-1" />Demote</button>}
                    <button onClick={() => handleDeactivate(u._id)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition flex items-center"><FaExclamationTriangle className="mr-1" />Deactivate</button>
                    <button onClick={() => handleDeleteUser(u._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition flex items-center"><FaTrash className="mr-1" />Delete</button>
                    <button onClick={() => handleViewUserEvents(u._id)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition flex items-center"><FaStar className="mr-1" />Events</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* User's Events Modal */}
        {selectedUserEvents && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setSelectedUserEvents(null)}>&times;</button>
              <h3 className="text-xl font-bold mb-4">User's Events</h3>
              <ul>
                {selectedUserEvents.length === 0 ? <li>No events.</li> : selectedUserEvents.map(e => <li key={e._id}>{e.title}</li>)}
              </ul>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Events Table */}
      <motion.div className="bg-white rounded-xl shadow p-6 mb-8" {...fade}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Events</h2>
          <div className="flex gap-2">
            <button disabled={eventPage === 1} onClick={() => setEventPage(p => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Prev</button>
            <span>Page {eventPage} / {totalEventPages}</span>
            <button disabled={eventPage === totalEventPages} onClick={() => setEventPage(p => Math.min(totalEventPages, p + 1))} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Next</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Owner</th>
                <th className="px-3 py-2">RSVPs</th>
                <th className="px-3 py-2">Featured</th>
                <th className="px-3 py-2">Flagged</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEvents.map(e => (
                <motion.tr key={e._id} {...fade}>
                  <td className="px-3 py-2 font-medium">{e.title}</td>
                  <td className="px-3 py-2">{e.owner?.name || 'Unknown'}</td>
                  <td className="px-3 py-2">{e.rsvps}</td>
                  <td className="px-3 py-2">{e.featured ? <FaStar className="text-yellow-500 inline" /> : '-'}</td>
                  <td className="px-3 py-2">{e.flagged ? <FaFlag className="text-red-500 inline" /> : '-'}</td>
                  <td className="px-3 py-2 flex gap-2 flex-wrap">
                    <button onClick={() => handleDeleteEvent(e._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition flex items-center"><FaTrash className="mr-1" />Delete</button>
                    <button onClick={() => handleFlagEvent(e._id)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition flex items-center"><FaFlag className="mr-1" />Flag</button>
                    <button onClick={() => handleFeatureEvent(e._id)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition flex items-center"><FaStar className="mr-1" />Feature</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Moderation Tools */}
      <motion.div className="bg-white rounded-xl shadow p-6 mb-8" {...fade}>
        <h2 className="text-xl font-bold mb-4">Moderation Tools</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Reported Users</h3>
            <ul>
              {safeReports.filter(r => r.type === 'user').length === 0 && <li className="text-gray-500">No reported users.</li>}
              {safeReports.filter(r => r.type === 'user').map(r => (
                <li key={r.id} className="flex items-center justify-between mb-2">
                  <span>{r.name} <span className="text-xs text-gray-500">({r.reason})</span> <span className="ml-2 text-xs text-gray-400">{r.time}</span></span>
                  <button onClick={() => handleWarnUser(r.id)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition flex items-center"><FaExclamationTriangle className="mr-1" />Warn</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Reported Events</h3>
            <ul>
              {safeReports.filter(r => r.type === 'event').length === 0 && <li className="text-gray-500">No reported events.</li>}
              {safeReports.filter(r => r.type === 'event').map(r => (
                <li key={r.id} className="flex items-center justify-between mb-2">
                  <span>{r.name} <span className="text-xs text-gray-500">({r.reason})</span> <span className="ml-2 text-xs text-gray-400">{r.time}</span></span>
                  <button onClick={() => handleRemoveEvent(r.targetId)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition flex items-center"><FaTrash className="mr-1" />Remove</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPanel;