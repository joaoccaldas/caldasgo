import { lazy, Suspense, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import SafetyScreen from './components/SafetyScreen';
import InstallPrompt from './components/InstallPrompt';

const MapScreen = lazy(() => import('./pages/MapScreen'));

type BootStage = 'splash' | 'safety' | 'playing';

function App() {
  const [stage, setStage] = useState<BootStage>('splash');

  return (
    <div className="h-full w-full flex flex-col bg-slate-900 text-white font-sans overflow-hidden relative">
      {stage === 'playing' && (
        <Suspense fallback={<div className="h-full w-full bg-slate-900" aria-label="Loading map" />}>
          <MapScreen />
        </Suspense>
      )}
      <AnimatePresence>
        {stage === 'splash' && <SplashScreen key="splash" onEnter={() => setStage('safety')} />}
        {stage === 'safety' && <SafetyScreen key="safety" onAccept={() => setStage('playing')} />}
      </AnimatePresence>
      {stage === 'playing' && <InstallPrompt />}
    </div>
  );
}

export default App;
