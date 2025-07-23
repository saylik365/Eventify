// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import api from '../utils/api';
// import { useAuth } from '../context/AuthContext';
// import { toast } from 'react-toastify';

// const ManageCoHosts = () => {
//   const { id } = useParams(); // eventId
//   const { user } = useAuth();
//   const [event, setEvent] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [coHostEmail, setCoHostEmail] = useState('');
//   const [guestEmail, setGuestEmail] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [eventRes, usersRes] = await Promise.all([
//           api.get(`/events/${id}`),
//           api.get('/admin/users'),
//         ]);
//         setEvent(eventRes.data);
//         setUsers(usersRes.data);
//       } catch {
//         toast.error('Failed to fetch event or users');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   const isOwner = event && event.owner === user?.id;
//   const isCoHost = event && event.coHosts?.includes(user?.id);

//   const handleAddCoHost = async () => {
//     const coHost = users.find(u => u.email === coHostEmail);
//     if (!coHost) return toast.error('User not found');
//     try {
//       await api.post(`/events/${id}/cohosts`, { coHostId: coHost._id });
//       setEvent(prev => ({ ...prev, coHosts: [...prev.coHosts, coHost._id] }));
//       toast.success('Co-host added');
//       setCoHostEmail('');
//     } catch {
//       toast.error('Failed to add co-host');
//     }
//   };

//   const handleRemoveCoHost = async (coHostId) => {
//     try {
//       await api.delete(`/events/${id}/cohosts/${coHostId}`);
//       setEvent(prev => ({ ...prev, coHosts: prev.coHosts.filter(id => id !== coHostId) }));
//       toast.success('Co-host removed');
//     } catch {
//       toast.error('Failed to remove co-host');
//     }
//   };

//   const handleInviteGuest = async () => {
//     const guest = users.find(u => u.email === guestEmail);
//     if (!guest) return toast.error('User not found');
//     try {
//       // Assume backend endpoint to add guest
//       await api.post(`/events/${id}/guests`, { userId: guest._id });
//       setEvent(prev => ({ ...prev, guests: [...prev.guests, { userId: guest._id, rsvpStatus: 'pending' }] }));
//       toast.success('Guest invited');
//       setGuestEmail('');
//     } catch {
//       toast.error('Failed to invite guest');
//     }
//   };

//   if (loading) return <div className="p-8">Loading...</div>;
//   if (!isOwner && !isCoHost) return <div className="p-8 text-red-600 font-bold">Access denied. Only owner or co-host can manage co-hosts/guests.</div>;

//   return (
//     <div className="max-w-xl mx-auto p-8">
//       <h1 className="text-2xl font-bold mb-6 text-center">Manage Co-Hosts & Guests</h1>
//       <div className="mb-8">
//         <h2 className="text-lg font-semibold mb-2">Current Co-Hosts</h2>
//         <ul className="bg-white rounded shadow divide-y mb-2">
//           {event.coHosts.map(id => {
//             const coHost = users.find(u => u._id === id);
//             return (
//               <li key={id} className="flex items-center justify-between px-4 py-2">
//                 <span>{coHost ? coHost.name : id}</span>
//                 <button onClick={() => handleRemoveCoHost(id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Remove</button>
//               </li>
//             );
//           })}
//         </ul>
//         <div className="flex gap-2 mt-2">
//           <input
//             type="email"
//             placeholder="Co-host email"
//             value={coHostEmail}
//             onChange={e => setCoHostEmail(e.target.value)}
//             className="border px-3 py-1 rounded w-full"
//           />
//           <button onClick={handleAddCoHost} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Add</button>
//         </div>
//       </div>
//       <div>
//         <h2 className="text-lg font-semibold mb-2">Invite Guests</h2>
//         <ul className="bg-white rounded shadow divide-y mb-2">
//           {event.guests.map(g => {
//             const guest = users.find(u => u._id === g.userId);
//             return (
//               <li key={g.userId} className="flex items-center justify-between px-4 py-2">
//                 <span>{guest ? guest.name : g.userId} <span className="ml-2 text-xs text-gray-500">({g.rsvpStatus})</span></span>
//               </li>
//             );
//           })}
//         </ul>
//         <div className="flex gap-2 mt-2">
//           <input
//             type="email"
//             placeholder="Guest email"
//             value={guestEmail}
//             onChange={e => setGuestEmail(e.target.value)}
//             className="border px-3 py-1 rounded w-full"
//           />
//           <button onClick={handleInviteGuest} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">Invite</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageCoHosts; 

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../utils/api';

const RSVP_LABELS = {
  accepted: 'Going',
  declined: 'Not Going',
  pending: 'Maybe',
};

const ManageCoHosts = () => {
  const { id } = useParams(); // eventId
  const [event, setEvent] = useState(null);
  const [users, setUsers] = useState([]);
  const [coHostEmail, setCoHostEmail] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState({ title: '', description: '', date: '', time: '' });
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Fetch event, users, and current user info
    const fetchData = async () => {
      try {
        const [eventRes, usersRes, meRes] = await Promise.all([
          api.get(`/events/${id}`),
          api.get('/admin/users'),
          api.get('/auth/me'),
        ]);
        setEvent(eventRes.data);
        setUsers(usersRes.data);
        setCurrentUserId(meRes.data._id);
        setEditFields({
          title: eventRes.data.title,
          description: eventRes.data.description,
          date: eventRes.data.date,
          time: eventRes.data.time,
        });
      } catch {
        toast.error('Failed to fetch event or users');
      }
    };
    fetchData();
  }, [id]);

  if (!event) return <div className="p-8">Loading...</div>;
  const isOwner = event.owner === currentUserId;
  const isCoHost = event.coHosts?.includes(currentUserId);

  // Co-host management
  const handleAddCoHost = async () => {
    const coHost = users.find(u => u.email === coHostEmail);
    if (!coHost) return toast.error('User not found');
    if (event.coHosts.includes(coHost._id)) return toast.info('Already a co-host');
    try {
      await api.post(`/events/${id}/cohosts`, { coHostId: coHost._id });
      setEvent(prev => ({ ...prev, coHosts: [...prev.coHosts, coHost._id] }));
      toast.success('Co-host added');
      setCoHostEmail('');
    } catch {
      toast.error('Failed to add co-host');
    }
  };
  const handleRemoveCoHost = async (coHostId) => {
    try {
      await api.delete(`/events/${id}/cohosts/${coHostId}`);
      setEvent(prev => ({ ...prev, coHosts: prev.coHosts.filter(id => id !== coHostId) }));
      toast.warn('Co-host removed');
    } catch {
      toast.error('Failed to remove co-host');
    }
  };

  // Guest management
  const handleAddGuest = async () => {
    const guest = users.find(u => u.email === guestEmail);
    if (!guest) return toast.error('User not found');
    if (event.guests.some(g => g.userId === guest._id)) return toast.info('Already a guest');
    try {
      await api.post(`/events/${id}/guests`, { userId: guest._id });
      setEvent(prev => ({ ...prev, guests: [...prev.guests, { userId: guest._id, rsvpStatus: 'pending' }] }));
      toast.success('Guest invited');
      setGuestEmail('');
    } catch {
      toast.error('Failed to invite guest');
    }
  };
  const handleRemoveGuest = async (userId) => {
    try {
      await api.delete(`/events/${id}/guests/${userId}`);
      setEvent(prev => ({ ...prev, guests: prev.guests.filter(g => g.userId !== userId) }));
      toast.warn('Guest removed');
    } catch {
      toast.error('Failed to remove guest');
    }
  };

  // Announcements
  const handleSendAnnouncement = () => {
    if (!announcement.trim()) return toast.info('Enter an announcement');
    // You can wire up a real API here
    toast.success('Announcement sent!');
    setAnnouncement('');
  };

  // Edit event
  const handleEditChange = (e) => {
    setEditFields({ ...editFields, [e.target.name]: e.target.value });
  };
  const handleSaveEdit = async () => {
    try {
      await api.put(`/events/${id}`, editFields);
      setEvent(prev => ({ ...prev, ...editFields }));
      setEditMode(false);
      toast.success('Event details updated');
    } catch {
      toast.error('Failed to update event');
    }
  };

  // Animations
  const fade = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div className="bg-white rounded-xl shadow p-6 mb-8" {...fade}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Manage Co-Hosts & Guests</h1>
          {isOwner && !editMode && (
            <button onClick={() => setEditMode(true)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Edit Event</button>
          )}
        </div>
        {editMode ? (
          <motion.form className="space-y-4" {...fade} onSubmit={e => { e.preventDefault(); handleSaveEdit(); }}>
            <motion.input name="title" value={editFields.title} onChange={handleEditChange} className="w-full border px-3 py-2 rounded" placeholder="Title" whileFocus={{ scale: 1.03 }} />
            <motion.textarea name="description" value={editFields.description} onChange={handleEditChange} className="w-full border px-3 py-2 rounded" placeholder="Description" whileFocus={{ scale: 1.03 }} />
            <div className="flex gap-2">
              <motion.input name="date" type="date" value={editFields.date} onChange={handleEditChange} className="border px-3 py-2 rounded w-1/2" whileFocus={{ scale: 1.03 }} />
              <motion.input name="time" type="time" value={editFields.time} onChange={handleEditChange} className="border px-3 py-2 rounded w-1/2" whileFocus={{ scale: 1.03 }} />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">Save</button>
              <button type="button" onClick={() => setEditMode(false)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition">Cancel</button>
            </div>
          </motion.form>
        ) : (
          <motion.div {...fade}>
            <div className="mb-2"><span className="font-semibold">Title:</span> {event.title}</div>
            <div className="mb-2"><span className="font-semibold">Description:</span> {event.description}</div>
            <div className="mb-2"><span className="font-semibold">Date:</span> {event.date}</div>
            <div className="mb-2"><span className="font-semibold">Time:</span> {event.time}</div>
          </motion.div>
        )}
      </motion.div>

      {/* Co-Hosts */}
      <motion.div className="bg-white rounded-xl shadow p-6 mb-8" {...fade}>
        <h2 className="text-lg font-bold mb-4">Co-Hosts</h2>
        <ul className="mb-2">
          {event.coHosts.map(id => {
            const coHost = users.find(u => u._id === id);
            return (
              <li key={id} className="flex items-center justify-between mb-2">
                <span>{coHost ? coHost.name : id}</span>
                {isOwner && (
                  <button onClick={() => handleRemoveCoHost(id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">Remove</button>
                )}
              </li>
            );
          })}
        </ul>
        {(isOwner || isCoHost) && (
          <div className="flex gap-2 mt-2">
            <motion.input
              type="email"
              placeholder="Co-host email"
              value={coHostEmail}
              onChange={e => setCoHostEmail(e.target.value)}
              className="border px-3 py-1 rounded w-full"
              whileFocus={{ scale: 1.03 }}
            />
            <button onClick={handleAddCoHost} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Add</button>
          </div>
        )}
      </motion.div>

      {/* Guests */}
      <motion.div className="bg-white rounded-xl shadow p-6 mb-8" {...fade}>
        <h2 className="text-lg font-bold mb-4">Guests & RSVPs</h2>
        <ul className="mb-2">
          {event.guests.map(g => {
            const guest = users.find(u => u._id === g.userId);
            return (
              <li key={g.userId} className="flex items-center justify-between mb-2">
                <span>{guest ? guest.name : g.userId} <span className="ml-2 text-xs text-gray-500">({RSVP_LABELS[g.rsvpStatus]})</span></span>
                {(isOwner || isCoHost) && (
                  <button onClick={() => handleRemoveGuest(g.userId)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">Remove</button>
                )}
              </li>
            );
          })}
        </ul>
        {(isOwner || isCoHost) && (
          <div className="flex gap-2 mt-2">
            <motion.input
              type="email"
              placeholder="Guest email"
              value={guestEmail}
              onChange={e => setGuestEmail(e.target.value)}
              className="border px-3 py-1 rounded w-full"
              whileFocus={{ scale: 1.03 }}
            />
            <button onClick={handleAddGuest} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">Invite</button>
          </div>
        )}
      </motion.div>

      {/* Announcements */}
      <motion.div className="bg-white rounded-xl shadow p-6 mb-8" {...fade}>
        <h2 className="text-lg font-bold mb-4">Send Announcement</h2>
        <div className="flex gap-2">
          <motion.input
            type="text"
            placeholder="Type your announcement..."
            value={announcement}
            onChange={e => setAnnouncement(e.target.value)}
            className="border px-3 py-1 rounded w-full"
            whileFocus={{ scale: 1.03 }}
          />
          <button onClick={handleSendAnnouncement} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Send</button>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageCoHosts;