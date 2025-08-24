"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Clock, Target } from "lucide-react";
import { DashboardMetrics } from "@/types/sponsorship";

interface MetricsDashboardProps {
  metrics: DashboardMetrics;
}

export function MetricsDashboard({ metrics }: MetricsDashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const cards = [
    {
      title: "Acuerdos Activos",
      value: metrics.totalActiveDeals.toString(),
      icon: Target,
      description: "Total de patrocinios en progreso"
    },
    {
      title: "Ingresos del Mes",
      value: formatCurrency(metrics.monthlyRevenue),
      icon: DollarSign,
      description: "Ingresos generados este mes"
    },
    {
      title: "Acuerdos Pendientes",
      value: metrics.pendingDeals.toString(),
      icon: Clock,
      description: "Esperando respuesta del cliente"
    },
    {
      title: "Próximos Vencimientos",
      value: metrics.upcomingDeadlines.toString(),
      icon: TrendingUp,
      description: "Vencen en los próximos 7 días"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}