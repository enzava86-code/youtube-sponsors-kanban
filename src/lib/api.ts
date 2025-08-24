import { Sponsorship, CreateSponsorshipData, SponsorshipStatus } from '@/types/sponsorship'

const API_BASE_URL = '/api'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchWithError(url: string, options?: RequestInit): Promise<Response> {
  const response = await fetch(url, options)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(response.status, errorData.error || 'Request failed')
  }
  
  return response
}

export const sponsorshipApi = {
  // Get all sponsorships
  async getAll(): Promise<Sponsorship[]> {
    const response = await fetchWithError(`${API_BASE_URL}/sponsorships`)
    return response.json()
  },

  // Get single sponsorship
  async getById(id: string): Promise<Sponsorship> {
    const response = await fetchWithError(`${API_BASE_URL}/sponsorships/${id}`)
    return response.json()
  },

  // Create new sponsorship
  async create(data: CreateSponsorshipData): Promise<Sponsorship> {
    const response = await fetchWithError(`${API_BASE_URL}/sponsorships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Update sponsorship
  async update(id: string, data: Partial<Sponsorship>): Promise<Sponsorship> {
    const response = await fetchWithError(`${API_BASE_URL}/sponsorships/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Update sponsorship status (for drag & drop)
  async updateStatus(id: string, status: SponsorshipStatus): Promise<Sponsorship> {
    const response = await fetchWithError(`${API_BASE_URL}/sponsorships/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
    return response.json()
  },

  // Delete sponsorship
  async delete(id: string): Promise<void> {
    await fetchWithError(`${API_BASE_URL}/sponsorships/${id}`, {
      method: 'DELETE',
    })
  },
}

// Loading states and cache management
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export function createLoadingState(): LoadingState {
  return {
    isLoading: false,
    error: null,
  }
}