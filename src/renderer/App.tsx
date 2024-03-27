import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Overlay } from './components/organisms/Overlay/Overlay';
import { OutputProvider } from './contexts/OutputContext';
import { StorageProvider } from './contexts/StorageContext';
import { AppStateProvider } from './contexts/AppStateContext';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <StorageProvider>
            <AppStateProvider>
              <OutputProvider>
                <Overlay />
              </OutputProvider>
            </AppStateProvider>
          </StorageProvider>
        } />
      </Routes>
    </Router>
  );
}
