"use client";

import { createContext, useContext, useState } from "react";

type SidebarContextType = {
  contraido: boolean;
  setContraido: (contraido: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [contraido, setContraido] = useState(false);

  return (
    <SidebarContext.Provider value={{ contraido, setContraido }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar debe usarse dentro de SidebarProvider");
  }
  return context;
}
