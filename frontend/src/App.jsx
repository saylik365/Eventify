import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import Login from './pages/Login';
import Dashboard, { Forbidden } from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import Recommendations from './pages/Recommendations';
import PrivateRoute from './components/PrivateRoute';
import Navbar from '@components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminPanel from './pages/AdminPanel';
import ManageCoHosts from './pages/ManageCoHosts';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Events from './pages/Events';
import Footer from './components/Footer';
import UserDirectory from './pages/UserDirectory';
import Profile from './pages/Profile';
import OwnerDashboard from './pages/OwnerDashboard';
import CohostDashboard from './pages/CohostDashboard';
import GuestDashboard from './pages/GuestDashboard';
import MyEvents from './pages/MyEvents';

const App = () => {
  // Dashboard redirect component (inside AuthProvider)
  function DashboardRedirect() {
    const { globalRole, ownerOf, cohostOf, guestOf } = useAuth();
    if (!globalRole) return <Navigate to="/login" replace />;
    // Admins see admin tab first
    if (globalRole === 'admin') return <Navigate to="/dashboard/admin" replace />;
    // Owners see owner tab first
    if (ownerOf && ownerOf.length > 0) return <Navigate to="/dashboard/owner" replace />;
    // Cohosts see cohost tab first
    if (cohostOf && cohostOf.length > 0) return <Navigate to="/dashboard/cohost" replace />;
    // Guests see guest tab first
    if (guestOf && guestOf.length > 0) return <Navigate to="/dashboard/guest" replace />;
    // Default user
    return <Navigate to="/dashboard/user" replace />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/events" element={<Events />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/login" element={<Login />} />
          {/* Dashboard with tabs for all roles */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          {/* Role-based dashboard subroutes */}
          <Route path="/dashboard/user" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
          <Route path="/dashboard/owner" element={<PrivateRoute><OwnerDashboard /></PrivateRoute>} />
          <Route path="/dashboard/cohost" element={<PrivateRoute><CohostDashboard /></PrivateRoute>} />
          <Route path="/dashboard/guest" element={<PrivateRoute><GuestDashboard /></PrivateRoute>} />
          <Route path="/dashboard/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/create-event" element={<PrivateRoute><CreateEvent /></PrivateRoute>} />
          <Route path="/event/:id" element={<PrivateRoute><EventDetails /></PrivateRoute>} />
          <Route path="/recommendations" element={<PrivateRoute><Recommendations /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminPanel /></PrivateRoute>} />
          <Route path="/event/:id/manage" element={<PrivateRoute><ManageCoHosts /></PrivateRoute>} />
          <Route path="/admin-dashboard" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/users" element={<UserDirectory />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/403" element={<Forbidden />} />
          <Route path="/my-events" element={<PrivateRoute roles={['user','owner','cohost']}><MyEvents /></PrivateRoute>} />
          <Route path="*" element={<div className="flex items-center justify-center min-h-screen text-2xl font-bold">Page Not Found</div>} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
