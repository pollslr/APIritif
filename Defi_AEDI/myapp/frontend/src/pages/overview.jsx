import React, { useEffect, useState } from 'react';
import CityDropdown from '../components/Dropdown';
import Plot from 'react-plotly.js';
import Navbar from '../components/Navbar';

const API_KEY = 'ef7b38afd13444eda85131011253004';

const cities = ['Paris', 'London', 'New York', 'Tokyo', 'Sydney', "Amsterdam"];

export default function Overview() 
{
  const [selectedCity, setSelectedCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  useEffect(() => 
    {

        if (!selectedCity) return;
        const fetchWeather = async () => 
            {
                const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${selectedCity}&days=1&aqi=no&alerts=no`);
                const data = await res.json();
                setWeatherData(data.current);
                setForecastData(data.forecast.forecastday[0].hour);
            };

    fetchWeather();
  }, [selectedCity]);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <CityDropdown
          cities={cities}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
        />

        {weatherData && (
          <div
            style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '1rem',
              marginTop: '2rem',
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h2>Current Weather in {selectedCity}</h2>
            <p><strong>Temperature:</strong> {weatherData.temp_c} °C</p>
            <p><strong>Humidity:</strong> {weatherData.humidity} %</p>
            <p><strong>Wind:</strong> {weatherData.wind_kph} kph</p>
            <p><strong>Condition:</strong> {weatherData.condition.text}</p>
          </div>
        )}

        {forecastData && (
          <div style={{ marginTop: '3rem' }}>
            <Plot
              data={[
                {
                  x: forecastData.map((h) => h.time),
                  y: forecastData.map((h) => h.temp_c),
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: 'Température (°C)',
                  line: { color: 'orange' },
                },
              ]}
              layout={{
                title: {text: '24-hour temperature trend'},
                xaxis: { title: {text:'Hour' }},
                yaxis: { title: {text:'Température (°C)' }},
                width: 800,
                height: 400,
              }}
            />

            <Plot
              data={[
                {
                  x: forecastData.map((h) => h.time),
                  y: forecastData.map((h) => h.wind_kph),
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: 'Wind (kph)',
                  line: { color: 'skyblue' },
                },
              ]}
              layout={{
                title: { text: '24-hour wind trend'},
                xaxis: { title: {text: 'Hour' }},
                yaxis: { title: {text:'Vent (kph)' }},
                width: 800,
                height: 400,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
