import React from 'react';

const team = [
  { name: 'Alice', role: 'Founder', img: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { name: 'Bob', role: 'Lead Dev', img: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { name: 'Priya', role: 'UI/UX', img: 'https://randomuser.me/api/portraits/women/3.jpg' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-12 px-4">
      <section className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">About Eventify</h1>
        <p className="text-lg text-gray-700 mb-6">Eventify is your all-in-one platform for discovering, planning, and managing events. We believe in making event experiences seamless and memorable for everyone.</p>
      </section>
      <section className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold mb-2 text-blue-700">Our Mission</h2>
          <p className="text-gray-700">To empower communities and individuals to create, discover, and enjoy events effortlessly.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold mb-2 text-blue-700">Our Vision</h2>
          <p className="text-gray-700">To be the world's most trusted and innovative event platform, connecting people everywhere.</p>
        </div>
      </section>
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">Meet the Team</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {team.map(member => (
            <div key={member.name} className="bg-blue-100 rounded-xl p-6 w-56 flex flex-col items-center shadow">
              <img src={member.img} alt={member.name} className="w-20 h-20 rounded-full mb-3" />
              <h3 className="font-bold text-lg mb-1">{member.name}</h3>
              <p className="text-blue-700">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Why Eventify?</h2>
        <ul className="text-gray-700 space-y-2">
          <li>✔️ Seamless event creation and management</li>
          <li>✔️ Smart recommendations for every user</li>
          <li>✔️ Secure, role-based access and moderation</li>
          <li>✔️ Modern, mobile-friendly design</li>
        </ul>
      </section>
    </div>
  );
} 