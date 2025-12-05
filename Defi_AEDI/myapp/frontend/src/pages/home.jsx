import { useNavigate } from "react-router-dom";

export default function HomeButton() 
{
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '80vh',
        padding: '3rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>
        Welcome to this weather app
      </h1>

      <p
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6',
          fontSize: '1.1rem',
        }}
      >
        Welcome to my weather app a lightweight and user-friendly dashboard that lets you explore real-time weather conditions across the globe. Easily check temperature, humidity, wind speed, and more through an intuitive interface. Click the button below to access the overview page and start by selecting a city to view live weather data and insightful charts.
      </p>

      <button
        onClick={() => navigate('/overview')}
        style={{
          padding: '1rem 2rem',
          fontSize: '1rem',
          backgroundColor: '#61dafb',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Go to overview
      </button>
    </div>
  );
}
