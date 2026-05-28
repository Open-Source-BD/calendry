"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface OfflineContextType {
  isOfflineMode: boolean;
  toggleOfflineMode: (value: boolean) => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("offline-preview-mode");
    if (saved === "true") {
      setIsOfflineMode(true);
    }
  }, []);

  const toggleOfflineMode = (value: boolean) => {
    setIsOfflineMode(value);
    localStorage.setItem("offline-preview-mode", value.toString());
    
    if (value) {
      toast.warning("You are now in Offline Preview mode. Changes will not be saved.", {
        duration: 5000,
      });
    } else {
      toast.success("Back online! Network features restored.");
    }
  };

  return (
    <OfflineContext.Provider value={{ isOfflineMode, toggleOfflineMode }}>
      {children}
      {isOfflineMode && (
        <div className="fixed bottom-4 left-4 z-[100] bg-[#323232] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm animate-in slide-in-from-bottom-4">
          <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
          Offline preview
        </div>
      )}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error("useOffline must be used within an OfflineProvider");
  }
  return context;
}
