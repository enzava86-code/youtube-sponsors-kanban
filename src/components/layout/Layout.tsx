"use client";

import { Header } from "./Header";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  user?: {
    name: string;
    email: string;
    channelName: string;
    avatar?: string;
  };
  onNewDeal?: () => void;
  onExportData?: () => void;
  onCalendarView?: () => void;
  onSearch?: (searchTerm: string) => void;
  onCreateNew?: () => void;
  view: "kanban" | "calendar";
  setView: (view: "kanban" | "calendar") => void;
}

export function Layout({ 
  children, 
  user, 
  onNewDeal, 
  onExportData, 
  onCalendarView,
  onSearch,
  onCreateNew,
  view,
  setView
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        user={user}
        onNewDeal={onNewDeal}
        onExportData={onExportData}
        onCalendarView={onCalendarView}
        onSearch={onSearch}
        onCreateNew={onCreateNew}
        view={view}
        setView={setView}
      />
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}