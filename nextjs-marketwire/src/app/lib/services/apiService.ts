
import axios from 'axios';
import { ApiUser, User, ApiWatchlistItem, Watchlist, ApiAnnouncement, AnnouncementItem, Company, ApiCompanySearchResult, StockPriceData, Sentiment } from '../types';

const API_BASE_URL = 'https://fin.anshulkr.com/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic request function
const request = async <T>(method: 'get' | 'post' | 'put' | 'delete', endpoint: string, data?: any, params?: any): Promise<T> => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      params,
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    let errorMessage = 'An unexpected API error occurred.';
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errData = error.response.data;
        if (errData && typeof errData.message === 'string') {
          errorMessage = errData.message;
        } else if (errData && typeof errData.error === 'string') {
          errorMessage = errData.error;
        } else if (errData && typeof errData === 'string' && errData.length > 0) {
          errorMessage = errData;
        } else if (error.response.statusText) {
          errorMessage = `API Error ${error.response.status}: ${error.response.statusText}`;
        } else {
          errorMessage = `API Error ${error.response.status}`;
        }
        console.error(`API Error on ${endpoint}: ${error.response.status}`, errData);
      } else if (error.request) {
        errorMessage = 'API request made but no response received. Check network or server.';
        console.error(`API Error on ${endpoint}: No response`, error.request);
      } else {
        errorMessage = error.message || 'Error setting up API request.';
        console.error(`API Error on ${endpoint}: Request setup error`, error.message);
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
      console.error(`Non-Axios Error on ${endpoint}:`, error);
    } else {
      console.error(`Unknown Error on ${endpoint}:`, error);
    }
    throw new Error(errorMessage); // Always throw an actual Error object
  }
};

// User Authentication
export const registerUser = async (userData: { email: any; password: any; account_type: any; }) => {
  return request<{ message: string; user_id: string; token: string }>('post', '/register', userData);
};

export const loginUser = async (credentials: { email: any; password: any; }) => {
  return request<{ message: string; token: string; user_id: string }>('post', '/login', credentials);
};

export const logoutUser = async () => {
  try {
    await request('post', '/logout');
  } catch (error) {
    console.warn("Logout API call failed or not configured for session invalidation on server:", error);
  }
};

export const getCurrentUser = async (): Promise<ApiUser> => {
  return request<ApiUser>('get', '/user');
};

export const updateUser = async (userData: Partial<ApiUser>) => {
  return request<ApiUser>('put', '/update_user', userData);
};

// Watchlists
export const fetchWatchlists = async (): Promise<{ watchlists: ApiWatchlistItem[] }> => {
  return request<{ watchlists: ApiWatchlistItem[] }>('get', '/watchlist');
};

export const createWatchlist = async (name: string, category?: string): Promise<ApiWatchlistItem> => {
  return request<ApiWatchlistItem>('post', '/watchlist', { operation: 'create', watchlistName: name, category });
};

export const addIsinToWatchlist = async (watchlistId: string, isin: string, category?: string): Promise<ApiWatchlistItem> => {
  return request<ApiWatchlistItem>('post', '/watchlist', { operation: 'add_isin', watchlist_id: watchlistId, isin, category });
};

export const bulkAddIsinsToWatchlist = async (watchlistId: string, isins: string[], category?: string): Promise<any> => {
  return request<any>('post', '/watchlist/bulk_add', { watchlist_id: watchlistId, isins, category });
};

export const removeIsinFromWatchlist = async (watchlistId: string, isin: string): Promise<{ message: string }> => {
  return request<{ message: string }>('delete', `/watchlist/${watchlistId}/isin/${isin}`);
};

export const deleteWatchlist = async (watchlistId: string): Promise<{ message: string }> => {
  return request<{ message: string }>('delete', `/watchlist/${watchlistId}`);
};

export const clearWatchlist = async (watchlistId: string): Promise<{ message: string }> => {
  return request<{ message: string }>('post', `/watchlist/${watchlistId}/clear`);
};


// Corporate Filings (Announcements)
interface FetchFilingsParams {
  start_date?: string;
  end_date?: string;
  category?: string;
  symbol?: string; 
  isin?: string; 
  limit?: number;
  offset?: number; 
  q?: string; 
}

export const fetchCorporateFilings = async (params: FetchFilingsParams): Promise<{ count: number; filings: ApiAnnouncement[] }> => {
  return request<{ count: number; filings: ApiAnnouncement[] }>('get', '/corporate_filings', undefined, params);
};

// Company Search
export const searchCompanies = async (query: string, limit: number = 10): Promise<{ count: number; companies: ApiCompanySearchResult[] }> => {
  return request<{ count: number; companies: ApiCompanySearchResult[] }>('get', '/company/search', undefined, { q: query, limit });
};


// Stock Price Data
export const fetchStockPrice = async (isin: string): Promise<StockPriceData[]> => {
    return request<StockPriceData[]>('get', '/stock_price', undefined, { isin });
};

// Helper to map ApiUser to frontend User
export const mapApiUserToUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser.UserID,
    email: apiUser.emailID,
    name: apiUser.emailID, 
    accountType: apiUser.AccountType,
  };
};

// Helper to map ApiWatchlistItem to frontend Watchlist
export const mapApiWatchlistItemToWatchlist = (apiItem: ApiWatchlistItem): Watchlist => {
  return {
    id: apiItem._id,
    name: apiItem.watchlistName,
    apiCategory: apiItem.category,
    isins: apiItem.isin || [],
    companies: [], 
    categories: apiItem.category ? [apiItem.category] : [], 
    superInvestors: [],
    isSmartAlerts: false, 
    alertPreference: 'no_alerts', 
  };
};

export const mapApiAnnouncementToAnnouncementItem = (apiAnn: ApiAnnouncement, companiesList: Company[]): AnnouncementItem => {
  let company: Company | undefined = companiesList.find(c => c.isin === (apiAnn.ISIN || apiAnn.isin) || c.ticker === (apiAnn.Symbol || apiAnn.symbol) );
  
  if (!company) {
    company = {
      id: apiAnn.ISIN || apiAnn.isin || apiAnn.corp_id || apiAnn.id, 
      name: apiAnn.companyname,
      ticker: apiAnn.Symbol || apiAnn.symbol || 'N/A',
      isin: apiAnn.ISIN || apiAnn.isin,
    };
  }

  let sentimentValue = Sentiment.Neutral;
  if (apiAnn.ai_summary) {
    const summaryLower = apiAnn.ai_summary.toLowerCase();
    if (summaryLower.includes("positive") || summaryLower.includes("strong") || summaryLower.includes("growth")) {
      sentimentValue = Sentiment.Positive;
    } else if (summaryLower.includes("negative") || summaryLower.includes("weak") || summaryLower.includes("decline") || summaryLower.includes("concern")) {
      sentimentValue = Sentiment.Negative;
    }
  }
  
  return {
    id: apiAnn.id,
    company: company,
    category: apiAnn.Category || apiAnn.category || 'Unknown',
    headline: apiAnn.summary, 
    sentiment: sentimentValue, 
    date: apiAnn.date,
    aiSummary: apiAnn.ai_summary,
    fileUrl: apiAnn.fileurl,
    isSaved: false, 
    notes: undefined, 
  };
};
