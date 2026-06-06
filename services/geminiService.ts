import { GoogleGenAI, GenerateContentRequest, Part, Type } from '@google/genai';
import { ResearchMandate, AnalysisResult, ProjectVersion, CrisprDesignResult } from '../types';

// According to guidelines, API key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        subject_name: { type: Type.STRING, description: "A concise, descriptive name for the biological subject being analyzed (e.g., 'KRAS G12C Protein', 'mTOR Signaling Pathway')." },
        executive_summary: { type: Type.STRING, description: "A high-level summary of the biological subject, its significance, and key findings from the analysis, tailored to the chosen research mandate." },
        mandate_rationale: {
            type: Type.OBJECT,
            properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A bulleted list of aspects of the current understanding or approach that align with the mandate's philosophy." },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A bulleted list of gaps in knowledge or technological limitations that conflict with or challenge the mandate's philosophy." },
                summary: { type: Type.STRING, description: "A concluding summary of the mandate's overall assessment." }
            },
            required: ["strengths", "weaknesses", "summary"]
        },
        biomaterial_suggestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    rationale: { type: Type.STRING },
                    properties: {
                        type: Type.OBJECT,
                        properties: {
                            biocompatibility: { type: Type.STRING },
                            degradation_rate: { type: Type.STRING },
                            bioactivity: { type: Type.STRING },
                            mechanical_properties: { type: Type.STRING }
                        },
                         required: ["biocompatibility", "degradation_rate", "bioactivity", "mechanical_properties"]
                    }
                },
                required: ["name", "rationale", "properties"]
            }
        },
        synthesis_and_production: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["name", "description"]
            }
        },
        alternative_therapies_analysis: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    alternative_therapy: { type: Type.STRING },
                    advantages: { type: Type.STRING },
                    disadvantages: { type: Type.STRING }
                },
                required: ["alternative_therapy", "advantages", "disadvantages"]
            }
        },
        suggested_interventions: {
             type: Type.ARRAY,
             items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "A highly specific name for the suggested intervention, e.g., 'CRISPR-mediated knockout of Gene X'."},
                    description: { type: Type.STRING },
                    rationale: { type: Type.STRING, description: "A multi-paragraph, detailed rationale explaining why this intervention is proposed and how it aligns with the research mandate." }
                },
                required: ["name", "description", "rationale"]
             }
        },
        researchProtocolOutline: {
            type: Type.OBJECT,
            properties: {
                introduction: { type: Type.STRING },
                key_objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                experimental_design: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["introduction", "key_objectives", "experimental_design"]
        },
        experimentalProcedure: {
            type: Type.OBJECT,
            properties: {
                overview: { type: Type.STRING },
                steps: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            step: { type: Type.INTEGER },
                            action: { type: Type.STRING },
                            reagents_needed: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ["step", "action", "reagents_needed"]
                    }
                }
            },
            required: ["overview", "steps"]
        },
        biohazardEthicalAssessment: {
            type: Type.OBJECT,
            properties: {
                overview: { type: Type.STRING },
                risks: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            risk: { type: Type.STRING },
                            likelihood: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                            severity: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                            mitigation: { type: Type.STRING }
                        },
                        required: ["risk", "likelihood", "severity", "mitigation"]
                    }
                }
            },
            required: ["overview", "risks"]
        },
        molecularVisualizationSpec: {
            type: Type.OBJECT,
            properties: {
                visualization_method: { type: Type.STRING, description: "e.g., Protein ribbon diagram, volumetric rendering" },
                software_used: { type: Type.ARRAY, items: { type: Type.STRING } },
                key_interactions_to_highlight: { type: Type.ARRAY, items: { type: Type.STRING } },
                general_notes: { type: Type.STRING },
                reagent_list: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            reagent_id: { type: Type.STRING },
                            name: { type: Type.STRING },
                            quantity: { type: Type.STRING },
                            supplier: { type: Type.STRING },
                            notes: { type: Type.STRING }
                        },
                        required: ["reagent_id", "name", "quantity", "supplier", "notes"]
                    }
                }
            },
            required: ["visualization_method", "software_used", "key_interactions_to_highlight", "general_notes", "reagent_list"]
        },
        preliminaryResearchBudget: {
            type: Type.OBJECT,
            properties: {
                total_estimate_range: { type: Type.STRING },
                confidence: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                assumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
                breakdown: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            item: { type: Type.STRING },
                            cost_estimate_range: { type: Type.STRING },
                            rationale: { type: Type.STRING }
                        },
                        required: ["item", "cost_estimate_range", "rationale"]
                    }
                }
            },
            required: ["total_estimate_range", "confidence", "assumptions", "breakdown"]
        }
    },
    required: ["subject_name", "executive_summary", "mandate_rationale", "biomaterial_suggestions", "synthesis_and_production", "alternative_therapies_analysis", "suggested_interventions", "researchProtocolOutline", "experimentalProcedure", "biohazardEthicalAssessment", "molecularVisualizationSpec", "preliminaryResearchBudget"]
};

const crisprDesignSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            sequence: { type: Type.STRING, description: "The 20-nucleotide guide RNA sequence." },
            on_target_score: { type: Type.NUMBER, description: "A numerical score from 0-100 indicating the predicted on-target efficiency." },
            off_target_sites: { type: Type.INTEGER, description: "The total number of predicted off-target sites in the genome with 3 or fewer mismatches." },
            top_off_target_sequence: { type: Type.STRING, description: "The sequence of the most likely off-target site." },
            genomic_location: { type: Type.STRING, description: "The chromosomal location of the gRNA target site (e.g., 'Chr7: 116,412,021-116,412,040')." },
        },
        required: ["sequence", "on_target_score", "off_target_sites", "top_off_target_sequence", "genomic_location"],
    }
};


const buildSystemInstruction = (mandate: ResearchMandate): string => {
  return `You are a world-class, expert biomedical research analyst AI. Your primary function is to deconstruct and analyze a biological concept provided by a user, generating a comprehensive, actionable research and development report.

  Your current analytical lens is the "${mandate.name}" mandate.

  Philosophy Overview: ${mandate.philosophy}

  Core Biases to guide your analysis:
  - Analysis Focus: ${mandate.bias.analysis}
  - Methodological Preference: ${mandate.bias.methodology}
  - Innovative Proposals: ${mandate.bias.innovativeProposal}
  
  Your task is to meticulously analyze the user's concept (text and any provided images/PDFs) and generate a full research report. This includes identifying molecular interactions, assessing biological pathways, suggesting therapeutic interventions, and creating a full suite of documentation as if you were preparing it for a formal grant application or institutional review. You must fill out every single field in the provided JSON schema with detailed, thoughtful analysis.

  You MUST respond in JSON format, strictly adhering to the provided schema. Do not include any markdown formatting (e.g., \`\`\`json). Your entire output must be a single, valid JSON object.
  `;
};

export const buildRenfieldSystemInstruction = (projectVersion: ProjectVersion, faction: ResearchMandate): string => {
    const context = JSON.stringify({
        projectName: projectVersion.name,
        userPrompt: projectVersion.prompt,
        analysisResult: projectVersion.result
    }, null, 2);

    return `You are Renfield, an advanced AI research partner. Your personality is collaborative, insightful, innovative, and deeply knowledgeable in biomedical science. You are speaking directly to your human partner, the user. Your goal is to help them brainstorm and expand upon their research ideas.

    You have been primed with the full context of their current project, which is a biomedical analysis. Do not re-state the entire context. Instead, use it as your memory. Refer to it naturally as if you've already studied it together.

    Your current guiding research mandate is "${faction.name}: ${faction.philosophy}".

    Engage the user in a natural, spoken conversation. Ask clarifying questions. Offer creative, out-of-the-box ideas based on your analysis. Help them see new possibilities for their research. Be their partner in innovation. Keep your responses concise and conversational to facilitate a real-time spoken dialogue.

    This is the project context you are working with:
    ${context}
    `;
};

export const generateAnalysis = async (prompt: string, faction: ResearchMandate, files: Part[] | null): Promise<AnalysisResult> => {
    const systemInstruction = buildSystemInstruction(faction);
    
    const textPart: Part = { text: prompt };
    const allParts: Part[] = [textPart];

    if (files) {
        allParts.push(...files);
    }

    const request: GenerateContentRequest = {
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: allParts }],
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: analysisSchema,
            temperature: 0.5,
            topP: 0.9,
        }
    };

    const response = await ai.models.generateContent(request);
    
    const jsonText = response.text.trim();
    
    try {
        return JSON.parse(jsonText) as AnalysisResult;
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonText);
        throw new Error("The AI returned an invalid response format. Please try again.");
    }
};

export const generateCrisprDesign = async (gene: string, organism: string, action: string): Promise<CrisprDesignResult> => {
    const systemInstruction = `You are an expert bioinformatics software engineer specializing in gene-editing tools. Your task is to act as a virtual CRISPR-Cas9 design tool. You will receive a target gene, an organism, and a desired action. You must simulate the process of identifying the gene's sequence, designing a set of 5 to 10 highly efficient and specific guide RNAs (gRNAs), and predicting their on-target and off-target scores.

    Your process is as follows:
    1.  **Simulate Gene Retrieval:** Based on the gene and organism, determine a plausible genomic location.
    2.  **Design gRNAs:** Generate realistic 20-nucleotide gRNA sequences that would target the gene, ensuring they are adjacent to a PAM site (NGG).
    3.  **Score On-Target Activity:** Assign a score from 0-100 for each gRNA based on sequence features known to influence Cas9 activity (e.g., GC content).
    4.  **Predict Off-Target Effects:** For each gRNA, estimate the number of potential off-target sites in the genome and identify the most likely off-target sequence.

    You MUST respond in JSON format, strictly adhering to the provided schema. Do not include any markdown formatting. Your entire output must be a single, valid JSON array of gRNA objects.`;

    const userPrompt = `Target Gene/Protein Name: "${gene}"
Organism: "${organism}"
Target Action: "${action}"`;

    const request: GenerateContentRequest = {
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: crisprDesignSchema,
            temperature: 0.6,
        }
    };

    const response = await ai.models.generateContent(request);
    const jsonText = response.text.trim();

    try {
        return JSON.parse(jsonText) as CrisprDesignResult;
    } catch (e) {
        console.error("Failed to parse CRISPR JSON response:", jsonText);
        throw new Error("The AI returned an invalid response format for the CRISPR design. Please try again.");
    }
};

export const generateTechnicalDrawingImage = async (prompt: string): Promise<string> => {
    const fullPrompt = `Generate a clean, professional, scientific illustration of a "${prompt}". The style should be a clear, high-contrast diagram suitable for a research paper, on a white background. Include clear labels for key components. For a protein, show a ribbon diagram. For a cellular process, show a pathway diagram.`;

    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: fullPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '16:9',
        },
    });

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    if (!base64ImageBytes) {
        throw new Error("Image generation failed to return image data.");
    }
    return `data:image/png;base64,${base64ImageBytes}`;
};

export const generateExplodedViewVideo = async (prompt: string): Promise<string> => {
    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: `Create a high-quality, 10-second 3D CGI animation of the biological process or molecule: "${prompt}". The style should be a clean, professional scientific visualization. For example, show a drug molecule binding to a protein's active site, or a virus entering a cell.`,
        config: {
            numberOfVideos: 1,
        },
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation failed or did not produce a valid download link.");
    }

    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }

    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};


export const parseApiError = (e: unknown): string => {
  if (e instanceof Error) {
    if (e.message.includes("oneof field 'data' must have one initialized field")) {
        return "The request to the AI was malformed, likely due to an empty prompt or file. Please ensure you have entered a prompt and try again."
    }
    const geminiError = (e as any).response?.data?.error?.message || e.message;
    if (geminiError.includes('API_KEY_INVALID')) {
      return 'The provided API key is invalid. Please check your configuration.';
    }
    return geminiError;
  }
  return 'An unknown error occurred. Please check the console for more details.';
};