import React, { useState } from 'react';
import { useCrisprDesigner } from '../hooks/useCrisprDesigner';
import { GuideRNA } from '../types';

interface CrisprToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGene: string;
}

const exportToCSV = (data: GuideRNA[], geneName: string) => {
    const headers = "gRNA Sequence,On-Target Score,Number of Off-Target Sites,Top Off-Target Sequence,Genomic Location";
    const rows = data.map(g => `"${g.sequence}",${g.on_target_score},${g.off_target_sites},"${g.top_off_target_sequence}","${g.genomic_location}"`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${geneName}_gRNA_design.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const exportToJSON = (data: GuideRNA[], geneName: string) => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement("a");
    link.setAttribute("href", jsonString);
    link.setAttribute("download", `${geneName}_gRNA_design.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const CrisprToolModal = ({ isOpen, onClose, initialGene }: CrisprToolModalProps) => {
    const [gene, setGene] = useState(initialGene);
    const [organism, setOrganism] = useState('Homo sapiens');
    const [action, setAction] = useState('Knockout');
    const { result, isLoading, error, designGuideRNAs, clearDesign } = useCrisprDesigner();

    if (!isOpen) return null;

    const handleDesign = () => {
        designGuideRNAs(gene, organism, action);
    };
    
    const handleClose = () => {
        clearDesign();
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in" style={{ animationDuration: '0.3s' }} onClick={handleClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col border-2 border-brand-teal" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-teal"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>
                        <h2 className="text-2xl font-bold text-slate-800">Virtual CRISPR Design Tool</h2>
                    </div>
                    <button onClick={handleClose} className="text-slate-400 hover:text-slate-800 transition text-3xl font-bold">&times;</button>
                </header>
                
                <main className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm p-3 rounded-lg">
                        <strong>Disclaimer:</strong> This is an AI-powered simulation. The generated gRNA sequences are for research and planning purposes only and have not been experimentally validated. Always verify results with established bioinformatics tools and perform in-lab validation.
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="gene-input" className="block text-sm font-medium text-slate-700 mb-1">Target Gene/Protein</label>
                            <input id="gene-input" type="text" value={gene} onChange={e => setGene(e.target.value)} className="w-full p-2 bg-white border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label htmlFor="organism-select" className="block text-sm font-medium text-slate-700 mb-1">Organism</label>
                            <select id="organism-select" value={organism} onChange={e => setOrganism(e.target.value)} className="w-full p-2 bg-white border border-slate-300 rounded-lg">
                                <option>Homo sapiens</option>
                                <option>Mus musculus</option>
                                <option>Danio rerio</option>
                                <option>Drosophila melanogaster</option>
                            </select>
                        </div>
                        <div>
                             <label htmlFor="action-select" className="block text-sm font-medium text-slate-700 mb-1">Target Action</label>
                             <select id="action-select" value={action} onChange={e => setAction(e.target.value)} className="w-full p-2 bg-white border border-slate-300 rounded-lg">
                                <option>Knockout</option>
                                <option>Activate</option>
                                <option>Repress</option>
                            </select>
                        </div>
                        <div className="self-end">
                            <button onClick={handleDesign} disabled={isLoading} className="w-full py-2 px-4 bg-brand-teal text-white font-bold rounded-lg hover:bg-teal-600 transition disabled:opacity-50">
                                {isLoading ? 'Designing...' : 'Design gRNAs'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 border-t border-slate-200 pt-4 overflow-y-auto">
                        {isLoading && <div className="text-center p-8">Loading...</div>}
                        {error && <div className="text-center p-8 text-red-500">{error}</div>}
                        {result && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Generated Guide RNA Candidates for "{gene}"</h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => exportToJSON(result, gene)} className="text-xs py-1 px-3 bg-slate-100 rounded-md hover:bg-slate-200">Export JSON</button>
                                        <button onClick={() => exportToCSV(result, gene)} className="text-xs py-1 px-3 bg-slate-100 rounded-md hover:bg-slate-200">Export CSV</button>
                                    </div>
                                </div>
                                <table className="w-full text-sm text-left text-slate-500">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">gRNA Sequence</th>
                                            <th scope="col" className="px-6 py-3">On-Target Score</th>
                                            <th scope="col" className="px-6 py-3">Off-Target Sites</th>
                                            <th scope="col" className="px-6 py-3">Top Off-Target</th>
                                            <th scope="col" className="px-6 py-3">Genomic Location</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.map((g, i) => (
                                            <tr key={i} className="bg-white border-b hover:bg-slate-50">
                                                <td className="px-6 py-4 font-mono text-xs">{g.sequence}</td>
                                                <td className="px-6 py-4">{g.on_target_score.toFixed(2)}</td>
                                                <td className="px-6 py-4">{g.off_target_sites}</td>
                                                <td className="px-6 py-4 font-mono text-xs">{g.top_off_target_sequence}</td>
                                                <td className="px-6 py-4">{g.genomic_location}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {!result && !isLoading && !error && <div className="text-center p-8 text-slate-500">Results will be displayed here.</div>}
                    </div>
                </main>
            </div>
        </div>
    );
};