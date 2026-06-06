

import { ResearchMandate, MandateId } from './types';
import { CellularIcon } from './components/icons/AetheriumIcon';
import { GenomicIcon } from './components/icons/TerraFirmaIcon';
import { SyntheticBioIcon } from './components/icons/SyntheticaIcon';

export const RESEARCH_MANDATES: ResearchMandate[] = [
  {
    id: MandateId.CELLULAR_MOLECULAR,
    name: "Cellular & Molecular Pathway Analysis",
    focus: "Signal Transduction, Protein Interactions, Metabolic Pathways",
    philosophy: "Focuses on deconstructing complex biological systems at the cellular and molecular level. Prioritizes understanding the intricate web of interactions that govern cell function, disease progression, and therapeutic response.",
    bias: {
      analysis: "Emphasizes protein-protein interactions, kinase cascades, gene expression regulation, and metabolic flux analysis. Seeks to identify key nodes and vulnerabilities within these pathways.",
      methodology: "Favors techniques like mass spectrometry, confocal microscopy, Western blotting, and computational modeling of cellular networks. The goal is a mechanistic understanding of cellular processes.",
      innovativeProposal: "Proposes novel drug targets, diagnostic biomarkers, or interventions that modulate specific cellular pathways to achieve a therapeutic effect.",
    },
    icon: CellularIcon,
  },
  {
    id: MandateId.GENOMIC_THERAPIES,
    name: "Genomic & CRISPR-Based Therapies",
    focus: "Gene Editing, Variant Analysis, Personalized Medicine, Diagnostics",
    philosophy: "Grounded in the central dogma of molecular biology. Prioritizes the analysis of genetic information to diagnose, treat, and prevent disease. Emphasizes precision, based on an individual's or a disease's unique genetic makeup.",
    bias: {
      analysis: "Focuses on next-generation sequencing (NGS) data, single-nucleotide polymorphisms (SNPs), copy number variations (CNVs), and epigenetic modifications. Aims to link genotype to phenotype.",
      methodology: "Leverages CRISPR-Cas9 for gene editing, PCR for amplification, DNA sequencing, and bioinformatics pipelines for data analysis. The primary challenge is ensuring specificity and minimizing off-target effects.",
      innovativeProposal: "Suggests gene therapies to correct mutations, develops novel genetic diagnostic tests, or designs personalized treatment regimens based on a patient's genomic profile.",
    },
    icon: GenomicIcon,
  },
  {
    id: MandateId.SYNTHETIC_BIOLOGY,
    name: "Synthetic Biology & Biomaterials",
    focus: "Bio-Printing, Tissue Engineering, Biocompatibility, Novel Proteins",
    philosophy: "Views biology as an engineering discipline. Prioritizes the design and construction of new biological parts, devices, and systems. Emphasizes the creation of novel functions not found in nature and the interface between living systems and engineered materials.",
    bias: {
      analysis: "Explores material biocompatibility, cellular adhesion, tissue integration, and the expression dynamics of synthetic gene circuits. Focuses on predictability and modularity of biological components.",
      methodology: "Employs techniques like 3D bio-printing, genetic circuit design, directed evolution, and material science characterization. Challenges lie in managing biological complexity and ensuring long-term stability.",
      innovativeProposal: "Focuses on engineering tissues for transplantation, designing microbes to produce biofuels or drugs, or creating 'smart' biomaterials that respond to physiological cues.",
    },
    icon: SyntheticBioIcon,
  },
];


export const TOUR_STEPS = [
  {
    title: 'Welcome to SynapseForge AI!',
    content: 'This quick tour will guide you through the key features of the platform for bio-medical and genetic engineering analysis.',
    position: 'center',
  },
  {
    targetId: 'tour-step-1',
    title: '1. Select a Research Mandate',
    content: "Start by choosing a 'Research Mandate'. This lens determines the AI's analytical perspective, influencing its suggestions on methodology, drug targets, and innovation.",
    position: 'bottom',
  },
  {
    targetId: 'tour-step-2',
    title: '2. Describe Your Subject',
    content: 'In this text area, describe the biological system, gene sequence, or molecule you want to analyze. Be as detailed as possible for the best results.',
    position: 'bottom',
  },
  {
    targetId: 'tour-step-3',
    title: '3. Upload a File (Optional)',
    content: 'For a deeper analysis, you can upload research papers, genomic data files, or microscopy images containing technical details.',
    position: 'bottom',
  },
  {
    targetId: 'tour-step-4',
    title: '4. Engage the AI',
    content: "Once you've selected a mandate and provided a description, click here to begin the analysis. The AI will generate a detailed report.",
    position: 'top',
  },
  {
    targetId: 'tour-step-5',
    title: '5. View the Analysis',
    content: 'Your comprehensive, AI-generated report will appear here, complete with rationale, biomaterial suggestions, experimental procedures, and more.',
    position: 'bottom',
  },
  {
    title: "You're Ready to Go!",
    content: "That's it! You're now ready to use SynapseForge AI to analyze and innovate. Click 'Finish' to close this tour.",
    position: 'center',
  }
] as const;