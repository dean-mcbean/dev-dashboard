import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { MotionOverlay } from './components/organisms/MotionOverlay/MotionOverlay';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MotionOverlay />} />
      </Routes>
    </Router>
  );
}
