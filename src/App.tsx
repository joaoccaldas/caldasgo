import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import MapScreen from './pages/MapScreen';
import SplashScreen from './components/SplashScreen';

function App() {
  const [entered, setEntered] = useState(false);

  return (
    <div className="h-full w-full flex flex-col bg-slate-900 text-white font-sans overflow-hidden relative">
      <MapScreen />
      <AnimatePresence>
        {!entered && <SplashScreen onEnter={() => setEntered(true)} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
