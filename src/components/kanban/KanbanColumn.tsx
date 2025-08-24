"use client";

import { Plus } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SponsorshipCard } from "./SponsorshipCard";
import { Sponsorship, SponsorshipStatus } from "@/types/sponsorship";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  title: string;
  status: SponsorshipStatus;
  sponsorships: Sponsorship[];
  onAddSponsorship?: () => void;
  onEditSponsorship?: (sponsorship: Sponsorship) => void;
  onViewSponsorship?: (sponsorship: Sponsorship) => void;
  onMoveSponsorship?: (sponsorship: Sponsorship) => void;
  onUpdate?: (id: string, data: Partial<Sponsorship>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const statusColors = {
  prospect: "bg-gray-50 dark:bg-gray-900",
  initial_contact: "bg-blue-50 dark:bg-blue-900/20",
  negotiation: "bg-yellow-50 dark:bg-yellow-900/20",
  proposal_sent: "bg-orange-50 dark:bg-orange-900/20",
  contract_signed: "bg-green-50 dark:bg-green-900/20",
  content_production: "bg-purple-50 dark:bg-purple-900/20",
  client_review: "bg-pink-50 dark:bg-pink-900/20",
  published: "bg-indigo-50 dark:bg-indigo-900/20",
  completed: "bg-emerald-50 dark:bg-emerald-900/20"
};

export function KanbanColumn({
  title,
  status,
  sponsorships,
  onAddSponsorship,
  onEditSponsorship,
  onViewSponsorship,
  onMoveSponsorship,
  onUpdate,
  onDelete
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <Card 
      ref={setNodeRef}
      className={cn(
        "kanban-column w-80 flex-shrink-0 transition-colors duration-200",
        statusColors[status],
        isOver && "ring-2 ring-primary ring-opacity-50 bg-accent/50"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-sm">{title}</h3>
            <Badge variant="secondary" className="text-xs">
              {sponsorships.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onAddSponsorship}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-3 p-3">
            {sponsorships.map((sponsorship) => (
              <SponsorshipCard
                key={sponsorship.id}
                sponsorship={sponsorship}
                onEdit={() => onEditSponsorship?.(sponsorship)}
                onView={() => onViewSponsorship?.(sponsorship)}
                onMove={() => onMoveSponsorship?.(sponsorship)}
                onUpdate={(data) => onUpdate?.(sponsorship.id, data)}
                onDelete={() => onDelete?.(sponsorship.id)}
              />
            ))}
            {sponsorships.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No hay acuerdos en esta etapa</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={onAddSponsorship}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar primero
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}