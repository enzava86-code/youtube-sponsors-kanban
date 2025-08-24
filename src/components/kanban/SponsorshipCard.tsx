"use client";

import { MoreHorizontal, Eye, Edit, Move, Calendar, DollarSign, Paperclip, Trash } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Alert } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sponsorship } from "@/types/sponsorship";
import { cn } from "@/lib/utils";
import { format, isAfter, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

interface SponsorshipCardProps {
  sponsorship: Sponsorship;
  onView?: () => void;
  onMove?: () => void;
  onUpdate?: (data: Partial<Sponsorship>) => void;
  onDelete?: () => void;
}

const priorityColors = {
  low: "border-l-green-500 bg-green-50/50 dark:bg-green-900/10",
  medium: "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10",
  high: "border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10",
  urgent: "border-l-red-500 bg-red-50/50 dark:bg-red-900/10"
};

const priorityLabels = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente"
};

const contentTypeLabels = {
  video: "Video",
  short: "Short",
  stream: "Stream",
  community_post: "Post",
  integration: "Integración",
  mention: "Mención"
};

export function SponsorshipCard({ sponsorship, onView, onMove, onUpdate, onDelete }: SponsorshipCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: sponsorship.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  };

  const isOverdue = isAfter(new Date(), sponsorship.deliveryDate);
  const daysUntilDeadline = differenceInDays(sponsorship.deliveryDate, new Date());
  const isApproachingDeadline = daysUntilDeadline <= 3 && daysUntilDeadline >= 0;

  return (
    <TooltipProvider>
      <Card 
        ref={setNodeRef}
        style={style}
        className={cn(
          "kanban-card border-l-4 cursor-grab active:cursor-grabbing transition-shadow duration-200",
          priorityColors[sponsorship.priority],
          isDragging && "shadow-2xl opacity-50 rotate-3 scale-105 z-50"
        )}
        {...listeners}
        {...attributes}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarImage src={sponsorship.brandLogo} alt={sponsorship.brandName} />
                <AvatarFallback className="text-xs">
                  {sponsorship.brandName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-sm truncate">{sponsorship.brandName}</h4>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 flex-shrink-0"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onView}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate?.({})}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onMove}>
                  <Move className="mr-2 h-4 w-4" />
                  Mover a...
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  <Trash className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Título del acuerdo */}
          <div>
            <p className="font-medium text-sm leading-tight">{sponsorship.title}</p>
          </div>

          {/* Tipo de contenido y monto */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {contentTypeLabels[sponsorship.type]}
            </Badge>
            <div className="flex items-center text-sm font-medium">
              <DollarSign className="h-3 w-3 mr-1" />
              {formatCurrency(sponsorship.monetaryValue, sponsorship.currency)}
            </div>
          </div>

          {/* Fecha de entrega */}
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              {format(sponsorship.deliveryDate, "d 'de' MMMM", { locale: es })}
            </span>
          </div>

          {/* Alertas de vencimiento */}
          {isOverdue && (
            <Alert className="py-2 px-3 bg-destructive/10 border-destructive/20">
              <div className="flex items-center space-x-2">
                <Calendar className="h-3 w-3 text-destructive" />
                <span className="text-xs text-destructive font-medium">
                  Vencido hace {Math.abs(daysUntilDeadline)} días
                </span>
              </div>
            </Alert>
          )}

          {isApproachingDeadline && !isOverdue && (
            <Alert className="py-2 px-3 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-2">
                <Calendar className="h-3 w-3 text-orange-600" />
                <span className="text-xs text-orange-600 font-medium">
                  Vence en {daysUntilDeadline} días
                </span>
              </div>
            </Alert>
          )}

          {/* Barra de progreso si aplica */}
          {sponsorship.progressPercentage !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-medium">{sponsorship.progressPercentage}%</span>
              </div>
              <Progress value={sponsorship.progressPercentage} className="h-1" />
            </div>
          )}

          {/* Prioridad */}
          <div className="flex items-center justify-between">
            <Badge 
              variant={sponsorship.priority === 'urgent' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {priorityLabels[sponsorship.priority]}
            </Badge>
          </div>

          {/* Footer con contacto y archivos */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-2">
              <Avatar className="h-4 w-4">
                <AvatarFallback className="text-xs">
                  {sponsorship.contactPerson.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate max-w-20">
                {sponsorship.contactPerson}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {sponsorship.attachments && sponsorship.attachments.length > 0 && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Paperclip className="h-3 w-3" />
                      <span className="text-xs">{sponsorship.attachments.length}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{sponsorship.attachments.length} archivos adjuntos</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {sponsorship.lastActivity && (
                <Tooltip>
                  <TooltipTrigger>
                    <span className="text-xs text-muted-foreground">
                      {format(sponsorship.lastActivity, "d/M", { locale: es })}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Última actualización: {format(sponsorship.lastActivity, "d 'de' MMMM 'a las' HH:mm", { locale: es })}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}