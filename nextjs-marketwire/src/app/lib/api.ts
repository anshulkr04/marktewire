// Basic API service for Next.js application
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://fin.anshul.com/api'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  email: string
  password: string
  account_type: string
}

interface ApiUser {
  id: string
  email: string
  name: string
}

interface User {
  id: string
  email: string
  name: string
}

interface ApiWatchlist {
  id: string
  name: string
  isins: string[]
}

interface Watchlist {
  id: string
  name: string
  isins: string[]
}

class ApiService {
  private getToken(): string | null {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split(';')
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='))
    return authCookie ? authCookie.split('=')[1] : null
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken()
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async loginUser(credentials: LoginCredentials): Promise<{ token: string }> {
    return this.request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async registerUser(credentials: RegisterCredentials): Promise<{ token: string }> {
    return this.request<{ token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async logoutUser(): Promise<void> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    })
  }

  async getCurrentUser(): Promise<ApiUser> {
    return this.request<ApiUser>('/user/me')
  }

  async fetchWatchlists(): Promise<{ watchlists: ApiWatchlist[] }> {
    return this.request<{ watchlists: ApiWatchlist[] }>('/watchlists')
  }

  async createWatchlist(name: string, apiCategory?: string): Promise<ApiWatchlist> {
    return this.request<ApiWatchlist>('/watchlists', {
      method: 'POST',
      body: JSON.stringify({ name, category: apiCategory }),
    })
  }

  async deleteWatchlist(watchlistId: string): Promise<void> {
    return this.request<void>(`/watchlists/${watchlistId}`, {
      method: 'DELETE',
    })
  }

  async addIsinToWatchlist(watchlistId: string, isin: string, apiCategory?: string): Promise<ApiWatchlist> {
    return this.request<ApiWatchlist>(`/watchlists/${watchlistId}/items`, {
      method: 'POST',
      body: JSON.stringify({ isin, category: apiCategory }),
    })
  }

  async removeIsinFromWatchlist(watchlistId: string, isin: string): Promise<void> {
    return this.request<void>(`/watchlists/${watchlistId}/items/${isin}`, {
      method: 'DELETE',
    })
  }

  async bulkAddIsinsToWatchlist(watchlistId: string, isins: string[], apiCategory?: string): Promise<{ watchlist?: ApiWatchlist }> {
    return this.request<{ watchlist?: ApiWatchlist }>(`/watchlists/${watchlistId}/items/bulk`, {
      method: 'POST',
      body: JSON.stringify({ isins, category: apiCategory }),
    })
  }

  mapApiUserToUser(apiUser: ApiUser): User {
    return {
      id: apiUser.id,
      email: apiUser.email,
      name: apiUser.name,
    }
  }

  mapApiWatchlistItemToWatchlist(apiWatchlist: ApiWatchlist): Watchlist {
    return {
      id: apiWatchlist.id,
      name: apiWatchlist.name,
      isins: apiWatchlist.isins,
    }
  }
}

export const apiService = new ApiService()
export * from './api'