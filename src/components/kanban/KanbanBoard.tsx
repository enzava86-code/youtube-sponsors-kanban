"use client";

import React, { useState } from "react";
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

import { KanbanColumn } from "./KanbanColumn";
import { Sponsorship, SponsorshipStatus, KanbanColumn as ColumnType } from "@/types/sponsorship";

interface KanbanBoardProps {
  sponsorships: Sponsorship[];
  onAddSponsorship?: (status?: SponsorshipStatus) => void;
  onEditSponsorship?: (sponsorship: Sponsorship) => void;
  onViewSponsorship?: (sponsorship: Sponsorship) => void;
  onMoveSponsorship?: (sponsorship: Sponsorship, newStatus: SponsorshipStatus) => void;
  onStatusChange?: (id: string, newStatus: SponsorshipStatus) => Promise<void>;
  onUpdate?: (id: string, data: Partial<Sponsorship>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const columns: ColumnType[] = [
  {
    id: 'prospect',
    title: 'Prospecto',
    description: 'Marcas identificadas como potenciales patrocinadores',
    color: 'gray',
    order: 1
  },
  {
    id: 'initial_contact',
    title: 'Contacto Inicial',
    description: 'Primer contacto realizado con la marca',
    color: 'blue',
    order: 2
  },
  {
    id: 'negotiation',
    title: 'Negociación',
    description: 'Discusión de términos y condiciones',
    color: 'yellow',
    order: 3
  },
  {
    id: 'proposal_sent',
    title: 'Propuesta Enviada',
    description: 'Propuesta formal enviada y pendiente de respuesta',
    color: 'orange',
    order: 4
  },
  {
    id: 'contract_signed',
    title: 'Contrato Firmado',
    description: 'Acuerdo formalizado y listo para producción',
    color: 'green',
    order: 5
  },
  {
    id: 'content_production',
    title: 'Contenido en Producción',
    description: 'Creación y edición del contenido patrocinado',
    color: 'purple',
    order: 6
  },
  {
    id: 'client_review',
    title: 'Revisión del Cliente',
    description: 'Cliente revisando el contenido antes de publicación',
    color: 'pink',
    order: 7
  },
  {
    id: 'published',
    title: 'Publicado',
    description: 'Contenido publicado en el canal',
    color: 'indigo',
    order: 8
  },
  {
    id: 'completed',
    title: 'Completado',
    description: 'Patrocinio finalizado y pagado',
    color: 'emerald',
    order: 9
  }
];

export function KanbanBoard({
  sponsorships,
  onAddSponsorship,
  onEditSponsorship,
  onViewSponsorship,
  onMoveSponsorship,
  onStatusChange,
  onUpdate,
  onDelete
}: KanbanBoardProps) {
  const [, setActiveId] = useState<string | null>(null);
  const [localSponsorships, setLocalSponsorships] = useState(sponsorships);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getSponsorshipsByStatus = (status: SponsorshipStatus) => {
    return localSponsorships.filter(sponsorship => sponsorship.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the sponsorship being dragged
    const activeSponsorshipIndex = localSponsorships.findIndex(s => s.id === activeId);
    const activeSponsorship = localSponsorships[activeSponsorshipIndex];

    if (!activeSponsorship) {
      setActiveId(null);
      return;
    }

    // Check if dropped on a column (overId will be a status string)
    const targetColumn = columns.find(col => col.id === overId);
    if (targetColumn && activeSponsorship.status !== targetColumn.id) {
      // Update local state
      const updatedSponsorships = [...localSponsorships];
      updatedSponsorships[activeSponsorshipIndex] = {
        ...activeSponsorship,
        status: targetColumn.id
      };
      setLocalSponsorships(updatedSponsorships);

      // Call parent handler
      onStatusChange?.(activeId, targetColumn.id);
    }

    setActiveId(null);
  };

  // Update local state when props change
  React.useEffect(() => {
    setLocalSponsorships(sponsorships);
  }, [sponsorships]);

  return (
    <div className="w-full h-full">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full overflow-x-auto">
          <div className="flex space-x-4 p-4 min-w-max">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                title={column.title}
                status={column.id}
                sponsorships={getSponsorshipsByStatus(column.id)}
                onAddSponsorship={() => onAddSponsorship?.(column.id)}
                onEditSponsorship={onEditSponsorship}
                onViewSponsorship={onViewSponsorship}
                onMoveSponsorship={(sponsorship) => onMoveSponsorship?.(sponsorship, column.id)}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
}