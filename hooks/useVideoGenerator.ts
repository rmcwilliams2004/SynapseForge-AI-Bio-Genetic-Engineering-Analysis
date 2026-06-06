import { useState } from 'react';
import { generateExplodedViewVideo, parseApiError } from '../services/geminiService';

export const useVideoGenerator = (prompt: string | null) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const generateVideo = async () => {
    if (!prompt) {
      setVideoError("Cannot generate video without a successful prior analysis.");
      return;
    }

    setIsVideoLoading(true);
    setVideoError(null);
    setVideoUrl(null);

    try {
      const url = await generateExplodedViewVideo(prompt);
      setVideoUrl(url);
    // Fix: Corrected the malformed try-catch block.
    } catch (e) {
      setVideoError(parseApiError(e));
    } finally {
      setIsVideoLoading(false);
    }
  };
  
  const clearVideo = () => {
    // FIX: If we are using a blob URL, we should revoke it to prevent memory leaks.
    if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
    setVideoError(null);
  }

  return { videoUrl, isVideoLoading, videoError, generateVideo, clearVideo };
};
