import { useCallback } from 'react';

const LOCAL_STORAGE_KEY = 'synapseforge-temp-project-name';

export const useProjectNamePersistence = () => {
  const saveProjectName = useCallback((name: string) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, name);
    } catch (error)      {
      console.error("Failed to save project name to localStorage:", error);
    }
  }, []);

  const loadProjectName = useCallback((): string | null => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to load project name from localStorage:", error);
      return null;
    }
  }, []);

  const clearProjectName = useCallback(() => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear project name from localStorage:", error);
    }
  }, []);

  return {
    saveProjectName,
    loadProjectName,
    clearProjectName,
  };
};
