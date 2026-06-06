import React, { useState, useMemo } from 'react';
import { Project, ProjectVersion, AnalysisResult } from '../types';
import { Modal } from './Modal';

interface ProjectManagerProps {
    projects: Project[];
    activeProject: Project | null;
    activeVersionIndex: number;
    onSelectProject: (project: Project) => void;
    onNewProject: () => void;
    onDeleteProject: (projectId: string) => void;
    onLoadVersion: (index: number) => void;
    onRevertVersion: (index: number) => void;
    disabled: boolean;
}

const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString();
};

const Icons = {
    Trash: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>,
    Revert: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>,
    Search: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>,
};

const getResultKeywords = (result: AnalysisResult | null): string => {
    if (!result) return '';
    const keywords = [
        result.subject_name,
        result.executive_summary,
        // Biomaterial Suggestions
        ...result.biomaterial_suggestions.flatMap(m => [
            m.name, m.rationale
        ]),
        // Synthesis
        ...result.synthesis_and_production.flatMap(m => [
            m.name, m.description
        ]),
        // Interventions
        ...result.suggested_interventions.flatMap(s => [
            s.name, s.description, s.rationale
        ]),
        // Biohazard Assessment
        ...result.biohazardEthicalAssessment.risks.flatMap(r => [
            r.risk, r.mitigation
        ]),
        // Reagent List from Visualization Spec
        ...result.molecularVisualizationSpec.reagent_list.flatMap(b => [
            b.name, b.supplier, b.notes
        ]),
    ];
    return keywords.filter(Boolean).join(' ').toLowerCase();
};


export const ProjectManager = ({ projects, activeProject, activeVersionIndex, onSelectProject, onNewProject, onDeleteProject, onLoadVersion, onRevertVersion, disabled }: ProjectManagerProps) => {
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProjects = useMemo(() => {
        if (!searchTerm) return projects;
        const lowercasedFilter = searchTerm.toLowerCase();
        return projects.filter(project => {
            const currentName = project.history[0]?.name.toLowerCase() || '';
            if (currentName.includes(lowercasedFilter)) {
                return true;
            }
            // Search through all versions for keywords
            return project.history.some(version => getResultKeywords(version.result).includes(lowercasedFilter));
        });
    }, [projects, searchTerm]);

    const handleDeleteClick = (e: React.MouseEvent, project: Project) => {
        e.stopPropagation();
        setProjectToDelete(project);
    };

    const confirmDelete = () => {
        if (projectToDelete) {
            onDeleteProject(projectToDelete.id);
            setProjectToDelete(null);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold text-slate-800">Projects</h2>
                    <button onClick={onNewProject} disabled={disabled} className="py-2 px-4 bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-200 hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                        + New Project
                    </button>
                </div>
                <div className="relative mb-2">
                    <Icons.Search />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-slate-800 focus:ring-brand-teal focus:border-brand-teal"
                    />
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-2 max-h-48 overflow-y-auto">
                    {filteredProjects.length === 0 ? (
                        <p className="text-slate-500 text-center p-4">{searchTerm ? 'No projects match your search.' : 'No projects yet.'}</p>
                    ) : (
                        <ul className="space-y-1">
                            {filteredProjects.map((project) => (
                                <li
                                    key={project.id}
                                    onClick={() => !disabled && onSelectProject(project)}
                                    className={`flex justify-between items-center p-2 rounded-md transition ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'} ${activeProject?.id === project.id ? 'bg-teal-50' : 'hover:bg-slate-100'}`}
                                >
                                    <div className="truncate">
                                        <p className={`font-semibold ${activeProject?.id === project.id ? 'text-brand-teal' : 'text-slate-800'}`}>{project.history[0]?.name || 'Untitled'}</p>
                                        <p className="text-xs text-slate-500">Updated: {formatDate(project.updatedAt)}</p>
                                    </div>
                                    <button onClick={(e) => handleDeleteClick(e, project)} disabled={disabled} className="p-2 text-slate-400 hover:text-red-500 transition rounded-full disabled:opacity-50" title="Delete Project"><Icons.Trash /></button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {activeProject && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Version History for "{activeProject.history[0].name}"</h3>
                    <div className="bg-white border border-slate-200 rounded-lg p-2 max-h-48 overflow-y-auto">
                        <ul className="space-y-1">
                            {activeProject.history.map((version, index) => (
                                <li
                                    key={version.versionId}
                                    className={`p-2 rounded-md ${index === activeVersionIndex ? 'bg-teal-50' : ''}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className={`font-semibold text-sm ${index === activeVersionIndex ? 'text-brand-teal' : 'text-slate-800'}`}>{version.name}</p>
                                            <p className="text-xs text-slate-500">Saved: {formatDate(version.createdAt)}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => onLoadVersion(index)} disabled={disabled || index === activeVersionIndex} className="py-1 px-2 text-xs bg-slate-200 text-slate-700 rounded hover:bg-slate-300 disabled:opacity-50">View</button>
                                            <button onClick={() => onRevertVersion(index)} disabled={disabled} className="py-1 px-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-1" title="Revert to this version"><Icons.Revert />Revert</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <Modal isOpen={!!projectToDelete} onClose={() => setProjectToDelete(null)} onConfirm={confirmDelete} title="Confirm Deletion" confirmText="Delete">
                Are you sure you want to permanently delete the project "<strong>{projectToDelete?.history[0]?.name}</strong>"? This action cannot be undone.
            </Modal>
        </div>
    );
};