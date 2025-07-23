import React from 'react';

const features = [
  {
    icon: '🎉',
    title: 'Create & Manage Events',
    desc: 'Easily create, edit, and manage your events with a user-friendly interface.'
  },
  {
    icon: '🤖',
    title: 'Smart Recommendations',
    desc: 'Get personalized event suggestions based on your interests and activity.'
  },
  {
    icon: '🛡️',
    title: 'Role-based Dashboards',
    desc: 'Custom dashboards for owners, co-hosts, guests, and admins.'
  },
  {
    icon: '📝',
    title: 'Event Moderation',
    desc: 'Admins can flag, feature, and moderate events to ensure quality.'
  },
  {
    icon: '🚩',
    title: 'Flag & Feature Events',
    desc: 'Highlight important events and flag inappropriate ones.'
  },
  {
    icon: '✅',
    title: 'RSVP Functionality',
    desc: 'RSVP to events and manage your attendance easily.'
  },
  {
    icon: '💬',
    title: 'Comments & Reviews',
    desc: 'Share your thoughts and feedback on events.'
  },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <section className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Features</h1>
        <p className="text-lg text-gray-700 mb-6">Discover all the powerful features that make Eventify the best event platform for everyone.</p>
      </section>
      <section className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {features.map(f => (
          <div key={f.title} className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
            <span className="text-5xl mb-3">{f.icon}</span>
            <h3 className="font-bold text-xl mb-2 text-blue-700">{f.title}</h3>
            <p className="text-gray-600 text-center">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
} 