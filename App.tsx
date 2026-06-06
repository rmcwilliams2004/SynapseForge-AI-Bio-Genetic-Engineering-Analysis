import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ResearchMandate, ProjectVersion, Project, AnalysisResult } from './types';
import { RESEARCH_MANDATES, TOUR_STEPS } from './constants';
import { useAnalysis } from './hooks/useAnalysis';
import { useVideoGenerator } from './hooks/useVideoGenerator';
import { Header } from './components/Header';
import { FactionSelector } from './components/FactionSelector';
import { PromptInput } from './components/PromptInput';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { Tour } from './components/Tour';
import { ProjectManager } from './components/ProjectManager';
import { useProjects } from './hooks/useProjects';
import { RenfieldModal } from './components/DeVinciModal';
import { useDrawingGenerator } from './hooks/useDrawingGenerator';
import { useAnalysisPersistence, InProgressState } from './hooks/useAnalysisPersistence';
import { useProjectNamePersistence } from './hooks/useProjectNamePersistence';
import { UserManualModal } from './components/UserManualModal';
import { TechnicalDocumentModal } from './components/TechnicalDocumentModal';
import { CrisprToolModal } from './components/CrisprToolModal';

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

function App() {
  const { 
    projects, 
    activeProject, 
    onNewProject, 
    onDeleteProject, 
    onSelectProject,
    saveNewVersion,
    revertToVersion,
  } = useProjects();
  
  // State for the "editor" or current working area
  const { saveProjectName, loadProjectName, clearProjectName } = useProjectNamePersistence();
  const [projectName, setProjectName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFaction, setSelectedFaction] = useState<ResearchMandate | null>(null);
  const [activeVersionIndex, setActiveVersionIndex] = useState(0);
  const isInitialRender = useRef(true);

  const { result, isLoading, error, generateAnalysis, clearAnalysis, setResult } = useAnalysis();
  // FIX: `useAnalysisPersistence` is a stateless hook providing utility functions.
  // The state for saved session data must be managed within the component.
  const { saveInProgressAnalysis, loadInProgressAnalysis, clearInProgressAnalysis } = useAnalysisPersistence();
  const [savedSessionData, setSavedSessionData] = useState<InProgressState | null>(null);
  
  const activeVersion: ProjectVersion | null = useMemo(() => {
    if (!activeProject) return null;
    return activeProject.history[activeVersionIndex] || activeProject.history[0];
  }, [activeProject, activeVersionIndex]);
  
  const displayedResult = result || activeVersion?.result || null;

  const { videoUrl, isVideoLoading, videoError, generateVideo, clearVideo } = useVideoGenerator(displayedResult?.subject_name || null);
  const { drawingUrl, isDrawingLoading, drawingError, generateDrawing, clearDrawing } = useDrawingGenerator(displayedResult?.subject_name || null);
  
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [isRenfieldOpen, setIsRenfieldOpen] = useState(false);
  const [isUserManualOpen, setIsUserManualOpen] = useState(false);
  const [isTechDocOpen, setIsTechDocOpen] = useState(false);
  const [isCrisprToolOpen, setIsCrisprToolOpen] = useState(false);
  
  // Load saved session on initial mount
  useEffect(() => {
    setSavedSessionData(loadInProgressAnalysis());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProjectNameChange = useCallback((name: string) => {
    setProjectName(name);
    saveProjectName(name);
  }, [saveProjectName]);

  // Effect to load data from the active version into the editor state
  useEffect(() => {
    let nameToSet: string;

    if (isInitialRender.current) {
      nameToSet = loadProjectName() || activeVersion?.name || 'New Project';
      isInitialRender.current = false;
    } else {
      nameToSet = activeVersion?.name || 'New Project';
    }
    
    handleProjectNameChange(nameToSet);

    if (activeVersion) {
      setPrompt(activeVersion.prompt);
      const faction = RESEARCH_MANDATES.find(f => f.id === activeVersion.factionId) || null;
      setSelectedFaction(faction);
      
      setFiles([]); // Clear staged files when loading a version
      clearAnalysis();
      clearVideo();
      clearDrawing();

    } else {
        // Reset editor if no project is active
        setPrompt('');
        setSelectedFaction(RESEARCH_MANDATES[0]);
        setFiles([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVersion]);

  const saveAnalysisResult = (analysisResult: AnalysisResult, newPrompt: string, newFileUrls: string[]) => {
      const combinedUrls = [...(activeVersion?.fileUrls || []), ...newFileUrls].filter((v, i, a) => a.indexOf(v) === i);
      saveNewVersion({
        prompt: newPrompt,
        factionId: selectedFaction!.id,
        result: analysisResult,
        fileUrls: combinedUrls,
        name: projectName || analysisResult.subject_name || "Untitled Project",
      });
      // After saving, the latest version is at index 0
      setActiveVersionIndex(0);
      setFiles([]); // Clear newly staged files
      clearProjectName();
  };

  const handleStartAnalysis = async () => {
    if (!prompt || !selectedFaction) {
      return;
    }

    const newFileUrls = await Promise.all(files.map(fileToDataUrl));
    
    const analysisResult = await generateAnalysis(prompt, selectedFaction, { 
      files, 
      fileUrls: activeVersion?.fileUrls 
    });
    
    if (analysisResult) {
      saveInProgressAnalysis({
        projectName,
        prompt,
        factionId: selectedFaction.id,
        result: analysisResult,
      });
      saveAnalysisResult(analysisResult, prompt, newFileUrls);
    }
  };
  
  const handleIncorporateSuggestion = async (suggestionText: string) => {
    if (!selectedFaction || !activeVersion) return;

    const newPrompt = `${activeVersion.prompt}\n\n---\n[User Action] Incorporate the following AI suggestion into the design:\n${suggestionText}`;
    setPrompt(newPrompt); // Update UI for user to see
    
    // Perform the analysis using the new prompt and existing files
    const analysisResult = await generateAnalysis(newPrompt, selectedFaction, { 
      files: [], // No new files are being added in this flow
      fileUrls: activeVersion.fileUrls
    });
    
    if (analysisResult) {
      saveInProgressAnalysis({
        projectName,
        prompt: newPrompt,
        factionId: selectedFaction.id,
        result: analysisResult,
      });
      // Save the result as a new version
      saveAnalysisResult(analysisResult, newPrompt, []);
    }
  };

  const handleClear = () => {
    clearAnalysis();
    clearVideo();
    clearDrawing();
    clearInProgressAnalysis();
  };

  const handleLoadVersion = (index: number) => {
    clearInProgressAnalysis();
    setActiveVersionIndex(index);
  };
  
  const handleRevertVersion = (index: number) => {
    clearInProgressAnalysis();
    revertToVersion(index);
    setActiveVersionIndex(0);
  };

  const handleSelectProject = (project: Project) => {
    clearInProgressAnalysis();
    onSelectProject(project);
    setActiveVersionIndex(0); 
  };
  
  const handleNewProject = () => {
    clearInProgressAnalysis();
    onNewProject();
    setActiveVersionIndex(0);
  };

  const handleResumeSession = useCallback(() => {
    if (savedSessionData) {
        handleProjectNameChange(savedSessionData.projectName);
        setPrompt(savedSessionData.prompt);
        setSelectedFaction(RESEARCH_MANDATES.find(f => f.id === savedSessionData.factionId) || null);
        setResult(savedSessionData.result);
        setSavedSessionData(null); // Hide banner
    }
  }, [savedSessionData, handleProjectNameChange, setResult]);

  const handleDismissResume = useCallback(() => {
    clearInProgressAnalysis();
    setSavedSessionData(null); // Hide banner
  }, [clearInProgressAnalysis]);


  const isBusy = isLoading || isVideoLoading || isDrawingLoading;

  return (
    <div className="min-h-screen font-sans">
      <Header
        onStartTour={() => { setIsTourOpen(true); setTourStep(0); }}
        onOpenUserManual={() => setIsUserManualOpen(true)}
        onOpenTechDoc={() => setIsTechDocOpen(true)}
      />
      <main className="container mx-auto p-4 md:p-6">
        {savedSessionData && (
          <div className="bg-teal-100 border border-brand-teal p-4 rounded-lg mb-6 flex justify-between items-center animate-fade-in">
            <div>
              <h3 className="font-bold text-teal-900">Resume Session</h3>
              <p className="text-sm text-teal-800">You have an unsaved analysis for "<strong>{savedSessionData.projectName}</strong>". Would you like to continue?</p>
            </div>
            <div className="flex gap-4">
              <button onClick={handleResumeSession} className="py-2 px-4 bg-brand-teal text-white font-bold rounded-lg hover:bg-teal-600 transition">Resume</button>
              <button onClick={handleDismissResume} className="py-2 px-4 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition">Dismiss</button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ProjectManager 
              projects={projects}
              activeProject={activeProject}
              activeVersionIndex={activeVersionIndex}
              onSelectProject={handleSelectProject}
              onNewProject={handleNewProject}
              onDeleteProject={onDeleteProject}
              onLoadVersion={handleLoadVersion}
              onRevertVersion={handleRevertVersion}
              disabled={isBusy}
            />
            <FactionSelector
              selectedFaction={selectedFaction}
              onSelectFaction={setSelectedFaction}
              disabled={isBusy}
            />
            <PromptInput
              projectName={projectName}
              onProjectNameChange={handleProjectNameChange}
              prompt={prompt}
              onPromptChange={setPrompt}
              files={files}
              onFilesChange={setFiles}
              onEngage={handleStartAnalysis}
              isLoading={isLoading}
              onClearFiles={() => setFiles([])}
              isReady={!!(prompt && selectedFaction && projectName)}
            />
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Analysis Report</h2>
            <AnalysisDisplay
              projectName={activeVersion?.name || "New Analysis"}
              result={displayedResult}
              isLoading={isLoading}
              error={error}
              selectedFaction={selectedFaction}
              onClear={handleClear}
              onGenerateVideo={generateVideo}
              isVideoLoading={isVideoLoading}
              videoUrl={videoUrl}
              videoError={videoError}
              onGenerateDrawing={generateDrawing}
              isDrawingLoading={isDrawingLoading}
              drawingUrl={drawingUrl}
              drawingError={drawingError}
              onIncorporateSuggestion={handleIncorporateSuggestion}
              onLaunchRenfield={() => setIsRenfieldOpen(true)}
              onLaunchCrisprTool={() => setIsCrisprToolOpen(true)}
              activeProject={activeProject}
            />
          </div>
        </div>
      </main>
      <Tour
        isOpen={isTourOpen}
        steps={TOUR_STEPS}
        stepIndex={tourStep}
        onClose={() => setIsTourOpen(false)}
        onNext={() => setTourStep(s => Math.min(s + 1, TOUR_STEPS.length - 1))}
        onPrev={() => setTourStep(s => Math.max(s - 1, 0))}
      />
      <RenfieldModal 
        isOpen={isRenfieldOpen}
        onClose={() => setIsRenfieldOpen(false)}
        projectVersion={activeVersion}
        faction={selectedFaction}
      />
      <UserManualModal
        isOpen={isUserManualOpen}
        onClose={() => setIsUserManualOpen(false)}
      />
      <TechnicalDocumentModal
        isOpen={isTechDocOpen}
        onClose={() => setIsTechDocOpen(false)}
      />
      <CrisprToolModal
        isOpen={isCrisprToolOpen}
        onClose={() => setIsCrisprToolOpen(false)}
        initialGene={displayedResult?.subject_name || ''}
      />
    </div>
  );
}

export default App;