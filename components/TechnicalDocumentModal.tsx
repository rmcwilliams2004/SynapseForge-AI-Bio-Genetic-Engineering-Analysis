import React from 'react';

interface TechDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Fix: Made children prop optional to resolve TypeScript errors which may be due to a misconfigured linter.
const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div className="mb-6">
        <h3 className="text-xl font-bold text-brand-teal mb-3 pb-2 border-b-2 border-teal-200/80">{title}</h3>
        <div className="space-y-3 text-slate-600 leading-relaxed text-sm">{children}</div>
    </div>
);

// Fix: Made children prop optional to resolve TypeScript errors which may be due to a misconfigured linter.
const Code = ({ children }: { children?: React.ReactNode }) => (
    <code className="bg-slate-200 text-teal-700 p-1 rounded-md text-xs font-mono">{children}</code>
);

export const TechnicalDocumentModal = ({ isOpen, onClose }: TechDocModalProps) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in" style={{ animationDuration: '0.3s' }} onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col border border-slate-300" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-slate-200 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-slate-800">Platform Technical Document</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition text-3xl font-bold">&times;</button>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                     <Section title="1. Overview">
                        <p>SynapseForge AI is a single-page application (SPA) built with modern frontend technologies. It provides a user interface for interacting with a suite of Google Gemini AI models to perform complex bio-medical and genetic engineering analysis tasks. The application is designed to be fully client-side, with all state management and API interactions handled directly by the browser.</p>
                    </Section>
                    <Section title="2. Core Technologies">
                        <ul className="list-disc pl-6">
                            <li><strong>Frontend Framework:</strong> React 19 with TypeScript for robust, type-safe component development.</li>
                            <li><strong>AI SDK:</strong> <Code>@google/genai</Code> JavaScript SDK for all interactions with the Gemini API.</li>
                            <li><strong>Styling:</strong> Tailwind CSS for rapid, utility-first UI development.</li>
                            <li><strong>PDF Generation:</strong> jsPDF and jsPDF-AutoTable for client-side generation of PDF reports.</li>
                        </ul>
                    </Section>
                    <Section title="3. AI Model Integration">
                        <p>The platform orchestrates multiple Gemini models, each selected for its specific strengths in a biomedical context:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li><strong>Core Analysis (<Code>gemini-2.5-flash</Code>):</strong> This model is the workhorse of the application. It receives the user's prompt, research mandate, and any file data. A detailed system instruction and a rigid JSON response schema guide the model to produce the structured, multi-part biological analysis report.</li>
                            <li><strong>Virtual CRISPR Simulation (<Code>gemini-2.5-flash</Code>):</strong> The same model is used for the CRISPR tool, but with a completely different system prompt. It is instructed to act as a bioinformatics software, simulating the process of gRNA design and scoring, and returning a structured JSON array of gRNA candidates. This demonstrates the model's versatility.</li>
                            <li><strong>Scientific Illustration (<Code>imagen-4.0-generate-001</Code>):</strong> Used for generating scientific diagrams. A specialized prompt is constructed to request illustrations like protein ribbon diagrams or cellular pathway maps in a style suitable for publication.</li>
                            <li><strong>Molecular Animation (<Code>veo-2.0-generate-001</Code>):</strong> Generates 3D animations of biological processes. This is an asynchronous operation; the application polls the Gemini API until the video is ready for download. Prompts are designed to visualize events like drug-receptor binding.</li>
                            <li><strong>Conversational AI (<Code>gemini-2.5-flash-native-audio-preview-09-2025</Code>):</strong> Powers the real-time, low-latency Renfield voice assistant. It uses the Live API to stream microphone input and receive audio output and transcriptions, enabling a natural conversational brainstorming session about the research data.</li>
                        </ul>
                    </Section>
                    <Section title="4. Architecture & State Management">
                        <p>The application follows a component-based architecture with state managed via React Hooks.</p>
                         <ul className="list-disc pl-6 mt-2 space-y-2">
                           <li><strong>Custom Hooks:</strong> Logic is encapsulated in custom hooks to promote reusability and separation of concerns.
                                <ul>
                                   <li><Code>useProjects</Code>: Manages the lifecycle of projects and versions, including all interactions with <Code>localStorage</Code>.</li>
                                   <li><Code>useAnalysis</Code>: Handles the state for a single analysis run (loading, error, result).</li>
                                   <li><Code>useCrisprDesigner</Code>: Manages the state and API calls for the Virtual CRISPR Tool.</li>
                                   <li><Code>useVideoGenerator</Code> & <Code>useDrawingGenerator</Code>: Manage the state for their respective asynchronous generation tasks.</li>
                                   <li><Code>useRenfield</Code>: Encapsulates all logic for the complex Live API connection, audio processing, and state management for the voice conversation.</li>
                                   <li><Code>useAnalysisPersistence</Code>: Manages the temporary saving of an in-progress analysis to <Code>localStorage</Code> for session resumption.</li>
                                </ul>
                           </li>
                           <li><strong>Service Layer:</strong> API calls are abstracted into a service layer (<Code>geminiService.ts</Code>, <Code>pdfService.ts</Code>) to keep components clean and focused on the UI.</li>
                           <li><strong>Data Flow:</strong> User input from components like <Code>FactionSelector</Code> and <Code>PromptInput</Code> is collected in the main <Code>App.tsx</Code> component. On "Engage", the <Code>useAnalysis</Code> hook calls the <Code>geminiService</Code>, awaits the response, and updates the state. This new state then flows down to the <Code>AnalysisDisplay</Code> and <Code>ResultView</Code> components for rendering.</li>
                           <li><strong>Local Persistence:</strong> The app uses the browser's <Code>localStorage</Code> for all data persistence. Project data is stored under one key, while the session-resume data is stored under a separate key.</li>
                        </ul>
                    </Section>
                </main>
            </div>
        </div>
    );
};