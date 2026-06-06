import { useState, useEffect, useCallback } from 'react';
import { Project, ProjectVersion, MandateId, AnalysisResult } from '../types';

const LOCAL_STORAGE_KEY = 'synapseforge-projects-v2';

const createNewProject = (): Project => {
    const timestamp = new Date().toISOString();
    const initialVersion: ProjectVersion = {
        versionId: `ver-${Date.now()}`,
        createdAt: timestamp,
        name: `New Project - ${new Date(timestamp).toLocaleDateString()}`,
        prompt: '',
        factionId: MandateId.CELLULAR_MOLECULAR,
        result: {
            subject_name: 'Untitled',
            executive_summary: '',
            mandate_rationale: { strengths: [], weaknesses: [], summary: '' },
            biomaterial_suggestions: [],
            synthesis_and_production: [],
            alternative_therapies_analysis: [],
            suggested_interventions: [],
            researchProtocolOutline: { introduction: '', key_objectives: [], experimental_design: [] },
            experimentalProcedure: { overview: '', steps: [] },
            biohazardEthicalAssessment: { overview: '', risks: [] },
            molecularVisualizationSpec: { visualization_method: '', software_used: [], key_interactions_to_highlight: [], general_notes: '', reagent_list: [] },
            preliminaryResearchBudget: { total_estimate_range: '', confidence: 'Low', assumptions: [], breakdown: [] }
        },
        fileUrls: [],
    };
    return {
        id: `proj-${Date.now()}`,
        createdAt: timestamp,
        updatedAt: timestamp,
        history: [initialVersion],
    };
};

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

    useEffect(() => {
        try {
            const storedProjects = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedProjects) {
                const parsedProjects: Project[] = JSON.parse(storedProjects);
                if (parsedProjects.length > 0) {
                    setProjects(parsedProjects);
                    setActiveProjectId(parsedProjects[0].id);
                } else {
                    const initialProject = createNewProject();
                    setProjects([initialProject]);
                    setActiveProjectId(initialProject.id);
                }
            } else {
                const initialProject = createNewProject();
                setProjects([initialProject]);
                setActiveProjectId(initialProject.id);
            }
        } catch (error) {
            console.error("Failed to load projects from localStorage:", error);
            const initialProject = createNewProject();
            setProjects([initialProject]);
            setActiveProjectId(initialProject.id);
        }
    }, []);

    const saveProjectsToStorage = useCallback((updatedProjects: Project[]) => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProjects));
        } catch (error) {
            console.error("Failed to save projects to localStorage:", error);
        }
    }, []);

    const handleNewProject = () => {
        const newProject = createNewProject();
        const updatedProjects = [newProject, ...projects];
        setProjects(updatedProjects);
        setActiveProjectId(newProject.id);
        saveProjectsToStorage(updatedProjects);
    };

    const handleDeleteProject = (projectId: string) => {
        const updatedProjects = projects.filter(p => p.id !== projectId);
        setProjects(updatedProjects);
        saveProjectsToStorage(updatedProjects);

        if (activeProjectId === projectId) {
            if (updatedProjects.length > 0) {
                setActiveProjectId(updatedProjects[0].id);
            } else {
                const newProject = createNewProject();
                setProjects([newProject]);
                setActiveProjectId(newProject.id);
                saveProjectsToStorage([newProject]);
            }
        }
    };
    
    const saveNewVersion = useCallback((versionData: Omit<ProjectVersion, 'versionId' | 'createdAt'>) => {
        setProjects(prevProjects => {
            let projectUpdated = false;
            const timestamp = new Date().toISOString();
            
            const newVersion: ProjectVersion = {
                ...versionData,
                versionId: `ver-${Date.now()}`,
                createdAt: timestamp,
            };

            const updatedProjects = prevProjects.map(p => {
                if (p.id === activeProjectId) {
                    projectUpdated = true;
                    return { 
                        ...p, 
                        updatedAt: timestamp,
                        history: [newVersion, ...p.history] // Add new version to the front
                    };
                }
                return p;
            });

            if (!projectUpdated) return prevProjects;

            const activeProjectIndex = updatedProjects.findIndex(p => p.id === activeProjectId);
            if (activeProjectIndex > 0) {
                const [activeProject] = updatedProjects.splice(activeProjectIndex, 1);
                updatedProjects.unshift(activeProject);
            }

            saveProjectsToStorage(updatedProjects);
            return updatedProjects;
        });
    }, [activeProjectId, saveProjectsToStorage]);

    const revertToVersion = useCallback((versionIndex: number) => {
        setProjects(prevProjects => {
            const projectToUpdate = prevProjects.find(p => p.id === activeProjectId);
            if (!projectToUpdate || !projectToUpdate.history[versionIndex]) {
                return prevProjects;
            }

            // Create a new version based on the old one
            const oldVersion = projectToUpdate.history[versionIndex];
            const timestamp = new Date().toISOString();
            const newVersion: ProjectVersion = {
                ...oldVersion,
                versionId: `ver-${Date.now()}`,
                createdAt: timestamp,
                name: `${oldVersion.name} (Reverted)`, // Mark as reverted
            };
            
            const updatedProjects = prevProjects.map(p => {
                if (p.id === activeProjectId) {
                    return {
                        ...p,
                        updatedAt: timestamp,
                        history: [newVersion, ...p.history]
                    };
                }
                return p;
            });

            saveProjectsToStorage(updatedProjects);
            return updatedProjects;
        });
    }, [activeProjectId, saveProjectsToStorage]);


    const activeProject = projects.find(p => p.id === activeProjectId) || null;

    return {
        projects,
        activeProject,
        activeProjectId,
        onNewProject: handleNewProject,
        onDeleteProject: handleDeleteProject,
        onSelectProject: (project: Project) => setActiveProjectId(project.id),
        saveNewVersion,
        revertToVersion,
    };
};