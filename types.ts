import React from 'react';

export enum MandateId {
  CELLULAR_MOLECULAR = 'cellular_molecular',
  GENOMIC_THERAPIES = 'genomic_therapies',
  SYNTHETIC_BIOLOGY = 'synthetic_biology',
}

export interface ResearchMandate {
  id: MandateId;
  name: string;
  focus: string;
  philosophy: string;
  bias: {
    analysis: string;
    methodology: string;
    innovativeProposal: string;
  };
  icon: React.FC<{ className?: string }>;
}

// --- CORE ANALYSIS DATA STRUCTURES ---

export interface MandateRationale {
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

export interface BiomaterialProperties {
    biocompatibility: string;
    degradation_rate: string;
    bioactivity: string;
    mechanical_properties: string;
}

export interface BiomaterialSuggestion {
  name: string;
  rationale: string;
  properties: BiomaterialProperties;
}

export interface SynthesisProcess {
  name: string;
  description: string;
}

export interface TherapyComparison {
    alternative_therapy: string;
    advantages: string;
    disadvantages: string;
}

export interface InterventionSuggestion {
  name: string;
  description: string;
  rationale: string;
}

// --- GENERATED DOCUMENTATION STRUCTURES ---
export interface ResearchProtocolOutline {
    introduction: string;
    key_objectives: string[];
    experimental_design: string[];
}

export interface ExperimentalProcedureStep {
    step: number;
    action: string;
    reagents_needed: string[];
}
export interface ExperimentalProcedure {
    overview: string;
    steps: ExperimentalProcedureStep[];
}

export interface BioRisk {
    risk: string;
    likelihood: 'Low' | 'Medium' | 'High';
    severity: 'Low' | 'Medium' | 'High';
    mitigation: string;
}
export interface BiohazardEthicalAssessment {
    overview: string;
    risks: BioRisk[];
}

export interface ReagentListItem {
    reagent_id: string;
    name: string;
    quantity: string;
    supplier: string;
    notes: string;
}

export interface MolecularVisualizationSpec {
    visualization_method: string;
    software_used: string[];
    key_interactions_to_highlight: string[];
    general_notes: string;
    reagent_list: ReagentListItem[];
}

export interface BudgetComponent {
    item: string;
    cost_estimate_range: string;
    rationale: string;
}

export interface PreliminaryResearchBudget {
    total_estimate_range: string;
    confidence: 'Low' | 'Medium' | 'High';
    assumptions: string[];
    breakdown: BudgetComponent[];
}

export interface AnalysisResult {
  subject_name: string;
  executive_summary: string;
  mandate_rationale: MandateRationale;
  biomaterial_suggestions: BiomaterialSuggestion[];
  synthesis_and_production: SynthesisProcess[];
  alternative_therapies_analysis: TherapyComparison[];
  suggested_interventions: InterventionSuggestion[];
  // Documentation
  researchProtocolOutline: ResearchProtocolOutline;
  experimentalProcedure: ExperimentalProcedure;
  biohazardEthicalAssessment: BiohazardEthicalAssessment;
  molecularVisualizationSpec: MolecularVisualizationSpec;
  preliminaryResearchBudget: PreliminaryResearchBudget;
}

// --- VIRTUAL CRISPR TOOL ---

export interface GuideRNA {
  sequence: string;
  on_target_score: number;
  off_target_sites: number;
  top_off_target_sequence: string;
  genomic_location: string;
}

export type CrisprDesignResult = GuideRNA[];


// --- PROJECT & VERSION CONTROL STRUCTURES ---

export interface ProjectVersion {
  versionId: string;
  createdAt: string; // ISO string
  name: string;
  prompt: string;
  factionId: MandateId;
  result: AnalysisResult | null;
  fileUrls: string[]; // data URLs
}

export interface Project {
  id: string; // Stable ID for the project
  history: ProjectVersion[]; // Newest version is at index 0
  createdAt: string; // Initial creation date
  updatedAt: string; // Date of the latest version
}

// --- RENFIELD CONVERSATIONAL AI ---
export type RenfieldState = 'idle' | 'connecting' | 'listening' | 'speaking' | 'thinking' | 'error';

export interface TranscriptEntry {
    source: 'user' | 'renfield';
    text: string;
    isFinal: boolean;
}

export type RenfieldVoice = 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir';