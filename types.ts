
export interface ApiUser {
  UserID: string;
  emailID: string;
  Phone_Number?: string;
  Paid: 'true' | 'false';
  AccountType: 'free' | 'premium' | string; // Allow string for flexibility if API returns other values
  AccessToken?: string; 
  WatchListID?: string[]; // Assuming array of watchlist IDs
}

export interface User {
  id: string; // From ApiUser.UserID
  email: string; // From ApiUser.emailID
  name: string; // Derived from email or could be a separate field if API supports it
  accountType: 'free' | 'premium' | string; // From ApiUser.AccountType
  avatarUrl?: string; // Kept for potential future use or placeholder
}

export enum Sentiment {
  Positive = 'Positive',
  Negative = 'Negative',
  Neutral = 'Neutral',
}

export interface Company {
  id: string; // Can be ISIN or internal ID
  name: string;
  ticker: string; // NSE/BSE code
  isin?: string; // Explicit ISIN
}

export interface ApiCompanySearchResult {
  newname: string;
  oldname?: string;
  newnsecode?: string;
  oldnsecode?: string;
  newbsecode?: string;
  oldbsecode?: string;
  isin: string;
}


export interface AnnouncementItem {
  id: string; // API's filing ID
  company: Company; // Constructed from API data (companyname, symbol, isin)
  category: string; // API's Category
  headline: string; // API's summary or parsed from ai_summary
  sentiment: Sentiment; // May remain client-side or parsed
  date: string; // API's date
  isSaved?: boolean; 
  aiSummary?: string; // API's ai_summary
  notes?: string;
  fileUrl?: string; // From API's fileurl
}

export interface ApiAnnouncement {
  id: string;
  Symbol?: string; // Note: API returns both Symbol and symbol
  symbol?: string;
  ISIN?: string;   // Note: API returns both ISIN and isin
  isin?: string;
  Category?: string; // Note: API returns both Category and category
  category?: string;
  summary: string;
  ai_summary?: string;
  date: string; // ISO Date string
  companyname: string;
  corp_id?: string;
  fileurl?: string;
}


export interface MarketResultItem {
  id: string;
  company: Company;
  aiHeadline: string;
  revenue: string;
  netProfit: string;
  eps: string;
  date: string; 
  isSaved?: boolean;
  notes?: string;
}

export interface Investor {
  id: string;
  name: string;
  isFollowed: boolean; 
}

export type AlertPreference = 'smart_alerts' | 'daily_summary' | 'no_alerts';

// API structure for a watchlist item
export interface ApiWatchlistItem {
  _id: string; // watchlist_id
  watchlistName: string;
  category: string; // Single category string for the watchlist
  isin: string[]; // Array of ISIN strings
  userid?: string; // User ID this watchlist belongs to
}

// Frontend Watchlist type
export interface Watchlist {
  id: string; // maps to _id
  name: string; // maps to watchlistName
  apiCategory?: string; // maps to API's single 'category'
  isins: string[]; // maps to API's 'isin' array

  // --- Client-side properties for enhanced filtering/UI ---
  // These are not directly persisted to the backend via the current watchlist API structure,
  // but can be used by the client to manage extended preferences.
  companies?: string[]; // List of company IDs (if different from ISINs, e.g. for mock data compatibility)
                        // Or, this could be derived client-side by mapping ISINs to Company objects.
  categories?: string[]; // For filtering announcements: client-side selection of multiple sub-categories
  superInvestors?: string[]; // investor IDs: client-side
  isSmartAlerts?: boolean; // client-side flag
  alertPreference: AlertPreference; // Primarily client-side, could influence notifications if backend supports it via user profile
}


export interface SavedItem {
  id: string; 
  type: 'announcement' | 'market_data' | 'other';
  content: AnnouncementItem | MarketResultItem | { title: string; description: string };
  notes?: string;
  eventDate: string; 
  priceChangeSinceEvent?: string; 
  noteSavedDate?: string; 
  priceChangeSinceNoteSaved?: string; 
}

export interface FilterCategory { 
  name: string; 
  subCategories: { name: string; count: number; checked?: boolean }[]; 
  allChecked?: boolean; 
  expanded?: boolean;
}

export type PageName = 'dashboard' | 'saved' | 'watchlist' | 'announcements' | 'market_data' | 'smart_money' | 'not_found' | 'login' | 'register';

export interface CorporateAction {
  id: string;
  companyName: string;
  actionType: string;
  details: string;
  date: string;
}

export interface KeyDocument {
  id: string;
  companyName: string;
  documentType: string;
  title: string;
  date: string;
  url: string;
}

export interface SmartMoneyActivity {
  id: string;
  investorName: string;
  activity: string;
  date: string;
}

// For stock price API
export interface StockPriceData {
  close: number;
  date: string; // YYYY-MM-DD
}
