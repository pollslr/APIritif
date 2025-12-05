import React from 'react';

export default function Dropdown({ cities, selectedCity, onCityChange }) 
{
  return (
    <select
      value={selectedCity}
      onChange={(e) => onCityChange(e.target.value)}
      style={{ padding: '0.5rem', fontSize: '1rem' }}
    >
      <option value="">-- Select a city --</option>
      {cities.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  );
}
