import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Overview from './pages/overview';
import Home from './pages/home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/overview" element={<Overview />} />
      </Routes>
    </Router>
  );
}