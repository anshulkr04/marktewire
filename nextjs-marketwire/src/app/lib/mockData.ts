// Basic mock data for Next.js application
export const mockCompanies = [
  { id: '1', name: 'Apple Inc.', symbol: 'AAPL', sector: 'Technology' },
  { id: '2', name: 'Microsoft Corp.', symbol: 'MSFT', sector: 'Technology' },
  { id: '3', name: 'Tesla Inc.', symbol: 'TSLA', sector: 'Automotive' },
  { id: '4', name: 'Amazon.com Inc.', symbol: 'AMZN', sector: 'E-commerce' },
  { id: '5', name: 'Alphabet Inc.', symbol: 'GOOGL', sector: 'Technology' }
]

export const mockInvestors = [
  { id: '1', name: 'Vanguard Group', type: 'Institutional' },
  { id: '2', name: 'BlackRock', type: 'Institutional' },
  { id: '3', name: 'Fidelity Investments', type: 'Institutional' },
  { id: '4', name: 'Warren Buffett', type: 'Individual' },
  { id: '5', name: 'Cathie Wood', type: 'Individual' }
]

export const mockSavedItems = [
  {
    id: '1',
    type: 'announcement' as const,
    content: { title: 'Sample Announcement', description: 'This is a sample announcement' },
    notes: 'Interesting analysis',
    eventDate: '2024-01-15'
  }
]

export const mockAnnouncements = [
  {
    id: '1',
    title: 'Sample Announcement',
    description: 'This is a sample announcement',
    date: '2024-01-15'
  }
]

export const mockMarketResults = [
  {
    id: '1',
    title: 'Sample Market Data',
    description: 'This is sample market data',
    date: '2024-01-15'
  }
]