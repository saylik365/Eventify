import React from 'react';

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="font-bold text-lg">{event.title}</div>
      <div className="text-gray-500 text-sm mb-2">{event.date}</div>
      <div>{event.description}</div>
      <div className="mt-4 text-sm">
        <div><span className="font-semibold">Owner:</span> {event.owner?.name || 'N/A'}</div>
        <div><span className="font-semibold">Co-hosts:</span> {event.coHosts && event.coHosts.length > 0 ? event.coHosts.map(c => c.name).join(', ') : 'None'}</div>
        <div><span className="font-semibold">Guests:</span> {event.guests && event.guests.length > 0 ? event.guests.map(g => g.name || g.userId?.name || 'N/A').join(', ') : 'None'}</div>
      </div>
    </div>
  );
};

export default EventCard;
