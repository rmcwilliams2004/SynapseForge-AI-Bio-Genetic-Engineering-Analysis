import React from 'react';
import { AnalysisResult, ResearchMandate, Project } from '../types';
import { InitialView } from './analysis/InitialView';
import { LoadingView } from './analysis/LoadingView';
import { ErrorView } from './analysis/ErrorView';
import { ResultView } from './analysis/ResultView';

interface AnalysisDisplayProps {
  projectName: string;
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  selectedFaction: ResearchMandate | null;
  onClear: () => void;
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

export const AnalysisDisplay = (props: AnalysisDisplayProps) => {
  if (props.isLoading) {
    return <LoadingView />;
  }

  if (props.error) {
    return <ErrorView error={props.error} onClear={props.onClear} />;
  }

  if (props.result) {
    return (
      <ResultView
        projectName={props.projectName}
        result={props.result}
        selectedFaction={props.selectedFaction}
        onClear={props.onClear}
        onGenerateVideo={props.onGenerateVideo}
        // FIX: Pass the 'isLoading' prop to the ResultView component to satisfy its prop requirements.
        isLoading={props.isLoading}
        isVideoLoading={props.isVideoLoading}
        videoUrl={props.videoUrl}
        videoError={props.videoError}
        onGenerateDrawing={props.onGenerateDrawing}
        isDrawingLoading={props.isDrawingLoading}
        drawingUrl={props.drawingUrl}
        drawingError={props.drawingError}
        onIncorporateSuggestion={props.onIncorporateSuggestion}
        onLaunchRenfield={props.onLaunchRenfield}
        onLaunchCrisprTool={props.onLaunchCrisprTool}
        activeProject={props.activeProject}
      />
    );
  }

  return <InitialView />;
};