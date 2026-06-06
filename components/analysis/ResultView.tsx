import React, { useState } from 'react';
import { AnalysisResult, ResearchMandate, BiomaterialSuggestion, SynthesisProcess, TherapyComparison, BioRisk, ReagentListItem, ExperimentalProcedureStep, InterventionSuggestion, Project } from '../../types';
import { exportFullReportPDF } from '../../services/pdfService';
import { Modal } from '../Modal';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  defaultOpen?: boolean;
}
const Section: React.FC<SectionProps> = ({ title, children, actions, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '150ms' }}>
            <div className="flex justify-between items-center mb-3 pb-2 border-b-2 border-teal-200/80">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-brand-teal">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                    <h3 className="text-xl font-bold text-brand-teal">{title}</h3>
                </div>
                {actions && <div className="flex gap-2">{actions}</div>}
            </div>
            {isOpen && <div className="pl-8">{children}</div>}
        </div>
    );
}

interface ResultViewProps {
  projectName: string;
  result: AnalysisResult;
  selectedFaction: ResearchMandate | null;
  onClear: () => void;
  isLoading: boolean;
  onGenerateVideo: () => void;
  isVideoLoading: boolean;
  videoUrl: string | null;
  videoError: string | null;
  onGenerateDrawing: () => void;
  isDrawingLoading: boolean;
  drawingUrl: string | null;
  drawingError: string | null;
  onIncorporateSuggestion: (suggestionText: string) => void;
  onLaunchRenfield: () => void;
  onLaunchCrisprTool: () => void;
  activeProject: Project | null;
}

export const ResultView = ({
  projectName,
  result,
  selectedFaction,
  onClear,
  isLoading,
  onGenerateVideo,
  isVideoLoading,
  videoUrl,
  videoError,
  onGenerateDrawing,
  isDrawingLoading,
  drawingUrl,
  drawingError,
  onIncorporateSuggestion,
  onLaunchRenfield,
  onLaunchCrisprTool,
  activeProject
}: ResultViewProps) => {
  const Icon = selectedFaction?.icon;
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  const handleExportFullReport = () => {
    if (activeProject) {
      exportFullReportPDF(activeProject, drawingUrl);
    }
  };

  const handleExportReagents = () => {
    const reagents = result.molecularVisualizationSpec.reagent_list;
    const jsonString = JSON.stringify(reagents, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}_Reagent_List.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="tour-step-5" className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 animate-fade-in shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-1">{result.subject_name}</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            {Icon && <Icon className="w-5 h-5 text-brand-teal" />}
            <span>Analysis via: <span className="font-semibold text-brand-teal">{selectedFaction?.name}</span></span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
             <button onClick={onLaunchCrisprTool} className="py-2 px-4 bg-brand-teal text-white font-semibold rounded-lg hover:bg-teal-600 transition text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>
                Virtual CRISPR Tool
            </button>
            <button onClick={handleExportFullReport} className="py-2 px-4 bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-200 hover:bg-slate-200 transition text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                Export Full Report
            </button>
            <button onClick={onClear} className="py-2 px-4 bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-200 hover:bg-slate-200 transition text-sm">New Analysis</button>
        </div>
      </div>

      {/* Main Content */}
      <Section title="Executive Summary"><p className="text-slate-600 leading-relaxed">{result.executive_summary}</p></Section>
      
      <Section title="Molecular/Process Animation" defaultOpen={false}>
          {/* Video Generation UI */}
           <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg border border-slate-200 text-center">
             {!videoUrl && !isVideoLoading && !videoError && (
                 <>
                    <p className="text-slate-500 mb-4">Generate a 3D animation to visualize the molecular interactions or biological process.</p>
                    <button onClick={() => setShowVideoModal(true)} className="py-2 px-5 bg-brand-teal text-white font-bold rounded-lg hover:bg-teal-600 transition">Generate Animation</button>
                 </>
             )}
             {isVideoLoading && <p>Loading...</p>}
             {videoError && <p className="text-red-500">{videoError}</p>}
             {videoUrl && <video src={videoUrl} controls autoPlay muted loop className="w-full rounded-lg" />}
           </div>
      </Section>
      
      <Section title="Generated Scientific Illustration" defaultOpen={true}>
         <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg border border-slate-200 text-center">
           {!drawingUrl && !isDrawingLoading && !drawingError && (
               <>
                  <p className="text-slate-500 mb-4">Generate a scientific illustration of the subject using AI, such as a protein ribbon diagram or pathway map.</p>
                  <button onClick={onGenerateDrawing} className="py-2 px-5 bg-brand-teal text-white font-bold rounded-lg hover:bg-teal-600 transition">Generate Illustration</button>
               </>
           )}
           {isDrawingLoading && (
            <div className="flex items-center gap-3 text-slate-600">
                <svg className="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>Generating Illustration...</span>
            </div>
           )}
           {drawingError && <p className="text-red-500">{drawingError}</p>}
           {drawingUrl && <img src={drawingUrl} alt="Generated scientific illustration" className="w-full rounded-lg bg-white p-2 border border-slate-200" />}
         </div>
      </Section>

      <Section title="Mandate Rationale">
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Strengths</h4>
                <ul className="list-disc pl-5 space-y-1 text-green-700">
                    {result.mandate_rationale.strengths.map((pro, i) => <li key={i}>{pro}</li>)}
                </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                 <h4 className="text-lg font-semibold text-red-800 mb-2">Weaknesses</h4>
                <ul className="list-disc pl-5 space-y-1 text-red-700">
                    {result.mandate_rationale.weaknesses.map((con, i) => <li key={i}>{con}</li>)}
                </ul>
            </div>
        </div>
        <p className="mt-4 text-slate-500"><strong className="text-slate-700">Summary:</strong> {result.mandate_rationale.summary}</p>
      </Section>

      <Section title="Biomaterial Suggestions">
          {result.biomaterial_suggestions.map((mat, i) => (
            <div key={i} className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-800">{mat.name}</h4>
                <p className="text-sm text-slate-500 mb-3">{mat.rationale}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-700">
                    <div className="bg-slate-100 p-2 rounded"><strong>Biocompatibility:</strong> {mat.properties.biocompatibility}</div>
                    <div className="bg-slate-100 p-2 rounded"><strong>Degradation Rate:</strong> {mat.properties.degradation_rate}</div>
                    <div className="bg-slate-100 p-2 rounded"><strong>Bioactivity:</strong> {mat.properties.bioactivity}</div>
                    <div className="bg-slate-100 p-2 rounded"><strong>Mechanical:</strong> {mat.properties.mechanical_properties}</div>
                </div>
            </div>
          ))}
      </Section>
      
      <Section title="AI-Suggested Interventions">
          <div className="flex justify-end mb-4">
              <button
                onClick={onLaunchRenfield}
                disabled={isLoading}
                className="py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg border border-purple-500 hover:bg-purple-500 transition text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 0v-1.5a6 6 0 0 0-6-6v1.5m-6 0v-1.5a6 6 0 0 1 6-6v1.5m0 0v1.5m0-1.5a6 6 0 0 0-6 6v1.5m6-7.5a6 6 0 0 1 6 6v1.5" /></svg>
                Discuss with Renfield
              </button>
          </div>
          {result.suggested_interventions.map((sys, i) => (
             <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                        <h4 className="text-lg font-semibold text-slate-800">{sys.name}</h4>
                        <p className="text-sm text-slate-600 mt-2">{sys.description}</p>
                        <p className="text-sm mt-3"><strong className="text-purple-600">Rationale:</strong> {sys.rationale}</p>
                    </div>
                    <button onClick={() => onIncorporateSuggestion(`${sys.name}: ${sys.description}`)} disabled={isLoading} className="py-1 px-3 text-xs bg-slate-200 text-slate-700 font-semibold rounded-md hover:bg-slate-300 transition flex-shrink-0 disabled:opacity-50">Incorporate</button>
                </div>
             </div>
          ))}
      </Section>
      
      {/* All other documentation sections can follow this pattern */}
      
      <Modal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)} onConfirm={() => { onGenerateVideo(); setShowVideoModal(false); }} title="Confirm Animation Generation" confirmText="Generate">
        <p>Animation generation is a computationally intensive process and may take several minutes.</p>
        <p className="mt-2 text-sm text-gray-400">In a production environment, this could be a premium feature that consumes significant resources.</p>
      </Modal>
    </div>
  );
};