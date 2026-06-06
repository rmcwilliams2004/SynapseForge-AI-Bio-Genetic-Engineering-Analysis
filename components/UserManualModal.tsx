import React from 'react';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Fix: Made children prop optional to resolve TypeScript errors which may be due to a misconfigured linter.
const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div className="mb-6">
        <h3 className="text-xl font-bold text-brand-teal mb-3 pb-2 border-b-2 border-teal-200/80">{title}</h3>
        <div className="space-y-3 text-slate-600 leading-relaxed">{children}</div>
    </div>
);

export const UserManualModal = ({ isOpen, onClose }: ManualModalProps) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in" style={{ animationDuration: '0.3s' }} onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col border border-slate-300" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-slate-200 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-slate-800">User Manual</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition text-3xl font-bold">&times;</button>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    <Section title="1. Introduction">
                        <p>SynapseForge AI is a powerful platform designed for bio-medical and genetic engineering analysis and innovation. It leverages Google's advanced AI models to deconstruct a biological concept from a simple description and optional files (e.g., research papers, microscopy images) into a comprehensive suite of technical documentation, analysis, and creative therapeutic proposals.</p>
                    </Section>
                    <Section title="2. Getting Started: The Analysis Workflow">
                        <div>
                            <h4 className="font-semibold text-slate-700 mb-1">Step 1: Select a Research Mandate</h4>
                            <p>The "Research Mandate" you choose is the most crucial first step. It attunes the AI to a specific scientific mindset, fundamentally altering its analysis and suggestions.
                                <ul className="list-disc pl-6 mt-2">
                                    <li><strong>Cellular & Molecular Pathway Analysis:</strong> Focuses on deconstructing the complex interactions within cells, ideal for drug target identification and mechanistic studies.</li>
                                    <li><strong>Genomic & CRISPR-Based Therapies:</strong> Prioritizes genetic data, gene editing, and personalized medicine approaches.</li>
                                    <li><strong>Synthetic Biology & Biomaterials:</strong> Views biology as an engineering discipline, focusing on creating novel biological systems and biocompatible materials.</li>
                                </ul>
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-700 mb-1">Step 2: Define Your Project & Subject</h4>
                            <p>Give your analysis a clear <strong>Project Name</strong>. In the <strong>Subject</strong> text area, describe the biological system, molecule, or gene you want to analyze. The more detail you provide (e.g., specific mutations, cellular context), the more insightful the AI's report will be.</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-slate-700 mb-1">Step 3: Upload Files (Optional)</h4>
                            <p>For a much deeper analysis, upload relevant files like research papers (PDFs) or images (microscopy, diagrams). The AI will integrate the information from these files into its analysis.</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-slate-700 mb-1">Step 4: Engage the AI</h4>
                            <p>Once your inputs are ready, click the <strong>"Engage SynapseForge AI"</strong> button. The platform will send your query to the AI, which will generate a complete research report. This may take a moment.</p>
                        </div>
                    </Section>
                    <Section title="3. Understanding the Analysis Report">
                        <p>The generated report is a rich, multi-section document tailored for biomedical research:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li><strong>Executive Summary:</strong> A high-level overview of the findings.</li>
                            <li><strong>AI Visualizations:</strong> You can generate a 3D molecular animation and a 2D scientific illustration (e.g., pathway diagram) for enhanced understanding.</li>
                            <li><strong>Mandate Rationale:</strong> A breakdown of Strengths and Weaknesses, explaining how the current understanding aligns (or presents challenges) with the chosen research mandate.</li>
                            <li><strong>Biomaterial Suggestions:</strong> Recommendations for materials for applications like tissue engineering, complete with properties like biocompatibility.</li>
                            <li><strong>AI-Suggested Interventions:</strong> Innovative proposals for therapeutic strategies or experimental approaches. You can click <strong>"Incorporate"</strong> to automatically add a suggestion to your prompt and re-run the analysis, iteratively refining your research plan.</li>
                            <li><strong>Full Documentation Suite:</strong> The report includes outlines for Research Protocols, Experimental Procedures, Biohazard/Ethical Assessments, Preliminary Budgets, and a Reagent List.</li>
                        </ul>
                    </Section>
                     <Section title="4. Project & Version Management">
                        <p>Your work is automatically saved. The Project Manager allows you to organize and revisit your analyses.</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li><strong>Projects:</strong> Each time you start a major new analysis, you can create a "New Project". You can search through all your projects by name or by keywords found within their analysis results.</li>
                            <li><strong>Versions:</strong> Every successful analysis, including iterative refinements, is saved as a new version within the active project. This creates a complete history of your research process.</li>
                            <li><strong>Viewing & Reverting:</strong> You can view any previous version or choose to "Revert", which copies an old version's data into a new version, allowing you to branch off from an earlier point in your research.</li>
                        </ul>
                    </Section>
                     <Section title="5. Advanced Tools">
                        <div>
                            <h4 className="font-semibold text-slate-700 mb-1">Virtual CRISPR Design Tool</h4>
                            <p>After generating an analysis, you can access the CRISPR tool from the report header. This powerful feature simulates the design of guide RNAs (gRNAs) for a CRISPR-Cas9 experiment. Simply input your target gene, organism, and desired action (e.g., Knockout). The AI will generate a prioritized list of gRNA candidates, complete with on-target efficiency scores and off-target predictions. You can export this data as a CSV or JSON for further use.</p>
                        </div>
                         <div className="mt-4">
                            <h4 className="font-semibold text-slate-700 mb-1">Renfield: Your AI Research Partner</h4>
                            <p>Click "Discuss with Renfield" in the report to launch a real-time, voice-based conversational AI. Renfield is primed with the full context of your current analysis. You can use it to brainstorm ideas, ask clarifying questions about the results, and explore creative possibilities in a natural, spoken dialogue.</p>
                        </div>
                    </Section>
                    <Section title="6. Exporting Your Work">
                        <p>When your analysis is complete, click the <strong>"Export Full Report"</strong> button. This generates a professional, multi-page PDF document containing the entire analysis, including the AI-generated illustration, perfect for grant proposals, lab meetings, or archiving.</p>
                    </Section>
                </main>
            </div>
        </div>
    );
};