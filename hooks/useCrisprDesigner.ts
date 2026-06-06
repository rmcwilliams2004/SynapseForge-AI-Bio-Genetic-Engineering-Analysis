import { useState, useCallback } from 'react';
import { generateCrisprDesign, parseApiError } from '../services/geminiService';
import { CrisprDesignResult } from '../types';

export const useCrisprDesigner = () => {
  const [result, setResult] = useState<CrisprDesignResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const designGuideRNAs = useCallback(async (gene: string, organism: string, action: string) => {
    if (!gene || !organism || !action) {
      setError("All fields must be filled to design gRNAs.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const designResult = await generateCrisprDesign(gene, organism, action);
      setResult(designResult);
    } catch (e) {
      setError(parseApiError(e));
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const clearDesign = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, isLoading, error, designGuideRNAs, clearDesign };
};