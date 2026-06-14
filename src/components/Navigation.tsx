import { NavLink } from 'react-router-dom';
import { Map, Book, Backpack } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="h-16 bg-slate-800 border-t border-slate-700 flex justify-around items-center px-4 pb-safe shadow-lg z-50 relative">
      <NavLink 
        to="/map" 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            isActive ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'
          }`
        }
      >
        <Map size={24} />
        <span className="text-xs font-semibold tracking-wider">Map</span>
      </NavLink>

      <NavLink 
        to="/inventory" 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            isActive ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'
          }`
        }
      >
        <Backpack size={24} />
        <span className="text-xs font-semibold tracking-wider">Items</span>
      </NavLink>

      <NavLink 
        to="/pokedex" 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            isActive ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'
          }`
        }
      >
        <Book size={24} />
        <span className="text-xs font-semibold tracking-wider">Pokedex</span>
      </NavLink>
    </nav>
  );
};

export default Navigation;
