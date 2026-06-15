import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import MapScreen from './pages/MapScreen';
import SplashScreen from './components/SplashScreen';
import SafetyScreen from './components/SafetyScreen';

type BootStage = 'splash' | 'safety' | 'playing';

function App() {
  const [stage, setStage] = useState<BootStage>('splash');

  return (
    <div className="h-full w-full flex flex-col bg-slate-900 text-white font-sans overflow-hidden relative">
      <MapScreen />
      <AnimatePresence>
        {stage === 'splash' && <SplashScreen key="splash" onEnter={() => setStage('safety')} />}
        {stage === 'safety' && <SafetyScreen key="safety" onAccept={() => setStage('playing')} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
