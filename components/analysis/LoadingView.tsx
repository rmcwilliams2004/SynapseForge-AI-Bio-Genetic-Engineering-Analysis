import React from 'react';

export const LoadingView = () => (
  <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-8 h-full flex items-center justify-center">
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <svg className="animate-spin h-10 w-10 text-brand-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-slate-700 font-semibold">Analyzing Biological Subject...</p>
      <p className="text-slate-500 text-sm">The SynapseForge AI is evaluating your concept through the lens of the selected research mandate. This may take a moment.</p>
    </div>
  </div>
);