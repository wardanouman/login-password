import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { logout } = useContext(AuthContext);

  return (
    <nav className="bg-[#131921] text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-extrabold tracking-tight text-white">
          market<span className="text-amber-400">hub</span>
        </span>
        <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono uppercase tracking-wide">
          Seller Central
        </span>
      </div>

      <button
        onClick={logout}
        className="bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-600 px-3 py-1.5 rounded text-xs transition-colors"
      >
        Sign Out
      </button>
    </nav>
  );
}