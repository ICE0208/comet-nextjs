import { useState, useCallback } from "react";

export const useTutorial = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [startStep, setStartStep] = useState(1);

  const openTutorial = useCallback((step: number = 1) => {
    setStartStep(step);
    setIsOpen(true);
  }, []);

  const closeTutorial = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    startStep,
    openTutorial,
    closeTutorial,
  };
};
