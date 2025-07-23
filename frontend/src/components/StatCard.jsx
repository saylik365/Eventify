import React from "react";

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center">
      <div className="mr-4 text-2xl">{icon}</div>
      <div>
        <div className="text-gray-500 text-sm">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
};

export default StatCard; 