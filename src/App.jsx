import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const cities = [
    { name: 'New York', timezone: 'America/New_York' },
    { name: 'Seattle', timezone: 'America/Los_Angeles' },
    { name: 'Mumbai', timezone: 'Asia/Kolkata' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo' }
  ];

  const formatTime = (timezone) => {
    return currentTime.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timezone) => {
    return currentTime.toLocaleDateString('en-US', {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">World Clock</h1>
          </div>
          <p className="text-gray-600">Current time across the globe</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cities.map((city) => (
            <div
              key={city.name}
              className="bg-white rounded-2xl shadow-lg p-6 transform transition hover:scale-105"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {city.name}
              </h2>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-indigo-600">
                  {formatTime(city.timezone)}
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(city.timezone)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
