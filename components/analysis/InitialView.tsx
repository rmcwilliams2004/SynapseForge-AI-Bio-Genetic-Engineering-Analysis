import React from 'react';

export const InitialView = () => (
  <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-8 h-full flex flex-col items-center justify-center text-center animate-fade-in">
    <svg className="w-16 h-16 text-brand-teal mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4c0 5.523 3.582 10 8 10s8-4.477 8-10" />
        <path d="M20 20c0-5.523-3.582-10-8-10S4 14.477 4 20" />
        <line x1="8" y1="2" x2="8" y2="22" />
        <line x1="16" y1="2" x2="16" y2="22" />
    </svg>
    <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to SynapseForge AI</h2>
    <p className="text-slate-500 max-w-2xl">
      Your advanced platform for bio-medical and genetic engineering analysis. Transform a concept, research paper, or genomic data into a comprehensive technical report.
    </p>
    <div className="mt-6 text-left bg-slate-100 p-4 rounded-lg border border-slate-200 max-w-lg">
        <h3 className="font-semibold text-slate-700 mb-2">How to Begin:</h3>
        <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1">
            <li>Select a <span className="font-semibold text-brand-teal">Research Mandate</span> to set the AI's perspective.</li>
            <li>Provide a <span className="font-semibold text-brand-teal">Project Name & Subject</span> description.</li>
            <li>(Optional) <span className="font-semibold text-brand-teal">Upload files</span> like research papers or diagrams for deeper insight.</li>
            <li>Click <span className="font-semibold text-brand-teal">"Engage SynapseForge AI"</span> to generate your report.</li>
        </ol>
    </div>
    <p className="text-xs text-slate-400 mt-4">For a detailed guide, open the "User Manual" from the header.</p>
  </div>
);