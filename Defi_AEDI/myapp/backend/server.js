const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/weather', (req, res) => {
  const city = req.query.city;
  
  const mockData = {
    Paris: {
      current: {
        temp_c: 15,
        humidity: 65,
        wind_kph: 12,
        condition: { text: 'Partly cloudy' }
      },
      forecast: [
        { time: '00:00', temp_c: 14, wind_kph: 10 },
        { time: '01:00', temp_c: 13, wind_kph: 11 },
        { time: '02:00', temp_c: 12, wind_kph: 9 },
        { time: '03:00', temp_c: 11, wind_kph: 8 },
        { time: '04:00', temp_c: 10, wind_kph: 7 },
        { time: '05:00', temp_c: 12, wind_kph: 8 },
        { time: '06:00', temp_c: 14, wind_kph: 9 },
        { time: '07:00', temp_c: 15, wind_kph: 10 },
        { time: '08:00', temp_c: 17, wind_kph: 11 },
        { time: '09:00', temp_c: 18, wind_kph: 12 },
        { time: '10:00', temp_c: 19, wind_kph: 13 },
        { time: '11:00', temp_c: 20, wind_kph: 14 },
        { time: '12:00', temp_c: 21, wind_kph: 15 },
        { time: '13:00', temp_c: 22, wind_kph: 14 },
        { time: '14:00', temp_c: 22, wind_kph: 13 },
        { time: '15:00', temp_c: 21, wind_kph: 12 },
        { time: '16:00', temp_c: 19, wind_kph: 11 },
        { time: '17:00', temp_c: 18, wind_kph: 10 },
        { time: '18:00', temp_c: 16, wind_kph: 9 },
        { time: '19:00', temp_c: 15, wind_kph: 8 },
        { time: '20:00', temp_c: 14, wind_kph: 7 },
        { time: '21:00', temp_c: 13, wind_kph: 6 },
        { time: '22:00', temp_c: 12, wind_kph: 5 },
        { time: '23:00', temp_c: 11, wind_kph: 4 }
      ]
    },
    London: {
      current: {
        temp_c: 12,
        humidity: 72,
        wind_kph: 18,
        condition: { text: 'Rainy' }
      },
      forecast: [
        { time: '00:00', temp_c: 11, wind_kph: 16 },
        { time: '01:00', temp_c: 10, wind_kph: 17 },
        { time: '02:00', temp_c: 9, wind_kph: 18 },
        { time: '03:00', temp_c: 9, wind_kph: 19 },
        { time: '04:00', temp_c: 8, wind_kph: 20 },
        { time: '05:00', temp_c: 8, wind_kph: 19 },
        { time: '06:00', temp_c: 9, wind_kph: 18 },
        { time: '07:00', temp_c: 10, wind_kph: 17 },
        { time: '08:00', temp_c: 11, wind_kph: 16 },
        { time: '09:00', temp_c: 12, wind_kph: 15 },
        { time: '10:00', temp_c: 13, wind_kph: 16 },
        { time: '11:00', temp_c: 14, wind_kph: 17 },
        { time: '12:00', temp_c: 15, wind_kph: 18 },
        { time: '13:00', temp_c: 15, wind_kph: 19 },
        { time: '14:00', temp_c: 15, wind_kph: 18 },
        { time: '15:00', temp_c: 14, wind_kph: 17 },
        { time: '16:00', temp_c: 13, wind_kph: 16 },
        { time: '17:00', temp_c: 12, wind_kph: 15 },
        { time: '18:00', temp_c: 11, wind_kph: 16 },
        { time: '19:00', temp_c: 10, wind_kph: 17 },
        { time: '20:00', temp_c: 9, wind_kph: 18 },
        { time: '21:00', temp_c: 8, wind_kph: 19 },
        { time: '22:00', temp_c: 8, wind_kph: 20 },
        { time: '23:00', temp_c: 8, wind_kph: 19 }
      ]
    }
  };
  
  res.json(mockData[city] || mockData.Paris);
});

app.listen(5000, '0.0.0.0', () => {
  console.log('✅Backend running on port 5000');
});