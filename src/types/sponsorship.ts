export interface Sponsorship {
  id: string;
  title: string;
  brandName: string;
  brandLogo?: string;
  contactPerson: string;
  contactEmail: string;
  type: ContentType;
  description?: string;
  category: string;
  monetaryValue: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  startDate?: Date;
  deliveryDate: Date;
  publishDate?: Date;
  isFlexiblePublishDate?: boolean;
  status: SponsorshipStatus;
  priority: Priority;
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
  lastActivity?: Date;
  progressPercentage?: number;
}

export type SponsorshipStatus = 
  | 'prospect'
  | 'initial_contact'
  | 'negotiation'
  | 'proposal_sent'
  | 'contract_signed'
  | 'content_production'
  | 'client_review'
  | 'published'
  | 'completed';

export type ContentType = 
  | 'video'
  | 'short'
  | 'stream'
  | 'community_post'
  | 'integration'
  | 'mention';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';

export type PaymentMethod = 'paypal' | 'bank_transfer' | 'wise' | 'stripe' | 'crypto';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface KanbanColumn {
  id: SponsorshipStatus;
  title: string;
  description: string;
  color: string;
  order: number;
}

export interface DashboardMetrics {
  totalActiveDeals: number;
  monthlyRevenue: number;
  pendingDeals: number;
  upcomingDeadlines: number;
  averageDealValue: number;
  conversionRate: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  channelName: string;
  avatar?: string;
  subscriberCount?: number;
  verified: boolean;
}

export interface CreateSponsorshipData {
  title: string;
  brandName: string;
  contactPerson: string;
  contactEmail: string;
  type: ContentType;
  description?: string;
  category: string;
  monetaryValue: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  startDate?: Date;
  deliveryDate: Date;
  publishDate?: Date;
  isFlexiblePublishDate?: boolean;
  initialStatus: SponsorshipStatus;
  priority: Priority;
  notes?: string;
}

export interface FilterOptions {
  status?: SponsorshipStatus[];
  priority?: Priority[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  minValue?: number;
  maxValue?: number;
  currency?: Currency;
  search?: string;
}

export interface SortOptions {
  field: keyof Sponsorship;
  direction: 'asc' | 'desc';
}