import { useCallback, useEffect, useState } from "react";
import { loadCredits, loadWelcomeSeen, saveCredits, saveWelcomeSeen } from "../utils/storage";

export function useWallet(initialCredits: number) {
  const [credits, setCredits] = useState<number>(() => loadCredits(initialCredits));
  const [showWelcomeCredits, setShowWelcomeCredits] = useState<boolean>(() => !loadWelcomeSeen());

  useEffect(() => {
    saveCredits(credits);
  }, [credits]);

  const addCredits = useCallback((delta: number) => {
    setCredits((prev) => Math.max(0, prev + delta));
  }, []);

  const trySpend = useCallback(
    (cost: number) => {
      if (credits - cost < 0) return false;
      setCredits((prev) => Math.max(0, prev - cost));
      return true;
    },
    [credits]
  );

  const dismissWelcome = useCallback(() => {
    setShowWelcomeCredits(false);
    saveWelcomeSeen();
  }, []);

  return {
    credits,
    setCredits,
    addCredits,
    trySpend,
    showWelcomeCredits,
    dismissWelcome,
  };
}
