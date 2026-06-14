import React from 'react';
import { motion } from 'framer-motion';

interface InventoryScreenProps {
  onClose: () => void;
}

const InventoryScreen: React.FC<InventoryScreenProps> = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute inset-0 z-[700] bg-white flex flex-col font-sans"
    >
      <div className="bg-[#10b981] h-20 flex flex-col justify-end items-center pb-2 relative shadow-md z-10">
         <h1 className="text-white font-black tracking-widest text-xl drop-shadow-md">ITEMS</h1>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-400 font-bold">Inventory is empty.</p>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-14 h-14 rounded-full bg-white border-[3px] border-[#10b981] shadow-[0_4px_15px_rgba(0,0,0,0.2)] flex items-center justify-center text-[#10b981]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default InventoryScreen;
