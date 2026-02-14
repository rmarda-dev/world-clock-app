import { useState, useEffect } from 'react';
import { Clock, Plus, X } from 'lucide-react';

function AnalogClock({ time, timezone }) {
  const timeStr = time.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = timeStr.split(':');
  const hours = parts[0] === '24' ? 0 : parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseInt(parts[2], 10);

  // Day: 6:00 – 17:59, Night: 18:00 – 5:59
  const isDay = hours >= 6 && hours < 18;

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;

  const cx = 60;
  const cy = 60;
  const r = 54;

  // Day palette: clean whites & slate
  // Night palette: deep navy & muted blues
  const bgColor        = isDay ? '#ffffff'  : '#0f172a';
  const borderColor    = isDay ? '#94a3b8'  : '#334155';
  const majorTickColor = isDay ? '#1e293b'  : '#94a3b8';
  const minorTickColor = isDay ? '#94a3b8'  : '#475569';
  const hourHandColor  = isDay ? '#1e293b'  : '#f1f5f9';
  const minHandColor   = isDay ? '#475569'  : '#cbd5e1';
  const secHandColor   = '#f97316'; // orange – visible on both
  const centerColor    = isDay ? '#1e293b'  : '#f1f5f9';

  // Convert polar angle (0° = 12 o'clock) to SVG x,y
  const polar = (angleDeg, len) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return [cx + len * Math.cos(rad), cy + len * Math.sin(rad)];
  };

  const [sx, sy] = polar(secondAngle, 43);
  const [mx, my] = polar(minuteAngle, 37);
  const [hx, hy] = polar(hourAngle, 25);

  // 12 hour tick marks
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const rad = ((i * 30 - 90) * Math.PI) / 180;
    const isQuarter = i % 3 === 0;
    const inner = r - (isQuarter ? 10 : 6);
    const outer = r - 2;
    return {
      x1: cx + outer * Math.cos(rad),
      y1: cy + outer * Math.sin(rad),
      x2: cx + inner * Math.cos(rad),
      y2: cy + inner * Math.sin(rad),
      isQuarter,
    };
  });

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-label={isDay ? 'Day' : 'Night'}>
      {/* Outer glow ring for night */}
      {!isDay && (
        <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke="#1e40af22" strokeWidth="6" />
      )}

      {/* Clock face */}
      <circle cx={cx} cy={cy} r={r} fill={bgColor} stroke={borderColor} strokeWidth="2" />

      {/* Tick marks */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1} y1={t.y1}
          x2={t.x2} y2={t.y2}
          stroke={t.isQuarter ? majorTickColor : minorTickColor}
          strokeWidth={t.isQuarter ? '2.5' : '1.5'}
          strokeLinecap="round"
        />
      ))}

      {/* Hour hand */}
      <line
        x1={cx} y1={cy} x2={hx} y2={hy}
        stroke={hourHandColor} strokeWidth="4" strokeLinecap="round"
      />

      {/* Minute hand */}
      <line
        x1={cx} y1={cy} x2={mx} y2={my}
        stroke={minHandColor} strokeWidth="2.5" strokeLinecap="round"
      />

      {/* Second hand */}
      <line
        x1={cx} y1={cy} x2={sx} y2={sy}
        stroke={secHandColor} strokeWidth="1.5" strokeLinecap="round"
      />

      {/* Center cap */}
      <circle cx={cx} cy={cy} r="4" fill={centerColor} />
      <circle cx={cx} cy={cy} r="2" fill={secHandColor} />
    </svg>
  );
}

function isDayTime(time, timezone) {
  const timeStr = time.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    hour12: false,
  });
  const h = timeStr === '24' ? 0 : parseInt(timeStr, 10);
  return h >= 6 && h < 18;
}

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
          {cities.map((city) => {
            const day = isDayTime(currentTime, city.timezone);
            return (
              <div
                key={city.id}
                className={`rounded-2xl shadow-lg p-6 transform transition hover:scale-105 relative ${
                  day ? 'bg-white' : 'bg-slate-800'
                }`}
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeCity(city.id)}
                  className={`absolute top-4 right-4 transition ${
                    day ? 'text-gray-400 hover:text-red-500' : 'text-slate-500 hover:text-red-400'
                  }`}
                  title="Remove city"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* City name + day/night label */}
                <div className="flex items-center gap-2 mb-4 pr-8">
                  <h2 className={`text-2xl font-semibold ${day ? 'text-gray-800' : 'text-slate-100'}`}>
                    {city.name}
                  </h2>
                  <span className="text-base" title={day ? 'Daytime' : 'Nighttime'}>
                    {day ? '☀️' : '🌙'}
                  </span>
                </div>

                {/* Clock dial + digital time side by side */}
                <div className="flex items-center gap-5">
                  <div className="flex-shrink-0">
                    <AnalogClock time={currentTime} timezone={city.timezone} />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className={`text-3xl font-bold tabular-nums ${day ? 'text-indigo-600' : 'text-indigo-400'}`}>
                      {formatTime(city.timezone)}
                    </div>
                    <div className={`text-sm ${day ? 'text-gray-600' : 'text-slate-400'}`}>
                      {formatDate(city.timezone)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
