import { useState } from 'react';
import { generateTechnicalDrawingImage, parseApiError } from '../services/geminiService';

export const useDrawingGenerator = (prompt: string | null) => {
  const [drawingUrl, setDrawingUrl] = useState<string | null>(null);
  const [isDrawingLoading, setIsDrawingLoading] = useState<boolean>(false);
  const [drawingError, setDrawingError] = useState<string | null>(null);

  const generateDrawing = async () => {
    if (!prompt) {
      setDrawingError("Cannot generate a drawing without a successful prior analysis.");
      return;
    }

    setIsDrawingLoading(true);
    setDrawingError(null);
    setDrawingUrl(null);

    try {
      const url = await generateTechnicalDrawingImage(prompt);
      setDrawingUrl(url);
    } catch (e) {
      setDrawingError(parseApiError(e));
    } finally {
      setIsDrawingLoading(false);
    }
  };
  
  const clearDrawing = () => {
    setDrawingUrl(null);
    setDrawingError(null);
  }

  return { drawingUrl, isDrawingLoading, drawingError, generateDrawing, clearDrawing };
};
