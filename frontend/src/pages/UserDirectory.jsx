import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function UserDirectory() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [reportUser, setReportUser] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get('/users')
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleReport = async () => {
    if (!reportReason || !reportUser) return;
    setReportLoading(true);
    try {
      await api.post('/events/reports', {
        type: 'user',
        targetId: reportUser._id,
        reason: reportReason,
      });
      setShowReport(false);
      setReportReason('');
      setReportUser(null);
      toast.success('User reported!');
    } catch {
      toast.error('Failed to report user');
    } finally {
      setReportLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">User Directory</h1>
      <input
        type="text"
        placeholder="Search by name or email"
        className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <ul className="divide-y">
        {filteredUsers.length === 0 && <li className="py-8 text-center text-gray-500">No users found.</li>}
        {filteredUsers.map(u => (
          <li key={u._id} className="flex items-center justify-between py-4">
            <div>
              <div className="font-semibold">{u.name}</div>
              <div className="text-gray-500 text-sm">{u.email}</div>
            </div>
            <div className="flex gap-2">
              {user?._id !== u._id && (
                <>
                  <button
                    onClick={() => { setReportUser(u); setShowReport(true); }}
                    className="bg-red-200 text-red-700 px-3 py-1 rounded hover:bg-red-300 transition"
                  >
                    Report
                  </button>
                  <button
                    onClick={() => navigate(`/profile/${u._id}`)}
                    className="bg-blue-200 text-blue-700 px-3 py-1 rounded hover:bg-blue-300 transition"
                  >
                    View Profile
                  </button>
                </>
              )}
              {user?._id === u._id && (
                <span className="text-xs text-gray-400">(You)</span>
              )}
            </div>
          </li>
        ))}
      </ul>
      {showReport && reportUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setShowReport(false)}>&times;</button>
            <h3 className="text-lg font-bold mb-2">Report User: {reportUser.name}</h3>
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
    </div>
  );
} 