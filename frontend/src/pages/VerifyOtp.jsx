import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem('email') || localStorage.getItem('registerEmail');

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      toast.success('OTP verified! You are now logged in.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
      toast.error(err.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      await api.post('/auth/resend-otp', { email });
      toast.success('OTP resent! Check your email.');
      setTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    }
    setResending(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <div className="mb-6">
          <label className="block mb-1 font-medium">Enter OTP</label>
          <input
            type="text"
            maxLength={6}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring text-center tracking-widest text-lg"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={otp.length !== 6}
        >
          Verify
        </button>
        <div className="mt-6 text-center text-gray-600">
          {timer > 0 ? (
            <span>Resend OTP in {timer}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-blue-600 font-semibold hover:underline disabled:opacity-50"
              disabled={resending}
            >
              {resending ? 'Resending...' : 'Resend OTP'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default VerifyOtp;
