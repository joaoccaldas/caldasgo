import MapScreen from './pages/MapScreen';

function App() {
  return (
    <div className="h-full w-full flex flex-col bg-slate-900 text-white font-sans overflow-hidden">
      <MapScreen onCaught={() => {}} />
    </div>
  );
}

export default App;
