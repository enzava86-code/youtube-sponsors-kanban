"use client";

import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { MetricsDashboard } from "@/components/metrics/MetricsDashboard";
import { CreateSponsorshipModal } from "@/components/modals/CreateSponsorshipModal";
import { Sponsorship, SponsorshipStatus, DashboardMetrics, CreateSponsorshipData } from "@/types/sponsorship";

// Sample data
const sampleSponsorships: Sponsorship[] = [
  {
    id: "1",
    title: "Integración de Producto Tech",
    brandName: "TechCorp",
    brandLogo: "",
    contactPerson: "Ana García",
    contactEmail: "ana@techcorp.com",
    type: "integration",
    category: "tecnología",
    description: "Demostración del nuevo gadget tech en video principal",
    monetaryValue: 1500,
    currency: "EUR",
    status: "prospect",
    priority: "high",
    deliveryDate: new Date("2024-12-15"),
    startDate: new Date("2024-11-01"),
    publishDate: new Date("2024-12-20"),
    paymentMethod: "bank_transfer",
    progressPercentage: 0,
    notes: "Cliente potencial muy interesado",
    lastActivity: new Date("2024-11-10"),
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-11-10")
  },
  {
    id: "2",
    title: "Review Gaming Headset",
    brandName: "SoundMax",
    brandLogo: "",
    contactPerson: "Carlos Ruiz",
    contactEmail: "carlos@soundmax.com",
    type: "video",
    category: "gaming",
    description: "Review completo de los nuevos auriculares gaming",
    monetaryValue: 800,
    currency: "EUR",
    status: "negotiation",
    priority: "medium",
    deliveryDate: new Date("2024-11-25"),
    startDate: new Date("2024-10-15"),
    publishDate: new Date("2024-11-30"),
    paymentMethod: "paypal",
    progressPercentage: 30,
    notes: "Negociando condiciones de entrega",
    lastActivity: new Date("2024-11-08"),
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-11-08")
  },
  {
    id: "3",
    title: "Campaña Lifestyle Brand",
    brandName: "UrbanStyle",
    brandLogo: "",
    contactPerson: "María López",
    contactEmail: "maria@urbanstyle.com",
    type: "short",
    category: "lifestyle",
    description: "Serie de shorts promocionando la nueva colección",
    monetaryValue: 2200,
    currency: "EUR",
    status: "content_production",
    priority: "high",
    deliveryDate: new Date("2024-11-20"),
    startDate: new Date("2024-10-01"),
    publishDate: new Date("2024-11-25"),
    paymentMethod: "bank_transfer",
    progressPercentage: 75,
    notes: "Contenido en fase final de edición",
    lastActivity: new Date("2024-11-09"),
    createdAt: new Date("2024-09-15"),
    updatedAt: new Date("2024-11-09")
  }
];

const sampleMetrics: DashboardMetrics = {
  totalActiveDeals: 3,
  monthlyRevenue: 4500,
  pendingDeals: 2,
  upcomingDeadlines: 1,
  averageDealValue: 1500,
  conversionRate: 0.65
};

export default function Home() {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>(sampleSponsorships);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser] = useState({
    id: "user1",
    name: "Canal Creator",
    email: "creator@example.com",
    channelName: "Canal Creator",
    avatar: "",
    subscriberCount: 50000,
    verified: true
  });

  const handleAddSponsorship = () => {
    setShowCreateModal(true);
  };

  const handleEditSponsorship = (sponsorship: Sponsorship) => {
    console.log("Edit sponsorship:", sponsorship);
  };

  const handleViewSponsorship = (sponsorship: Sponsorship) => {
    console.log("View sponsorship:", sponsorship);
  };

  const handleMoveSponsorship = (sponsorship: Sponsorship, newStatus: SponsorshipStatus) => {
    setSponsorships(prev => 
      prev.map(s => 
        s.id === sponsorship.id 
          ? { ...s, status: newStatus, lastActivity: new Date() }
          : s
      )
    );
  };

  const handleCreateSponsorship = (data: CreateSponsorshipData) => {
    const newSponsorship: Sponsorship = {
      id: Date.now().toString(),
      title: data.title,
      brandName: data.brandName,
      contactPerson: data.contactPerson,
      contactEmail: data.contactEmail,
      type: data.type,
      description: data.description,
      category: data.category,
      monetaryValue: data.monetaryValue,
      currency: data.currency,
      paymentMethod: data.paymentMethod,
      startDate: data.startDate,
      deliveryDate: data.deliveryDate,
      publishDate: data.publishDate,
      isFlexiblePublishDate: data.isFlexiblePublishDate,
      status: data.initialStatus,
      priority: data.priority,
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActivity: new Date()
    };
    setSponsorships(prev => [...prev, newSponsorship]);
    setShowCreateModal(false);
  };

  const handleExportData = () => {
    console.log("Export data");
  };

  const handleCalendarView = () => {
    console.log("Calendar view");
  };

  return (
    <Layout 
      user={currentUser}
      onNewDeal={handleAddSponsorship}
      onExportData={handleExportData}
      onCalendarView={handleCalendarView}
    >
      <div className="space-y-6">
        <MetricsDashboard metrics={sampleMetrics} />
        
        <KanbanBoard
          sponsorships={sponsorships}
          onAddSponsorship={handleAddSponsorship}
          onEditSponsorship={handleEditSponsorship}
          onViewSponsorship={handleViewSponsorship}
          onMoveSponsorship={handleMoveSponsorship}
        />
      </div>

      <CreateSponsorshipModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSponsorship}
      />
    </Layout>
  );
}