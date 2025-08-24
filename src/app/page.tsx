"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { MetricsDashboard } from "@/components/metrics/MetricsDashboard";
import { CreateSponsorshipModal } from "@/components/modals/CreateSponsorshipModal";
import { Sponsorship, SponsorshipStatus, DashboardMetrics, CreateSponsorshipData, User } from "@/types/sponsorship";
import { sponsorshipApi, LoadingState, createLoadingState } from "@/lib/api";
import { toast } from "sonner";

// Sample user data
const currentUser: User = {
  id: "user1",
  name: "Alex Creador",
  email: "alex@canal.com",
  channelName: "Canal Tech ES",
  avatar: "",
  subscriberCount: 125000,
  verified: true
};

export default function HomePage() {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(createLoadingState());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Load sponsorships from API
  useEffect(() => {
    loadSponsorships();
  }, []);

  const loadSponsorships = async () => {
    setLoadingState({ isLoading: true, error: null });
    try {
      const data = await sponsorshipApi.getAll();
      setSponsorships(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar datos';
      setLoadingState({ isLoading: false, error: errorMessage });
      toast.error("Error al cargar los patrocinios");
    } finally {
      setLoadingState({ isLoading: false, error: null });
    }
  };

  const handleStatusChange = async (id: string, newStatus: SponsorshipStatus) => {
    try {
      const updatedSponsorship = await sponsorshipApi.updateStatus(id, newStatus);
      
      setSponsorships(prev => prev.map(s => 
        s.id === id ? updatedSponsorship : s
      ));
      
      toast.success("Estado actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el estado");
      console.error('Error updating status:', error);
    }
  };

  const handleCreateSponsorship = async (data: CreateSponsorshipData) => {
    try {
      const newSponsorship = await sponsorshipApi.create(data);
      setSponsorships(prev => [newSponsorship, ...prev]);
      setIsCreateModalOpen(false);
      toast.success("Patrocinio creado correctamente");
    } catch (error) {
      toast.error("Error al crear el patrocinio");
      console.error('Error creating sponsorship:', error);
    }
  };

  const handleUpdateSponsorship = async (id: string, data: Partial<Sponsorship>) => {
    try {
      const updatedSponsorship = await sponsorshipApi.update(id, data);
      setSponsorships(prev => prev.map(s => 
        s.id === id ? updatedSponsorship : s
      ));
      toast.success("Patrocinio actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el patrocinio");
      console.error('Error updating sponsorship:', error);
    }
  };

  const handleDeleteSponsorship = async (id: string) => {
    try {
      await sponsorshipApi.delete(id);
      setSponsorships(prev => prev.filter(s => s.id !== id));
      toast.success("Patrocinio eliminado correctamente");
    } catch (error) {
      toast.error("Error al eliminar el patrocinio");
      console.error('Error deleting sponsorship:', error);
    }
  };

  // Calculate metrics
  const calculateMetrics = (): DashboardMetrics => {
    const activeDeals = sponsorships.filter(s => 
      !['completed', 'prospect'].includes(s.status)
    ).length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyRevenue = sponsorships
      .filter(s => {
        const deliveryDate = new Date(s.deliveryDate);
        return deliveryDate.getMonth() === currentMonth && 
               deliveryDate.getFullYear() === currentYear &&
               s.status === 'completed';
      })
      .reduce((sum, s) => sum + s.monetaryValue, 0);

    const pendingDeals = sponsorships.filter(s => 
      ['proposal_sent', 'negotiation'].includes(s.status)
    ).length;

    const upcomingDeadlines = sponsorships.filter(s => {
      const deadline = new Date(s.deliveryDate);
      const now = new Date();
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0 && s.status !== 'completed';
    }).length;

    const totalValue = sponsorships.reduce((sum, s) => sum + s.monetaryValue, 0);
    const averageDealValue = sponsorships.length > 0 ? totalValue / sponsorships.length : 0;

    const completedDeals = sponsorships.filter(s => s.status === 'completed').length;
    const totalProspects = sponsorships.filter(s => s.status === 'prospect').length;
    const conversionRate = totalProspects > 0 ? (completedDeals / (completedDeals + totalProspects)) * 100 : 0;

    return {
      totalActiveDeals: activeDeals,
      monthlyRevenue,
      pendingDeals,
      upcomingDeadlines,
      averageDealValue,
      conversionRate
    };
  };

  // Filter sponsorships based on search term
  const filteredSponsorships = sponsorships.filter(sponsorship =>
    sponsorship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sponsorship.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sponsorship.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loadingState.isLoading) {
    return (
      <Layout user={currentUser}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-youtube-red mx-auto mb-4"></div>
            <p>Cargando patrocinios...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loadingState.error) {
    return (
      <Layout user={currentUser}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error: {loadingState.error}</p>
            <button 
              onClick={loadSponsorships}
              className="px-4 py-2 bg-youtube-red text-white rounded-lg hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      user={currentUser}
      onSearch={setSearchTerm}
      onCreateNew={() => setIsCreateModalOpen(true)}
    >
      <div className="space-y-6">
        <MetricsDashboard metrics={calculateMetrics()} />
        
        <KanbanBoard
          sponsorships={filteredSponsorships}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteSponsorship}
        />
        
        <CreateSponsorshipModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSponsorship}
        />
      </div>
    </Layout>
  );
}