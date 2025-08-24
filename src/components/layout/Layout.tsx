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
    <div className="min-h-screen bg-background">
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
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}