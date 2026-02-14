import React, { useState, useEffect } from 'react';
import { Clock, Plus, X } from 'lucide-react';

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cities, setCities] = useState([
    { id: 1, name: 'New York', timezone: 'America/New_York' },
    { id: 2, name: 'Seattle', timezone: 'America/Los_Angeles' },
    { id: 3, name: 'Mumbai', timezone: 'Asia/Kolkata' },
    { id: 4, name: 'Tokyo', timezone: 'Asia/Tokyo' }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCityName, setNewCityName] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const removeCity = (cityId) => {
    setCities(cities.filter(city => city.id !== cityId));
  };

  // City to timezone mapping
  const cityTimezoneMap = {
    // North America
    'new york': 'America/New_York',
    'los angeles': 'America/Los_Angeles',
    'chicago': 'America/Chicago',
    'houston': 'America/Chicago',
    'phoenix': 'America/Phoenix',
    'philadelphia': 'America/New_York',
    'san antonio': 'America/Chicago',
    'san diego': 'America/Los_Angeles',
    'dallas': 'America/Chicago',
    'san jose': 'America/Los_Angeles',
    'austin': 'America/Chicago',
    'seattle': 'America/Los_Angeles',
    'denver': 'America/Denver',
    'boston': 'America/New_York',
    'miami': 'America/New_York',
    'atlanta': 'America/New_York',
    'toronto': 'America/Toronto',
    'vancouver': 'America/Vancouver',
    'montreal': 'America/Montreal',
    'mexico city': 'America/Mexico_City',
    
    // Europe
    'london': 'Europe/London',
    'paris': 'Europe/Paris',
    'berlin': 'Europe/Berlin',
    'madrid': 'Europe/Madrid',
    'rome': 'Europe/Rome',
    'amsterdam': 'Europe/Amsterdam',
    'brussels': 'Europe/Brussels',
    'vienna': 'Europe/Vienna',
    'stockholm': 'Europe/Stockholm',
    'dublin': 'Europe/Dublin',
    'lisbon': 'Europe/Lisbon',
    'moscow': 'Europe/Moscow',
    'athens': 'Europe/Athens',
    'prague': 'Europe/Prague',
    'budapest': 'Europe/Budapest',
    'warsaw': 'Europe/Warsaw',
    
    // Asia
    'tokyo': 'Asia/Tokyo',
    'beijing': 'Asia/Shanghai',
    'shanghai': 'Asia/Shanghai',
    'hong kong': 'Asia/Hong_Kong',
    'singapore': 'Asia/Singapore',
    'dubai': 'Asia/Dubai',
    'mumbai': 'Asia/Kolkata',
    'delhi': 'Asia/Kolkata',
    'bangalore': 'Asia/Kolkata',
    'bangkok': 'Asia/Bangkok',
    'jakarta': 'Asia/Jakarta',
    'manila': 'Asia/Manila',
    'kuala lumpur': 'Asia/Kuala_Lumpur',
    'seoul': 'Asia/Seoul',
    'taipei': 'Asia/Taipei',
    'ho chi minh': 'Asia/Ho_Chi_Minh',
    'karachi': 'Asia/Karachi',
    'istanbul': 'Europe/Istanbul',
    'tehran': 'Asia/Tehran',
    'riyadh': 'Asia/Riyadh',
    
    // Australia & Oceania
    'sydney': 'Australia/Sydney',
    'melbourne': 'Australia/Melbourne',
    'brisbane': 'Australia/Brisbane',
    'perth': 'Australia/Perth',
    'auckland': 'Pacific/Auckland',
    
    // South America
    'sao paulo': 'America/Sao_Paulo',
    'buenos aires': 'America/Argentina/Buenos_Aires',
    'rio de janeiro': 'America/Sao_Paulo',
    'lima': 'America/Lima',
    'bogota': 'America/Bogota',
    'santiago': 'America/Santiago',
    
    // Africa
    'cairo': 'Africa/Cairo',
    'lagos': 'Africa/Lagos',
    'johannesburg': 'Africa/Johannesburg',
    'nairobi': 'Africa/Nairobi',
    'casablanca': 'Africa/Casablanca',
  };

  const getTimezone = (cityName) => {
    const normalizedName = cityName.toLowerCase().trim();
    return cityTimezoneMap[normalizedName] || 'UTC';
  };

  const addCity = (e) => {
    e.preventDefault();
    if (newCityName.trim()) {
      const timezone = getTimezone(newCityName);
      const newCity = {
        id: Date.now(),
        name: newCityName.trim(),
        timezone: timezone
      };
      setCities([...cities, newCity]);
      setNewCityName('');
      setShowAddForm(false);
    }
  };

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

        {/* Add City Button */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add City
          </button>
        </div>

        {/* Add City Form */}
        {showAddForm && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New City</h3>
            <form onSubmit={addCity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City Name
                </label>
                <input
                  type="text"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  placeholder="e.g., Paris, London, Dubai, Sydney"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  Timezone will be automatically detected for major cities
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Add City
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCityName('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* City Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cities.map((city) => (
            <div
              key={city.id}
              className="bg-white rounded-2xl shadow-lg p-6 transform transition hover:scale-105 relative"
            >
              {/* Remove Button */}
              <button
                onClick={() => removeCity(city.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                title="Remove city"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pr-8">
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

        {/* Empty State */}
        {cities.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No cities added yet</p>
            <p className="text-gray-400 text-sm">Click "Add City" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
