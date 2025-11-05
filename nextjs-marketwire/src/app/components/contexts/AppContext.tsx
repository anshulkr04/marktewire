'use client'

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react'
import { User, PageName, Watchlist, Company, Investor, FilterCategory, Sentiment, SavedItem, AnnouncementItem, MarketResultItem } from '../../lib/types'
import { FilterCategoriesData as initialFilterCategoriesData } from '../../lib/constants'
import { mockCompanies as staticMockCompanies, mockInvestors as staticMockInvestors, mockSavedItems, mockAnnouncements, mockMarketResults } from '../../lib/mockData'
import * as apiService from '../lib/api'
import { useRouter, usePathname } from 'next/navigation'

interface AppContextType {
  // Auth state
  token: string | null
  isAuthenticated: boolean
  currentUser: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, accountType: string) => Promise<void>
  logout: () => Promise<void>
  isLoadingAuth: boolean

  // Page state
  currentPage: PageName
  setCurrentPage: (page: PageName) => void

  // Data state
  watchlists: Watchlist[]
  setWatchlists: React.Dispatch<React.SetStateAction<Watchlist[]>>
  fetchUserWatchlists: () => Promise<void>
  createAppWatchlist: (name: string, apiCategory?: string) => Promise<Watchlist | null>
  deleteAppWatchlist: (watchlistId: string) => Promise<void>
  addIsinToAppWatchlist: (watchlistId: string, isin: string, apiCategory?: string) => Promise<Watchlist | null>
  removeIsinFromAppWatchlist: (watchlistId: string, isin: string) => Promise<Watchlist | null>
  bulkAddIsinsToAppWatchlist: (watchlistId: string, isins: string[], apiCategory?: string) => Promise<any>

  companies: Company[]
  investors: Investor[]
  setInvestors: React.Dispatch<React.SetStateAction<Investor[]>>

  // Filter states
  selectedWatchlistFilters: string[]
  setSelectedWatchlistFilters: React.Dispatch<React.SetStateAction<string[]>>
  selectedSentimentFilters: Sentiment[]
  setSelectedSentimentFilters: React.Dispatch<React.SetStateAction<Sentiment[]>>

  categoryFilters: FilterCategory[]
  showProceduralAdminNews: boolean
  setShowProceduralAdminNews: (show: boolean) => void

  isSelectAllCategoriesActive: boolean
  toggleSelectAllCategories: (selectAll: boolean) => void
  setSubCategoryChecked: (superCategoryName: string, subCategoryName: string, isChecked: boolean) => void
  removeCategoryFilterPill: (categoryNameToToggle: string, isCurrentlyAnExclusionPill: boolean) => void

  resetAllFilters: () => void

  // Sidebar visibility
  isSidebarOpen: boolean
  toggleSidebar: () => void

  // Saved Items Management
  savedItemsData: ReadonlyMap<string, SavedItem>
  isItemSaved: (originalItemId: string) => boolean
  getSavedItemDetails: (originalItemId: string) => SavedItem | undefined
  saveItem: (itemToSave: AnnouncementItem | MarketResultItem, notes?: string) => void
  unsaveItem: (originalItemId: string) => void
  updateItemNote: (originalItemId: string, newNotes: string) => void
  getItemNotes: (originalItemId: string) => string | undefined
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()

  const [token, setToken] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true)

  const [currentPage, setCurrentPage] = useState<PageName>('dashboard')
  const [watchlists, setWatchlists] = useState<Watchlist[]>([])
  const [companies] = useState<Company[]>(staticMockCompanies)
  const [investors, setInvestors] = useState<Investor[]>(staticMockInvestors)

  const [selectedWatchlistFilters, setSelectedWatchlistFilters] = useState<string[]>([])
  const [selectedSentimentFilters, setSelectedSentimentFilters] = useState<Sentiment[]>([])

  const [categoryFilters, setCategoryFilters] = useState<FilterCategory[]>(() => {
    return JSON.parse(JSON.stringify(initialFilterCategoriesData)).map((cat: FilterCategory) => ({
      ...cat,
      subCategories: cat.subCategories.map(sub => ({ ...sub, checked: false })),
      allChecked: false,
    }))
  })
  const [showProceduralAdminNews, setRawShowProceduralAdminNews] = useState<boolean>(false)
  const [isSelectAllCategoriesActive, setIsSelectAllCategoriesActive] = useState<boolean>(false)

  // Update current page based on pathname
  useEffect(() => {
    const pageMap: Record<string, PageName> = {
      '/dashboard': 'dashboard',
      '/watchlist': 'watchlist',
      '/announcements': 'announcements',
      '/market-data': 'market_data',
      '/saved': 'saved',
      '/smart-money': 'smart_money'
    }

    const matchedPage = Object.keys(pageMap).find(path => pathname.startsWith(path))
    if (matchedPage) {
      setCurrentPage(pageMap[matchedPage])
    }
  }, [pathname])

  // Initial auth check on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for token in document.cookie (server-side set cookies)
        const cookies = document.cookie.split(';')
        const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='))

        if (authCookie) {
          const tokenValue = authCookie.split('=')[1]
          setToken(tokenValue)

          // For now, create a mock user since we don't have real API
          const mockUser: User = {
            id: '1',
            email: 'user@example.com',
            name: 'Demo User',
            accountType: 'premium'
          }
          setCurrentUser(mockUser)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        // Clear invalid token
        document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        setToken(null)
        setCurrentUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoadingAuth(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoadingAuth(true)
    try {
      // Mock login for now
      const mockUser: User = {
        id: '1',
        email: email,
        name: 'Demo User',
        accountType: 'premium'
      }

      // Set token in httpOnly cookie via API call
      document.cookie = `auth-token=mock-token; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`
      setToken('mock-token')
      setCurrentUser(mockUser)
      setIsAuthenticated(true)

      router.push('/dashboard')
    } catch (error: any) {
      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      setToken(null)
      setCurrentUser(null)
      setIsAuthenticated(false)
      throw error
    } finally {
      setIsLoadingAuth(false)
    }
  }

  const register = async (email: string, password: string, accountType: string) => {
    setIsLoadingAuth(true)
    try {
      // Mock register for now
      const mockUser: User = {
        id: '1',
        email: email,
        name: 'Demo User',
        accountType: accountType as 'free' | 'premium'
      }

      document.cookie = `auth-token=mock-token; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`
      setToken('mock-token')
      setCurrentUser(mockUser)
      setIsAuthenticated(true)

      router.push('/dashboard')
    } catch (error: any) {
      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      setToken(null)
      setCurrentUser(null)
      setIsAuthenticated(false)
      throw error
    } finally {
      setIsLoadingAuth(false)
    }
  }

  const logout = async () => {
    try {
      // Mock logout
      console.log('Logging out...')
    } catch(error) {
      console.warn("Logout API call failed, proceeding with client-side logout:", error)
    } finally {
      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      setToken(null)
      setCurrentUser(null)
      setIsAuthenticated(false)
      setWatchlists([])
      router.push('/login')
    }
  }

  // Mock watchlist functions for now
  const fetchUserWatchlists = async () => {
    // Mock implementation
    setWatchlists([])
  }

  const createAppWatchlist = async (name: string, apiCategory?: string): Promise<Watchlist | null> => {
    // Mock implementation
    return null
  }

  const deleteAppWatchlist = async (watchlistId: string): Promise<void> => {
    // Mock implementation
  }

  const addIsinToAppWatchlist = async (watchlistId: string, isin: string, apiCategory?: string): Promise<Watchlist | null> => {
    // Mock implementation
    return null
  }

  const removeIsinFromAppWatchlist = async (watchlistId: string, isin: string): Promise<Watchlist | null> => {
    // Mock implementation
    return null
  }

  const bulkAddIsinsToAppWatchlist = async (watchlistId: string, isins: string[], apiCategory?: string): Promise<any> => {
    // Mock implementation
    return {}
  }

  // Filter functions (same as original)
  const toggleSelectAllCategories = useCallback((selectAll: boolean) => {
    setIsSelectAllCategoriesActive(selectAll)
    setCategoryFilters(prev =>
      prev.map(sc => ({
        ...sc,
        subCategories: sc.subCategories.map(sub => ({
          ...sub,
          checked: selectAll
        })),
        allChecked: selectAll
      }))
    )
    if (selectAll) {
      setRawShowProceduralAdminNews(false)
    }
  }, [])

  const setSubCategoryChecked = useCallback((superCategoryName: string, subCategoryName: string, isChecked: boolean) => {
    setCategoryFilters(prevFilters => {
      const newFilters = prevFilters.map(sc => {
        if (sc.name === superCategoryName) {
          const newSubCategories = sc.subCategories.map(sub =>
            sub.name.startsWith(subCategoryName.split(' (')[0]) ? { ...sub, checked: isChecked } : sub
          )
          const allSubInSuperChecked = newSubCategories.every(sub => sub.checked)
          return {
            ...sc,
            subCategories: newSubCategories,
            allChecked: allSubInSuperChecked,
          }
        }
        return sc
      })

      const allSubCategoriesGloballyChecked = newFilters.every(sc =>
        sc.subCategories.every(sub => sub.checked)
      )

      setIsSelectAllCategoriesActive(allSubCategoriesGloballyChecked)

      if (isChecked && showProceduralAdminNews) {
        setRawShowProceduralAdminNews(false)
      }

      return newFilters
    })
  }, [showProceduralAdminNews])

  const setShowProceduralAdminNews = useCallback((show: boolean) => {
    setRawShowProceduralAdminNews(show)
    if (show) {
      setIsSelectAllCategoriesActive(false)
      setCategoryFilters(prev =>
        prev.map(sc => ({
          ...sc,
          subCategories: sc.subCategories.map(sub => ({
            ...sub,
            checked: false
          })),
          allChecked: false
        }))
      )
    }
  }, [])

  const removeCategoryFilterPill = useCallback((categoryNameToToggle: string, isCurrentlyAnExclusionPill: boolean) => {
    setCategoryFilters(prevFilters => {
      const newFilters = prevFilters.map(sc => ({
        ...sc,
        subCategories: sc.subCategories.map(sub => {
          if (sub.name.startsWith(categoryNameToToggle)) {
            return { ...sub, checked: isCurrentlyAnExclusionPill }
          }
          return sub
        }),
      }))

      const allSubCategoriesGloballyChecked = newFilters.every(sc =>
        sc.subCategories.every(sub => sub.checked)
      )
      setIsSelectAllCategoriesActive(allSubCategoriesGloballyChecked)

      return newFilters.map(sc => ({
        ...sc,
        allChecked: sc.subCategories.every(sub => sub.checked)
      }))
    })
  }, [])

  // Saved Items Management (same as original)
  const [savedItemsData, setSavedItemsData] = useState<Map<string, SavedItem>>(() => {
    const initialMap = new Map<string, SavedItem>()
    mockSavedItems.forEach(item => {
      let fullContent: AnnouncementItem | MarketResultItem | { title: string; description: string }
      if (item.type === 'announcement') {
        fullContent = mockAnnouncements.find(ann => ann.id === item.id) || item.content
      } else if (item.type === 'market_data') {
        fullContent = mockMarketResults.find(mr => mr.id === item.id) || item.content
      } else {
        fullContent = item.content
      }
      initialMap.set(item.id, {...item, content: fullContent })
    })
    return initialMap
  })

  const isItemSaved = useCallback((originalItemId: string) => savedItemsData.has(originalItemId), [savedItemsData])
  const getSavedItemDetails = useCallback((originalItemId: string) => savedItemsData.get(originalItemId), [savedItemsData])
  const getItemNotes = useCallback((originalItemId: string): string | undefined => savedItemsData.get(originalItemId)?.notes, [savedItemsData])

  const saveItem = useCallback((itemToSave: AnnouncementItem | MarketResultItem, notes?: string) => {
    setSavedItemsData(prevMap => {
      const newMap = new Map(prevMap)
      const { id, date: eventDate } = itemToSave
      const type = 'aiSummary' in itemToSave ? 'announcement' : 'market_data'

      let priceChangeSinceEvent = "+0.0%"
      if (Math.random() > 0.5) priceChangeSinceEvent = `-${(Math.random() * 5).toFixed(1)}%`
      else priceChangeSinceEvent = `+${(Math.random() * 5).toFixed(1)}%`

      const newSavedItem: SavedItem = {
        id: id,
        type: type as 'announcement' | 'market_data',
        content: itemToSave,
        notes: notes,
        eventDate: eventDate,
        priceChangeSinceEvent: priceChangeSinceEvent,
        noteSavedDate: notes ? new Date().toISOString() : undefined,
        priceChangeSinceNoteSaved: notes ? (Math.random() > 0.5 ? `+${(Math.random() * 1).toFixed(1)}%` : `-${(Math.random()*1).toFixed(1)}%`) : undefined,
      }
      newMap.set(id, newSavedItem)
      return newMap
    })
  }, [])

  const unsaveItem = useCallback((originalItemId: string) => {
    setSavedItemsData(prevMap => {
      const newMap = new Map(prevMap)
      newMap.delete(originalItemId)
      return newMap
    })
  }, [])

  const updateItemNote = useCallback((originalItemId: string, newNotes: string) => {
    setSavedItemsData(prevMap => {
      const newMap = new Map(prevMap)
      const existingItem = newMap.get(originalItemId)
      if (existingItem) {
        const updatedItem: SavedItem = {
          ...existingItem,
          notes: newNotes,
          noteSavedDate: new Date().toISOString(),
          priceChangeSinceNoteSaved: Math.random() > 0.5 ? `+${(Math.random() * 1).toFixed(1)}%` : `-${(Math.random()*1).toFixed(1)}%`
        }
        newMap.set(originalItemId, updatedItem)
      }
      return newMap
    })
  }, [])

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)

  const resetAllFilters = () => {
    setSelectedWatchlistFilters([])
    setSelectedSentimentFilters([])
    setCategoryFilters(JSON.parse(JSON.stringify(initialFilterCategoriesData)).map((cat: FilterCategory) => ({
        ...cat,
        subCategories: cat.subCategories.map((sub: any) => ({ ...sub, checked: false })),
        allChecked: false,
    })))
    setRawShowProceduralAdminNews(false)
    setIsSelectAllCategoriesActive(false)
  }

  return (
    <AppContext.Provider value={{
        token,
        isAuthenticated,
        currentUser,
        login,
        register,
        logout,
        isLoadingAuth,
        currentPage,
        setCurrentPage,
        watchlists,
        setWatchlists,
        fetchUserWatchlists,
        createAppWatchlist,
        deleteAppWatchlist,
        addIsinToAppWatchlist,
        removeIsinFromAppWatchlist,
        bulkAddIsinsToAppWatchlist,
        companies,
        investors,
        setInvestors,
        selectedWatchlistFilters,
        setSelectedWatchlistFilters,
        selectedSentimentFilters,
        setSelectedSentimentFilters,
        categoryFilters,
        showProceduralAdminNews,
        setShowProceduralAdminNews,
        isSelectAllCategoriesActive,
        toggleSelectAllCategories,
        setSubCategoryChecked,
        removeCategoryFilterPill,
        resetAllFilters,
        isSidebarOpen,
        toggleSidebar,
        savedItemsData,
        isItemSaved,
        getSavedItemDetails,
        saveItem,
        unsaveItem,
        updateItemNote,
        getItemNotes,
      }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}