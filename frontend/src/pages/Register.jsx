// import React, { useState } from 'react';
// import api from '../utils/api';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const Register = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       await api.post('/auth/register', { name, email, password });
//       localStorage.setItem('registerEmail', email);
//       toast.success('Registered successfully! Please verify OTP.');
//       navigate('/verify-otp');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed');
//       toast.error(err.response?.data?.message || 'Registration failed');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
//         {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Name</label>
//           <input
//             type="text"
//             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Email</label>
//           <input
//             type="email"
//             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block mb-1 font-medium">Password</label>
//           <input
//             type="password"
//             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import api from '../utils/api';

// const Register = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       await api.post('/auth/register', { name, email, password });
//       localStorage.setItem('registerEmail', email);
//       toast.success('🎉 Registered! Please verify OTP.');
//       navigate('/verify-otp');
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Registration failed';
//       setError(msg);
//       toast.error(`❌ ${msg}`);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 transition-all px-4">
//       <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-gray-700 p-8 rounded-3xl shadow-2xl w-full max-w-md relative animate-fade-in">
//         <h1 className="text-4xl font-bold text-center text-blue-700 dark:text-white mb-2 tracking-wide">
//           Eventify
//         </h1>
//         <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
//           Plan. Share. Celebrate.
//         </p>

//         {error && (
//           <div className="mb-4 text-red-600 text-sm text-center font-medium bg-red-50 border border-red-300 p-2 rounded">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
//               Full Name
//             </label>
//             <input
//               type="text"
//               className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
//               Email Address
//             </label>
//             <input
//               type="email"
//               className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
//               Password
//             </label>
//             <input
//               type="password"
//               className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
//           >
//             Register
//           </button>
//         </form>

//         <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
//           Already have an account?{' '}
//           <a href="/login" className="text-blue-600 hover:underline">
//             Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;

// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', form);
      localStorage.setItem('registerEmail', form.email);
      toast.success('Registered successfully! Please verify OTP.');
      navigate('/verify-otp');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl p-10 rounded-3xl w-full max-w-md animate-fade-in"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-indigo-600">Create an Account</h2>

        {error && (
          <div className="mb-4 text-red-600 text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        {['name', 'email', 'password'].map((field) => (
          <div key={field} className="relative z-0 w-full mb-6 group">
            <input
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              placeholder=" "
            />
            <label
              htmlFor={field}
              className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
              peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
          </div>
        ))}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition duration-300 font-semibold"
        >
          Register
        </button>

        <div className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;





