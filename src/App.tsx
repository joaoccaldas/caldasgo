import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import MapScreen from './pages/MapScreen';
import PokedexScreen from './pages/PokedexScreen';

function App() {
  return (
    <Router basename="/caldasgo">
      <div className="h-full w-full flex flex-col bg-slate-900 text-white font-sans">
        {/* Main Content Area */}
        <main className="flex-1 relative overflow-hidden">
          <Routes>
            <Route path="/map" element={<MapScreen />} />
            <Route path="/pokedex" element={<PokedexScreen />} />
            <Route path="*" element={<Navigate to="/map" replace />} />
          </Routes>
        </main>
        
        {/* Bottom Navigation Bar */}
        <Navigation />
      </div>
    </Router>
  );
}

export default App;
