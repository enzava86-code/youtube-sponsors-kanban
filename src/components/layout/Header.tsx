"use client";

import { Search, Plus, Download, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
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
}

export function Header({ user, onNewDeal, onExportData, onCalendarView, onSearch, onCreateNew }: HeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6">
        {/* Logo y Navegación */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">YS</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">YouTube Sponsors</h1>
              <p className="text-xs text-muted-foreground">Gestión de Patrocinios</p>
            </div>
          </div>
        </div>

        {/* Barra de Búsqueda */}
        <div className="flex items-center space-x-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar acuerdos, marcas..."
              className="pl-10"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCalendarView}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendario
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onExportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button 
            size="sm"
            onClick={onCreateNew || onNewDeal}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Acuerdo
          </Button>

          {/* Perfil de Usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.split(' ').map(n => n[0]).join('') || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "Usuario"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.channelName || "Canal de YouTube"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "email@ejemplo.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Configuración de perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                Configuración de cuenta
              </DropdownMenuItem>
              <DropdownMenuItem>
                Notificaciones
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}