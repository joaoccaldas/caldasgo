import { useInventory } from '../hooks/useInventory';

const InventoryScreen = () => {
  const { inventory } = useInventory();

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white overflow-y-auto no-scrollbar pb-20">
      <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md p-4 z-10 border-b border-slate-800">
        <h1 className="text-3xl font-black text-center text-yellow-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider" style={{ WebkitTextStroke: '1px #3b82f6' }}>
          Items
        </h1>
      </div>

      <div className="p-4 flex-1">
        <div className="flex flex-col space-y-4 mt-4">
          
          {/* Pokeballs */}
          <div className="bg-slate-800 rounded-2xl p-4 flex items-center border border-slate-700 shadow-lg">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center p-2 border-2 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-red-500 to-white flex items-center justify-center overflow-hidden border-2 border-slate-900 relative">
                  <div className="absolute w-full h-1 bg-slate-900"></div>
                  <div className="absolute w-4 h-4 bg-white rounded-full border-2 border-slate-900"></div>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-bold text-xl text-white">Poké Ball</h3>
              <p className="text-slate-400 text-sm">A device for catching wild Pokémon.</p>
            </div>
            <div className="text-2xl font-black text-yellow-400">
              x{inventory.pokeballs}
            </div>
          </div>

          {/* Razz Berries */}
          <div className="bg-slate-800 rounded-2xl p-4 flex items-center border border-slate-700 shadow-lg">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center p-2 border-2 border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 drop-shadow-md">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-bold text-xl text-white">Razz Berry</h3>
              <p className="text-slate-400 text-sm">Makes Pokémon easier to catch.</p>
            </div>
            <div className="text-2xl font-black text-yellow-400">
              x{inventory.razzBerries}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InventoryScreen;
