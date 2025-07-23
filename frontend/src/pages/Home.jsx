import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '🎉', title: 'Create Events', desc: 'Easily create and manage your events.' },
  { icon: '🤖', title: 'Smart Recommendations', desc: 'Get personalized event suggestions.' },
  { icon: '🛡️', title: 'Role-based Dashboards', desc: 'Custom dashboards for every user role.' },
  { icon: '📝', title: 'Moderation Tools', desc: 'Admins can flag, feature, and moderate events.' },
];

const featuredEvents = [
  { title: 'Tech Conference', owner: 'Alice', date: '2024-07-01', location: 'NYC', desc: 'A gathering of tech enthusiasts.' },
  { title: 'Art Expo', owner: 'Bob', date: '2024-07-10', location: 'LA', desc: 'Showcasing modern art.' },
];

const testimonials = [
  { name: 'Priya', text: 'Eventify made event planning a breeze!' },
  { name: 'John', text: 'The recommendations are spot on.' },
  { name: 'Sara', text: 'Love the clean UI and easy RSVP.' },
];

export default function Home() {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { name: 'DemoUser', text: 'Excited for more events!' }
  ]);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([...comments, { name: 'You', text: comment }]);
      setComment('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4">Eventify</h1>
        <p className="text-xl mb-6 text-gray-700">Plan, Discover, and Experience Events Like Never Before</p>
        <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Get Started</Link>
      </section>

      {/* Features Summary */}
      <section className="py-10 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <span className="text-4xl mb-2">{f.icon}</span>
              <h3 className="font-bold text-lg mb-1">{f.title}</h3>
              <p className="text-gray-500 text-center">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-10 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Featured Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredEvents.map((ev) => (
            <div key={ev.title} className="bg-blue-100 rounded-lg p-6 shadow">
              <h3 className="font-bold text-xl mb-1">{ev.title}</h3>
              <p className="text-gray-700 mb-1">By {ev.owner} | {ev.date} | {ev.location}</p>
              <p className="text-gray-600">{ev.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-10 px-4 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">What Our Users Say</h2>
        <div className="bg-white rounded-xl shadow p-8 mb-4">
          <p className="text-lg italic mb-2">"{testimonials[testimonialIdx].text}"</p>
          <span className="font-semibold text-blue-700">- {testimonials[testimonialIdx].name}</span>
        </div>
        <div className="flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button key={idx} className={`w-3 h-3 rounded-full ${testimonialIdx === idx ? 'bg-blue-600' : 'bg-blue-200'}`} onClick={() => setTestimonialIdx(idx)} />
          ))}
        </div>
      </section>

      {/* Comment Section */}
      <section className="py-10 px-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <form onSubmit={handleComment} className="flex gap-2 mb-4">
          <input value={comment} onChange={e => setComment(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Add a comment..." />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
        </form>
        <div className="space-y-2">
          {comments.map((c, i) => (
            <div key={i} className="bg-gray-100 rounded p-2"><span className="font-semibold">{c.name}:</span> {c.text}</div>
          ))}
        </div>
      </section>
    </div>
  );
} 