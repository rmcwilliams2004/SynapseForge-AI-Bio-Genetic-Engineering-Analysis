import React from 'react';

interface HeaderProps {
    onStartTour: () => void;
    onOpenUserManual: () => void;
    onOpenTechDoc: () => void;
}

export const Header = ({ onStartTour, onOpenUserManual, onOpenTechDoc }: HeaderProps) => (
  <header className="py-4 px-6 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-20 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <svg className="w-8 h-8 text-brand-teal" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4c0 5.523 3.582 10 8 10s8-4.477 8-10" />
        <path d="M20 20c0-5.523-3.582-10-8-10S4 14.477 4 20" />
        <line x1="8" y1="2" x2="8" y2="22" />
        <line x1="16" y1="2" x2="16" y2="22" />
      </svg>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-wider">
          Synapse<span className="text-brand-teal">Forge</span> AI
        </h1>
        <p className="text-xs text-slate-500 -mt-1">Bio-Genetic Engineering & Analysis</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
       <button
        onClick={onOpenUserManual}
        className="py-2 px-4 bg-white text-slate-700 font-semibold rounded-lg border border-slate-300 hover:bg-slate-100 transition text-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
          User Manual
      </button>
       <button
        onClick={onOpenTechDoc}
        className="py-2 px-4 bg-white text-slate-700 font-semibold rounded-lg border border-slate-300 hover:bg-slate-100 transition text-sm flex items-center gap-2"
        >
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
        </svg>

          Technical Doc
      </button>
      <button
        onClick={onStartTour}
        className="py-2 px-4 bg-white text-slate-700 font-semibold rounded-lg border border-slate-300 hover:bg-slate-100 transition text-sm flex items-center gap-2"
      >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
        Tour
      </button>
    </div>

  </header>
);