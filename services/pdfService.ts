import { AnalysisResult, Project } from '../types';

// This is a global variable from the script tag in index.html
declare const jspdf: any;

const { jsPDF } = jspdf;

const addHeaderFooter = (doc: any, projectName: string, pageNumber: number, totalPages: number) => {
    const header = `SynapseForge AI: Bio-Genetic Analysis Report - ${projectName}`;
    const footer = `Page ${pageNumber} of ${totalPages}`;
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(header, 15, 10);
    doc.text(footer, pageWidth / 2, pageHeight - 10, { align: 'center' });
};

export const exportFullReportPDF = (project: Project, drawingDataUrl: string | null) => {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const latestVersion = project.history[0];
    const projectName = latestVersion.name;
    const result = latestVersion.result;
    
    if (!result) {
        alert("Cannot generate a report for a project with no analysis results.");
        return;
    }

    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    const maxLineWidth = pageWidth - margin * 2;
    let y = 20;

    const checkPageBreak = (requiredHeight = 10) => {
        if (y + requiredHeight > pageHeight - 20) {
            doc.addPage();
            y = 20;
        }
    };

    const addText = (text: string | string[], options: any = {}, addHeight = 4) => {
        checkPageBreak();
        const splitText = doc.splitTextToSize(text, maxLineWidth);
        doc.text(splitText, margin, y, options);
        const textHeight = doc.getTextDimensions(splitText).h;
        y += textHeight + addHeight;
    };
    
    const addSectionTitle = (title: string) => {
        y += y > 25 ? 12 : 0;
        checkPageBreak(20);
        doc.setFontSize(16);
        doc.setTextColor(13, 148, 136); // brand-teal
        addText(title, {}, 0);
        y+= 2;
        doc.setDrawColor(100);
        doc.line(margin, y - 1, pageWidth - margin, y - 1);
        doc.setFontSize(11);
        doc.setTextColor(40);
        y += 5;
    };
    
    const addSubTitle = (title: string) => {
        y += 6;
        checkPageBreak(10);
        doc.setFontSize(13);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(80);
        addText(title);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(40);
        y -= 2;
    };

    // --- Title Page ---
    doc.setFontSize(28);
    doc.setTextColor(15, 23, 42);
    doc.text('Bio-Medical & Genetic Analysis Report', pageWidth / 2, 120, { align: 'center' });
    
    doc.setFontSize(22);
    const projectTitleLines = doc.splitTextToSize(projectName, 180);
    doc.text(projectTitleLines, pageWidth / 2, 140, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 160 + (projectTitleLines.length * 10), { align: 'center' });


    // --- Start Content ---
    doc.addPage();
    y = 20;

    addSectionTitle('Executive Summary');
    addText(result.executive_summary);

    addSectionTitle('Mandate Rationale');
    addSubTitle('Strengths');
    addText(result.mandate_rationale.strengths.map(p => `- ${p}`));
    addSubTitle('Weaknesses');
    addText(result.mandate_rationale.weaknesses.map(c => `- ${c}`));
    addSubTitle('Summary');
    addText(result.mandate_rationale.summary);
    
    addSectionTitle('Biomaterial Suggestions');
    result.biomaterial_suggestions.forEach(mat => {
        addSubTitle(mat.name);
        addText(`Rationale: ${mat.rationale}`);
        (doc as any).autoTable({
            startY: y,
            head: [['Property', 'Value']],
            body: [
                ['Biocompatibility', mat.properties.biocompatibility],
                ['Degradation Rate', mat.properties.degradation_rate],
                ['Bioactivity', mat.properties.bioactivity],
                ['Mechanical Properties', mat.properties.mechanical_properties],
            ],
            theme: 'striped',
            headStyles: { fillColor: [80, 80, 80] },
            styles: { fontSize: 9, cellPadding: 2 },
            tableWidth: 'auto',
            margin: { left: margin }
        });
        y = (doc as any).autoTable.previous.finalY + 8;
    });

    addSectionTitle('Synthesis & Production Analysis');
    result.synthesis_and_production.forEach(proc => {
        addSubTitle(proc.name);
        addText(proc.description);
    });

    addSectionTitle('Alternative Therapies Analysis');
    (doc as any).autoTable({
        startY: y,
        head: [['Alternative Therapy', 'Advantages', 'Disadvantages']],
        body: result.alternative_therapies_analysis.map(c => [
            c.alternative_therapy, c.advantages, c.disadvantages
        ]),
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42] },
         styles: { fontSize: 9 }
    });
    y = (doc as any).autoTable.previous.finalY + 10;
    
    addSectionTitle('AI-Suggested Interventions');
     result.suggested_interventions.forEach(sys => {
        addSubTitle(sys.name);
        addText(`Description: ${sys.description}`);
        addText(`Rationale: ${sys.rationale}`);
    });
    
    addSectionTitle('Research Protocol Outline');
    addSubTitle('Introduction');
    addText(result.researchProtocolOutline.introduction);
    addSubTitle('Key Objectives');
    addText(result.researchProtocolOutline.key_objectives.map(r => `- ${r}`));
    addSubTitle('Experimental Design');
    addText(result.researchProtocolOutline.experimental_design.map(t => `- ${t}`));

    addSectionTitle('Biohazard & Ethical Assessment');
    (doc as any).autoTable({
        startY: y,
        head: [['Risk', 'Likelihood', 'Severity', 'Mitigation']],
        body: result.biohazardEthicalAssessment.risks.map(r => [
            r.risk, r.likelihood, r.severity, r.mitigation
        ]),
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42] },
        styles: { fontSize: 9 }
    });
    y = (doc as any).autoTable.previous.finalY + 10;
    
    if (drawingDataUrl) {
        checkPageBreak(150);
        addSectionTitle('Generated Scientific Illustration');
        try {
            const imgWidth = maxLineWidth;
            const imgHeight = (imgWidth / 16) * 9;
            checkPageBreak(imgHeight + 10);
            doc.addImage(drawingDataUrl, 'PNG', margin, y, imgWidth, imgHeight);
            y += imgHeight + 10;
        } catch (e) {
            console.error("Failed to add image to PDF:", e);
            addText("Error: The generated illustration could not be embedded in the PDF.", { color: 'red' });
        }
    }
    
    addSectionTitle('Molecular Visualization Specification');
    addSubTitle('General Specifications');
    addText(`Visualization Method: ${result.molecularVisualizationSpec.visualization_method || 'Not Specified'}`);
    addText(`Software Used: ${result.molecularVisualizationSpec.software_used.join(', ') || 'Not Specified'}`);

    addSubTitle('Key Interactions to Highlight');
    addText(result.molecularVisualizationSpec.key_interactions_to_highlight.length > 0 ? result.molecularVisualizationSpec.key_interactions_to_highlight.map(v => `- ${v}`) : 'None specified.');

    addSubTitle('General Notes');
    addText(result.molecularVisualizationSpec.general_notes || 'No general notes provided.');

    addSubTitle('Reagent List');
    (doc as any).autoTable({
        startY: y,
        head: [['ID', 'Name', 'Qty', 'Supplier', 'Notes']],
        body: result.molecularVisualizationSpec.reagent_list.map(b => [
            b.reagent_id, b.name, b.quantity, b.supplier, b.notes
        ]),
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42] },
        styles: { fontSize: 9 }
    });
    y = (doc as any).autoTable.previous.finalY + 10;


    // Add headers and footers to all content pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 2; i <= pageCount; i++) {
        doc.setPage(i);
        addHeaderFooter(doc, projectName, i - 1, pageCount - 1);
    }
    
    doc.save(`${projectName.replace(/\s/g, '_')}_Analysis_Report.pdf`);
};

// Placeholder for individual exports if they are re-added
export const exportCostEstimatePDF = (result: AnalysisResult, projectName: string) => { /* ... */ };
export const exportRiskAssessmentPDF = (result: AnalysisResult, projectName: string) => { /* ... */ };
export const exportDrawingSpecPDF = (result: AnalysisResult, projectName: string) => { /* ... */ };