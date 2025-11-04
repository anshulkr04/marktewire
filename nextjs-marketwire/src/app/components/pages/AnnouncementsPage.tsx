
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AnnouncementItem, Sentiment, Company, ApiAnnouncement } from '../types';
import Pagination from '../components/ui/Pagination';
import { 
    IconBookmark, IconBookmarkFilled, IconFilterFilled, IconX, 
    IconShare, IconDownload, IconCalendar, IconExternalLink, IconRefresh
} from '../constants';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/ui/Button';
import MarketInsightsFunnel from '../components/layout/MarketInsightsFunnel'; 
import * as apiService from '../services/apiService';

const ITEMS_PER_PAGE = 10;

type DateFilterType = 'today' | '7days' | '30days' | 'custom';

const SentimentDot: React.FC<{ sentiment: Sentiment }> = ({ sentiment }) => {
  const color = sentiment === Sentiment.Positive ? 'bg-green-500' :
                sentiment === Sentiment.Negative ? 'bg-red-500' : 'bg-yellow-400';
  return <div className={`w-2.5 h-2.5 rounded-full ${color} inline-block align-middle`} title={sentiment}></div>;
};

const CategoryTag: React.FC<{ category: string; onClick?: () => void }> = ({ category, onClick }) => {
  return (
    <span 
      className={`py-1 px-2.5 text-sm font-medium rounded-md bg-[#F5F5F5] border border-[#E0E0E0] text-gray-700 whitespace-nowrap ${onClick ? 'cursor-pointer hover:bg-gray-200 hover:border-gray-400 transition-colors' : ''}`}
      onClick={onClick}
      title={onClick ? "Filter by this category" : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      {category}
    </span>
  );
};


const formatDate = (isoDateString: string, outputFormat: 'input' | 'displayShort' = 'displayShort'): string => {
    try {
        const dateObj = new Date(isoDateString);
        if (isNaN(dateObj.getTime())) throw new Error("Invalid date");

        if (outputFormat === 'input') {
            const year = dateObj.getFullYear();
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const day = dateObj.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        
        const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' };
        return dateObj.toLocaleDateString('en-GB', dateOptions); 

    } catch (e) {
         if (outputFormat === 'input') return isoDateString.split('T')[0]; 
        return isoDateString.split('T')[0]; 
    }
};

const formatDateTimeForDisplay = (isoDateString: string): { date: string; time: string } => {
    try {
        const dateObj = new Date(isoDateString);
        if (isNaN(dateObj.getTime())) throw new Error("Invalid date");

        const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' };
        const date = dateObj.toLocaleDateString('en-GB', dateOptions); 

        const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata', hour12: false };
        const time = dateObj.toLocaleTimeString('en-GB', timeOptions) + ' IST'; 
        
        return { date, time };
    } catch (e) {
        const [datePart] = isoDateString.split('T');
        return { date: datePart, time: 'N/A' };
    }
};


const AnnouncementsPageComponent: React.FC = () => {
  const { 
    selectedWatchlistFilters, setSelectedWatchlistFilters,
    selectedSentimentFilters, setSelectedSentimentFilters,
    categoryFilters, 
    showProceduralAdminNews, setShowProceduralAdminNews,
    isSelectAllCategoriesActive, 
    setSubCategoryChecked, 
    removeCategoryFilterPill, 
    watchlists,
    companies: globalCompanies, 
    isItemSaved, saveItem, unsaveItem, getItemNotes, getSavedItemDetails
  } = useAppContext();

  const [announcementsData, setAnnouncementsData] = useState<AnnouncementItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [totalApiItems, setTotalApiItems] = useState<number>(0);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDateFilter, setActiveDateFilter] = useState<DateFilterType>('30days'); 
  const [customStartDate, setCustomStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 29); 
    return formatDate(date.toISOString(), 'input');
  });
  const [customEndDate, setCustomEndDate] = useState<string>(formatDate(new Date().toISOString(), 'input'));
  const [dateRangeError, setDateRangeError] = useState<string>('');

  const [companyFilterTerm, setCompanyFilterTerm] = useState<string>('');
  const [showCompanyFilterDropdown, setShowCompanyFilterDropdown] = useState<boolean>(false);

  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [currentItemForSave, setCurrentItemForSave] = useState<AnnouncementItem | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  const [showUnsaveConfirmModal, setShowUnsaveConfirmModal] = useState<boolean>(false);
  const [itemForUnsaveConfirm, setItemForUnsaveConfirm] = useState<AnnouncementItem | null>(null);
  const [noteForUnsaveDisplay, setNoteForUnsaveDisplay] = useState<string>('');

  const [readAnnouncementIds, setReadAnnouncementIds] = useState<Set<string>>(new Set());
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);
  const [isPanelActuallyVisible, setIsPanelActuallyVisible] = useState<boolean>(false);
  const [panelItemForAnimation, setPanelItemForAnimation] = useState<AnnouncementItem | null>(null);

  const [funnelTotalProcessedInDateRange, setFunnelTotalProcessedInDateRange] = useState(0);
  const [funnelProceduralFilteredInDateRange, setFunnelProceduralFilteredInDateRange] = useState(0);

  const [newAnnouncementsCount, setNewAnnouncementsCount] = useState<number>(0);
  const [showNewAnnouncementsNotifier, setShowNewAnnouncementsNotifier] = useState<boolean>(false);
  const webSocketRef = useRef<WebSocket | null>(null);


  const currentFunnelDateRange = useMemo(() => {
    let startDate = customStartDate;
    let endDate = customEndDate;
    const today = new Date();

    if (activeDateFilter === 'today') {
      startDate = formatDate(today.toISOString(), 'input');
      endDate = formatDate(today.toISOString(), 'input');
    } else if (activeDateFilter === '7days') {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);
      startDate = formatDate(sevenDaysAgo.toISOString(), 'input');
      endDate = formatDate(today.toISOString(), 'input');
    } else if (activeDateFilter === '30days') {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 29);
      startDate = formatDate(thirtyDaysAgo.toISOString(), 'input');
      endDate = formatDate(today.toISOString(), 'input');
    }
    return { startDate, endDate };
  }, [activeDateFilter, customStartDate, customEndDate]);

  const fetchAnnouncementsFromApi = useCallback(async () => {
    if (dateRangeError) return; 

    setIsLoading(true);
    setFetchError(null);

    const params: any = {
      start_date: currentFunnelDateRange.startDate,
      end_date: currentFunnelDateRange.endDate,
      limit: ITEMS_PER_PAGE,
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
    };

    const checkedSubCategories = categoryFilters
      .flatMap(sc => sc.subCategories.map(sub => ({ name: sub.name.split(' (')[0], checked: sub.checked ?? false })))
      .filter(sub => sub.checked);

    if (showProceduralAdminNews) {
      params.category = "Procedural/Administrative";
    } else if (!isSelectAllCategoriesActive && checkedSubCategories.length === 1) {
      params.category = checkedSubCategories[0].name;
    } 
    
    if (companyFilterTerm.trim()) {
        const company = globalCompanies.find(c => 
            c.name.toLowerCase().includes(companyFilterTerm.toLowerCase()) || 
            c.ticker.toLowerCase().includes(companyFilterTerm.toLowerCase())
        );
        if (company?.isin) params.isin = company.isin;
        else if (company?.ticker) params.symbol = company.ticker;
    }


    try {
      const response = await apiService.fetchCorporateFilings(params);
      const mappedAnnouncements = response.filings.map(apiAnn =>
        apiService.mapApiAnnouncementToAnnouncementItem(apiAnn, globalCompanies)
      ).map(ann => { 
          const savedDetails = getSavedItemDetails(ann.id);
          return {
            ...ann,
            isSaved: isItemSaved(ann.id),
            notes: savedDetails?.notes,
          };
      });
      setAnnouncementsData(mappedAnnouncements);
      setTotalApiItems(response.count);
      setFunnelTotalProcessedInDateRange(response.count); 
      setFunnelProceduralFilteredInDateRange(
        mappedAnnouncements.filter(ann => ann.category === "Procedural/Administrative").length
      );

    } catch (err: any) {
      setFetchError(err.message || 'Failed to fetch announcements.');
      setAnnouncementsData([]);
      setTotalApiItems(0);
      setFunnelTotalProcessedInDateRange(0);
      setFunnelProceduralFilteredInDateRange(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentFunnelDateRange, 
    currentPage, 
    categoryFilters, 
    showProceduralAdminNews, 
    isSelectAllCategoriesActive, 
    companyFilterTerm, 
    globalCompanies, 
    dateRangeError,
    isItemSaved, 
    getSavedItemDetails
  ]);

  useEffect(() => {
    fetchAnnouncementsFromApi();
  }, [fetchAnnouncementsFromApi]); 

  // WebSocket connection effect
  useEffect(() => {
    if (webSocketRef.current) {
      return;
    }

    const ws = new WebSocket('wss://fin.anshlkr.com/');
    webSocketRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected to wss://fin.anshlkr.com/');
    };

    ws.onmessage = (event) => {
      try {
        const newApiAnnouncement = JSON.parse(event.data as string) as ApiAnnouncement;
        if (newApiAnnouncement && newApiAnnouncement.id && newApiAnnouncement.summary) {
          console.log('New announcement received via WebSocket:', newApiAnnouncement);
          setNewAnnouncementsCount(prevCount => prevCount + 1);
          setShowNewAnnouncementsNotifier(true);
        } else {
          console.warn('Received non-announcement message or malformed data via WebSocket:', newApiAnnouncement);
        }
      } catch (e) {
        console.error('Error parsing WebSocket message or invalid data:', e, event.data);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.reason, event.code);
      webSocketRef.current = null;
    };

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
        console.log('WebSocket connection closed on component unmount.');
      }
      webSocketRef.current = null;
    };
  }, []); // Empty dependency array: runs once on mount, cleans up on unmount


  const handleReloadAnnouncements = () => {
    setCurrentPage(1); 
    fetchAnnouncementsFromApi(); 
    setNewAnnouncementsCount(0);
    setShowNewAnnouncementsNotifier(false);
  };

  const handleDateFilterClick = (filterType: DateFilterType) => {
    setActiveDateFilter(filterType);
    setCurrentPage(1); 
    const today = new Date();
    let startDate = new Date(today);
    let endDate = new Date(today);

    if (filterType === '7days') {
      startDate.setDate(today.getDate() - 6);
    } else if (filterType === '30days') {
      startDate.setDate(today.getDate() - 29);
    }
    
    if (filterType !== 'custom') {
        setCustomStartDate(formatDate(startDate.toISOString(), 'input'));
        setCustomEndDate(formatDate(endDate.toISOString(), 'input'));
        setDateRangeError(''); 
    }
  };
  
  useEffect(() => {
    if (customStartDate && customEndDate) { 
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        if (start > end) {
            setDateRangeError('Start date cannot be after end date.');
            return;
        }
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) +1; 
        if (diffDays > 365) {
            setDateRangeError('Date range cannot exceed 365 days.');
        } else {
            setDateRangeError('');
        }
    } else {
        setDateRangeError('');
    }
     setCurrentPage(1); 
  }, [customStartDate, customEndDate]);

  const handleOpenSaveModal = (item: AnnouncementItem) => {
    setCurrentItemForSave(item);
    setNoteText(getItemNotes(item.id) || ''); 
    setShowSaveModal(true);
  };

  const confirmSaveItem = () => {
    if (currentItemForSave) {
      saveItem(currentItemForSave, noteText); 
      setAnnouncementsData(prev => prev.map(ann => 
        ann.id === currentItemForSave.id ? {...ann, isSaved: true, notes: noteText } : ann
      ));
       if (panelItemForAnimation && panelItemForAnimation.id === currentItemForSave.id) {
        setPanelItemForAnimation(prev => prev ? {...prev, isSaved: true, notes: noteText} : null);
      }
    }
    setShowSaveModal(false);
    setCurrentItemForSave(null);
    setNoteText('');
  };
  
  const handleRequestUnsave = (item: AnnouncementItem) => {
    setItemForUnsaveConfirm(item);
    setNoteForUnsaveDisplay(getItemNotes(item.id) || '');
    setShowUnsaveConfirmModal(true);
  };

  const confirmUnsaveItem = () => {
    if (itemForUnsaveConfirm) {
      unsaveItem(itemForUnsaveConfirm.id);
      setAnnouncementsData(prev => prev.map(ann => 
        ann.id === itemForUnsaveConfirm.id ? {...ann, isSaved: false, notes: undefined } : ann
      ));
      if (panelItemForAnimation && panelItemForAnimation.id === itemForUnsaveConfirm.id) {
        setPanelItemForAnimation(prev => prev ? {...prev, isSaved: false, notes: undefined} : null);
      }
    }
    setShowUnsaveConfirmModal(false);
    setItemForUnsaveConfirm(null);
    setNoteForUnsaveDisplay('');
  };

  const handleCategoryTagClickInTable = (categoryName: string) => {
    let superCategoryNameForCall = '';
    for (const superCat of categoryFilters) {
        if (superCat.subCategories.some(sub => sub.name.startsWith(categoryName))) {
            superCategoryNameForCall = superCat.name;
            break;
        }
    }
    if (superCategoryNameForCall) {
        const fullSubCategoryName = categoryFilters
            .find(sc => sc.name === superCategoryNameForCall)
            ?.subCategories.find(sub => sub.name.startsWith(categoryName))?.name;

        if (fullSubCategoryName) {
            setSubCategoryChecked(superCategoryNameForCall, fullSubCategoryName, true);
        }
    }
    setCurrentPage(1);
  };


  const activeFiltersForDisplay = useMemo(() => {
    const filters: { type: string, value: string, label: string, id: string, isExclusion?: boolean }[] = [];

    selectedWatchlistFilters.forEach(wlId => {
      const wl = watchlists.find(w => w.id === wlId);
      if (wl) filters.push({ type: 'watchlist', value: wlId, label: `WL: ${wl.name}`, id: `wl_${wlId}` });
    });

    if (companyFilterTerm.trim() !== '') {
        filters.push({ type: 'company', value: companyFilterTerm, label: `Company: ${companyFilterTerm}`, id: `company_${companyFilterTerm.replace(/\s+/g, '_')}` });
    }
    
    if (showProceduralAdminNews) {
      // Pill handled below
    } else { 
        if (isSelectAllCategoriesActive) {
          // No category pills
        } else { 
            const allSubCategoriesWithStates = categoryFilters.flatMap(sc => sc.subCategories.map(sub => ({ name: sub.name.split(' (')[0], checked: sub.checked ?? false })));
            const checkedSubCategories = allSubCategoriesWithStates.filter(sub => sub.checked);
            const uncheckedSubCategories = allSubCategoriesWithStates.filter(sub => !sub.checked);

            const showExclusionPills = uncheckedSubCategories.length > 0 &&
                                       uncheckedSubCategories.length <= 3 && 
                                       checkedSubCategories.length > uncheckedSubCategories.length;

            if (showExclusionPills) {
                uncheckedSubCategories.forEach(subCat => {
                    filters.push({
                        type: 'category',
                        value: subCat.name,
                        label: `Excluding: ${subCat.name}`,
                        id: `cat_exclude_${subCat.name.replace(/\s+/g, '_')}`,
                        isExclusion: true
                    });
                });
            } else if (checkedSubCategories.length > 0) {
                checkedSubCategories.forEach(subCat => {
                     filters.push({
                        type: 'category',
                        value: subCat.name,
                        label: subCat.name,
                        id: `cat_include_${subCat.name.replace(/\s+/g, '_')}`,
                        isExclusion: false
                    });
                });
            }
        }
        selectedSentimentFilters.forEach(sentiment => {
            filters.push({ type: 'sentiment', value: sentiment, label: sentiment, id: `sent_${sentiment}` });
        });
    }
    return filters;
  }, [selectedWatchlistFilters, selectedSentimentFilters, categoryFilters, watchlists, showProceduralAdminNews, isSelectAllCategoriesActive, companyFilterTerm]);


  const handleRemoveFilterPill = (type: string, value: string, isExclusion?: boolean) => {
    if (type === 'watchlist') {
      setSelectedWatchlistFilters(prev => prev.filter(id => id !== value));
    } else if (type === 'sentiment') {
      setSelectedSentimentFilters(prev => prev.filter(s => s !== value));
    } else if (type === 'category') { 
      removeCategoryFilterPill(value, !!isExclusion); 
    } else if (type === 'company') {
      setCompanyFilterTerm(''); 
    }
    setCurrentPage(1);
  };

  const clientSideFilteredAnnouncements = useMemo(() => {
    let filtered = [...announcementsData];

    if (selectedWatchlistFilters.length > 0) {
      const companyIdsInSelectedWatchlists = new Set<string>();
      selectedWatchlistFilters.forEach(wlId => {
        const watchlist = watchlists.find(wl => wl.id === wlId);
        watchlist?.companies.forEach(compId => companyIdsInSelectedWatchlists.add(compId));
      });
      filtered = filtered.filter(ann => companyIdsInSelectedWatchlists.has(ann.company.id));
    }
    
    if (companyFilterTerm.trim() && !globalCompanies.find(c => (c.name.toLowerCase().includes(companyFilterTerm.toLowerCase()) || c.ticker.toLowerCase().includes(companyFilterTerm.toLowerCase())) && (c.isin || c.ticker))) {
        filtered = filtered.filter(ann => ann.company.name.toLowerCase().includes(companyFilterTerm.toLowerCase()));
    }

    const apiFetchedSpecificCategory = categoryFilters
      .flatMap(sc => sc.subCategories.map(sub => ({ name: sub.name.split(' (')[0], checked: sub.checked ?? false })))
      .filter(sub => sub.checked).length === 1;

    if (showProceduralAdminNews) { 
        filtered = filtered.filter(ann => ann.category === "Procedural/Administrative");
    } else if (!isSelectAllCategoriesActive && !apiFetchedSpecificCategory) { 
        const allSubCategoriesWithStates = categoryFilters.flatMap(sc => sc.subCategories.map(sub => ({ name: sub.name.split(' (')[0], checked: sub.checked ?? false })));
        const checkedSubCategoriesList = allSubCategoriesWithStates.filter(sub => sub.checked);
        const uncheckedSubCategoriesList = allSubCategoriesWithStates.filter(sub => !sub.checked);

        const shouldUseExclusionLogic = uncheckedSubCategoriesList.length > 0 &&
                                      uncheckedSubCategoriesList.length <= 3 && 
                                      checkedSubCategoriesList.length > uncheckedSubCategoriesList.length;

        if (shouldUseExclusionLogic) {
            const excludedCategoryNames = new Set(uncheckedSubCategoriesList.map(sc => sc.name));
            filtered = filtered.filter(ann => !excludedCategoryNames.has(ann.category) && ann.category !== "Procedural/Administrative");
        } else if (checkedSubCategoriesList.length > 0) {
            const includedCategoryNames = new Set(checkedSubCategoriesList.map(sc => sc.name));
            filtered = filtered.filter(ann => includedCategoryNames.has(ann.category) && ann.category !== "Procedural/Administrative");
        } else { 
             filtered = filtered.filter(ann => ann.category !== "Procedural/Administrative");
        }
    } else if (isSelectAllCategoriesActive) { 
        filtered = filtered.filter(ann => ann.category !== "Procedural/Administrative");
    }
    
    if (selectedSentimentFilters.length > 0) {
        filtered = filtered.filter(ann => selectedSentimentFilters.includes(ann.sentiment));
    }
    
    return filtered.map(ann => ({
        ...ann,
        isSaved: isItemSaved(ann.id),
        notes: getItemNotes(ann.id)
    })).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [
    announcementsData, 
    selectedWatchlistFilters, 
    selectedSentimentFilters,
    categoryFilters, 
    watchlists, 
    companyFilterTerm,
    showProceduralAdminNews,
    isSelectAllCategoriesActive,
    isItemSaved, 
    getItemNotes
  ]);

  const areAnyFiltersActiveForDisplay = useMemo(() => { 
    return activeFiltersForDisplay.length > 0 || showProceduralAdminNews;
  }, [activeFiltersForDisplay, showProceduralAdminNews]);

  const totalPages = Math.ceil(totalApiItems / ITEMS_PER_PAGE);


  useEffect(() => {
    if (selectedAnnouncement) {
      const currentSavedStatus = isItemSaved(selectedAnnouncement.id);
      const currentNotes = getItemNotes(selectedAnnouncement.id);
      setPanelItemForAnimation({...selectedAnnouncement, isSaved: currentSavedStatus, notes: currentNotes });
      
      const timer = setTimeout(() => {
        setIsPanelActuallyVisible(true);
      }, 10); 
      return () => clearTimeout(timer);
    }
  }, [selectedAnnouncement, isItemSaved, getItemNotes]);


  const handleRowClick = (item: AnnouncementItem) => {
    setSelectedAnnouncement(item);
    setReadAnnouncementIds(prev => new Set(prev).add(item.id));
  };

  const closePanel = useCallback(() => {
    setIsPanelActuallyVisible(false);
    const timer = setTimeout(() => {
      setSelectedAnnouncement(null);
      setPanelItemForAnimation(null);
    }, 300); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePanel();
      }
    };
    if (isPanelActuallyVisible) { 
      document.addEventListener('keydown', handleEscKey);
    }
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isPanelActuallyVisible, closePanel]);

  const handleShare = async (item: AnnouncementItem) => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: item.headline,
                text: `Check out this announcement from ${item.company.name}: ${item.headline}`,
                url: window.location.href, 
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        alert('Web Share API not supported. You can manually copy the link.');
    }
  };
  
  const handleDownload = (item: AnnouncementItem) => {
      if (item.fileUrl) {
          window.open(item.fileUrl, '_blank');
      } else {
          alert(`No downloadable PDF available for "${item.headline}".`);
      }
  };

  const handleCompanyCellNavigate = (companyName: string) => {
    alert(`Navigate to company page for ${companyName} (placeholder).`);
  };


  const DateInputButton: React.FC<{ value: string; onChange: (date: string) => void; id: string }> = ({ value, onChange, id }) => {
    const displayDate = value ? formatDate(new Date(value+'T00:00:00Z').toISOString(), 'displayShort') : 'Select Date';
    return (
        <label htmlFor={id} className="relative cursor-pointer flex items-center bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-gray-700 transition-colors">
            <IconCalendar className="w-4 h-4 mr-1.5 text-gray-500" />
            <span>{displayDate}</span>
            <input 
                type="date" 
                id={id} 
                value={value} 
                onChange={e => { onChange(e.target.value); setCurrentPage(1); setActiveDateFilter('custom'); }} 
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
            />
        </label>
    );
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 pb-3 min-h-[50px] sm:min-h-[auto]">
        <div className="flex-grow mr-4">
          {areAnyFiltersActiveForDisplay ? (
            <div className="min-h-[34px]"> 
              <div className="flex items-center flex-wrap gap-2"> 
                <span className="text-sm font-medium text-gray-600 mr-1">Filtered by:</span>
                {activeFiltersForDisplay.map(filter => (
                  <span 
                    key={filter.id} 
                    className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center
                                ${filter.isExclusion ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {filter.label}
                    <button 
                        onClick={() => handleRemoveFilterPill(filter.type, filter.value, filter.isExclusion)} 
                        className={`ml-1.5 ${filter.isExclusion ? 'text-red-500 hover:text-red-700' : 'text-gray-500 hover:text-gray-700'}`}
                        aria-label={`Remove filter ${filter.label}`}
                    >
                      <IconX className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {showProceduralAdminNews && ( 
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                    Showing Only Procedural News
                    <button onClick={() => {setShowProceduralAdminNews(false); setCurrentPage(1);}} className="ml-1.5 text-blue-500 hover:text-blue-700">
                      <IconX className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          ) : (
             <MarketInsightsFunnel 
                dateRange={currentFunnelDateRange} 
                totalItemsInDateRangeFromApi={funnelTotalProcessedInDateRange}
                proceduralItemsInDateRangeFromApi={funnelProceduralFilteredInDateRange}
             />
          )}
        </div>
        
        <div className="flex flex-col items-end flex-shrink-0">
            <div className="flex items-center space-x-1 flex-wrap justify-end">
                {(['today', '7days', '30days'] as DateFilterType[]).map(df => (
                <Button
                    key={df}
                    size="sm"
                    variant={activeDateFilter === df && !dateRangeError ? 'primary' : 'secondary'}
                    onClick={() => handleDateFilterClick(df)}
                    className="capitalize !px-2.5 !py-1.5 whitespace-nowrap mb-1 sm:mb-0"
                >
                    {df === '7days' ? 'Last 7 Days' : df === '30days' ? 'Last 30 Days' : df}
                </Button>
                ))}
                <div className="flex items-center space-x-1.5 ml-0 sm:ml-1 mt-1 sm:mt-0"> 
                    <DateInputButton value={customStartDate} onChange={setCustomStartDate} id="customStartDate" />
                    <span className="text-sm text-gray-500">to</span>
                    <DateInputButton value={customEndDate} onChange={setCustomEndDate} id="customEndDate" />
                </div>
            </div>
            {dateRangeError && activeDateFilter === 'custom' && (
                <p className="text-red-500 text-xs mt-1 text-right">{dateRangeError}</p>
            )}
        </div>
      </div>
      
      {isLoading && (
        <div className="flex-grow flex items-center justify-center text-gray-500">
            <IconRefresh className="w-6 h-6 animate-spin mr-2" /> Loading announcements...
        </div>
      )}
      {fetchError && !isLoading && (
         <div className="flex-grow flex flex-col items-center justify-center text-red-500 p-4 bg-red-50 rounded-md">
            <p className="font-semibold">Error loading announcements:</p> 
            <p className="text-sm">{fetchError}</p>
            <Button onClick={fetchAnnouncementsFromApi} className="mt-4" size="sm">Try Again</Button>
        </div>
      )}

      {!isLoading && !fetchError && (
        <>
            <div className="overflow-x-auto flex-grow">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                    <div className="flex items-center">
                    Company
                    <button onClick={() => setShowCompanyFilterDropdown(!showCompanyFilterDropdown)} className="ml-1 p-0.5 rounded hover:bg-gray-200" aria-label="Toggle company filter dropdown">
                        <IconFilterFilled className="w-3 h-3 text-gray-400" />
                    </button>
                    </div>
                    {showCompanyFilterDropdown && (
                        <div className="absolute mt-1 p-2 bg-white border border-gray-300 rounded shadow-lg z-20">
                            <input 
                                type="text"
                                placeholder="Filter company..."
                                value={companyFilterTerm}
                                onChange={e => {setCompanyFilterTerm(e.target.value); setCurrentPage(1);}}
                                className="form-input text-sm p-1.5 border-gray-300 rounded-md w-full"
                            />
                        </div>
                    )}
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Category</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[40%]">Headline</th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">Sentiment</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Date</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {clientSideFilteredAnnouncements.map((item) => {
                const { date: formattedDate, time: formattedTime } = formatDateTimeForDisplay(item.date);
                const isRead = readAnnouncementIds.has(item.id);
                const currentIsSaved = isItemSaved(item.id);
                return (
                <tr 
                    key={item.id} 
                    className={`hover:bg-gray-50 transition-colors ${isRead ? 'opacity-70' : ''}`} 
                    onClick={() => handleRowClick(item)} 
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRowClick(item);}}
                    aria-label={`View details for announcement: ${item.headline}`}
                >
                    <td className="px-4 py-3 whitespace-normal break-words">
                    <div className="flex items-center justify-between group">
                        <div>
                        <span 
                            className="text-sm font-medium text-gray-700 hover:underline cursor-pointer"
                            title="Filter by this company"
                            onClick={(e) => { e.stopPropagation(); setCompanyFilterTerm(item.company.name); setCurrentPage(1);}}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setCompanyFilterTerm(item.company.name); setCurrentPage(1);}}}
                        >
                            {item.company.name}
                        </span>
                        <div className="text-xs text-gray-500">{item.company.ticker}</div>
                        </div>
                        <button
                        title="Go to company page"
                        onClick={(e) => { e.stopPropagation(); handleCompanyCellNavigate(item.company.name); }}
                        className="ml-1.5 p-0.5 rounded text-gray-600 hover:text-gray-800 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150"
                        aria-label={`Go to ${item.company.name} page`}
                        >
                        <IconExternalLink className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <CategoryTag 
                        category={item.category} 
                        onClick={() => handleCategoryTagClickInTable(item.category)} 
                    />
                    </td>
                    <td className="px-4 py-3 whitespace-normal break-words cursor-pointer" aria-hidden="true">
                    <div className="text-sm text-gray-700" title={item.headline}>{item.headline}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center" aria-hidden="true">
                    <SentimentDot sentiment={item.sentiment} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500" aria-hidden="true">
                        <div>{formattedDate}</div>
                        <div className="text-xs text-gray-400">{formattedTime}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-1 justify-end" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleShare(item)} title="Share" aria-label="Share announcement" className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                            <IconShare className="w-4 h-4" />
                        </button>
                        <button onClick={() => currentIsSaved ? handleRequestUnsave(item) : handleOpenSaveModal(item)} title={currentIsSaved ? "Unsave item" : "Save item with note"} aria-label={currentIsSaved ? "Unsave item" : "Save item with note"} className={`p-1.5 rounded-md ${currentIsSaved ? 'text-blue-600 bg-blue-100' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}>
                            {currentIsSaved ? <IconBookmarkFilled className="w-4 h-4" /> : <IconBookmark className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleDownload(item)} title={item.fileUrl ? "Download PDF" : "No PDF"} aria-label="Download PDF" className={`p-1.5 rounded-md ${item.fileUrl ? 'text-gray-400 hover:text-blue-600 hover:bg-blue-50' : 'text-gray-300 cursor-not-allowed'}`} disabled={!item.fileUrl}>
                            <IconDownload className="w-4 h-4" />
                        </button>
                    </div>
                    </td>
                </tr>
                )})}
            </tbody>
            </table>
            </div>
            {clientSideFilteredAnnouncements.length === 0 && (
                <div className="text-center py-10 text-gray-500 flex-grow flex items-center justify-center">
                    No announcements match your current filters.
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-auto pt-1 flex justify-between items-center border-t border-gray-200">
                    <p className="text-sm text-gray-500">Page {currentPage} of {totalPages} ({totalApiItems} items)</p>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
                </div>
            )}
        </>
      )}


      {showSaveModal && currentItemForSave && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[60] flex items-center justify-center p-4">
          <div className="relative mx-auto p-6 border w-full max-w-lg shadow-xl rounded-md bg-white z-[70]">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Save Announcement</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-700 font-medium mb-1">{currentItemForSave.company.name}</p>
              <p className="text-sm text-gray-600 mb-2">{currentItemForSave.headline}</p>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add an optional note..."
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowSaveModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={confirmSaveItem}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {showUnsaveConfirmModal && itemForUnsaveConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="unsave-confirm-title">
          <div className="relative mx-auto p-6 border w-full max-w-lg shadow-xl rounded-md bg-white z-[70]">
            <h3 id="unsave-confirm-title" className="text-lg font-medium text-red-700 mb-3">Confirm Unsave</h3>
            <p className="text-sm text-gray-700 mb-2">Are you sure you want to unsave this announcement?</p>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-4">
                <p className="text-sm text-gray-800 font-medium break-words">{itemForUnsaveConfirm.company.name} - {itemForUnsaveConfirm.headline}</p>
                {noteForUnsaveDisplay && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-0.5">Your saved note (will be deleted):</p>
                        <p className="text-xs text-gray-600 italic bg-yellow-50 p-2 rounded border border-yellow-200">{noteForUnsaveDisplay}</p>
                    </div>
                )}
                {!noteForUnsaveDisplay && (
                     <p className="text-xs text-gray-500 mt-1 italic">No note was saved for this item.</p>
                )}
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => { setShowUnsaveConfirmModal(false); setItemForUnsaveConfirm(null); }}>Cancel</Button>
              <Button variant="danger" onClick={confirmUnsaveItem}>Confirm Unsave</Button>
            </div>
          </div>
        </div>
      )}


      {panelItemForAnimation && (
        <>
          <div 
            className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-in-out
                       ${isPanelActuallyVisible ? 'bg-opacity-60' : 'bg-opacity-0 pointer-events-none'}`}
            onClick={closePanel}
            aria-hidden={!isPanelActuallyVisible}
          ></div>
          <div 
            className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 flex flex-col
                       w-full md:w-3/5 lg:w-1/2 min-w-[320px] max-w-[90vw]
                       transform transition-transform duration-300 ease-in-out
                       ${isPanelActuallyVisible ? 'translate-x-0' : 'translate-x-full'}`}
            role="dialog"
            aria-modal="true"
            aria-hidden={!isPanelActuallyVisible}
            aria-labelledby="announcement-panel-title"
          >
             <button 
                  onClick={closePanel} 
                  title="Close (Escape)"
                  aria-label="Close details panel"
                  className="absolute top-4 right-5 z-10 p-1.5 bg-gray-700 text-white rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors"
                >
                  <IconX className="w-5 h-5" />
              </button>
            <div className="px-4 py-2 border-b border-gray-200 flex items-center space-x-3">
                 <button onClick={() => handleShare(panelItemForAnimation)} title="Share" className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                    <IconShare className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => isItemSaved(panelItemForAnimation.id) ? handleRequestUnsave(panelItemForAnimation) : handleOpenSaveModal(panelItemForAnimation)} 
                    title={isItemSaved(panelItemForAnimation.id) ? "Unsave item" : "Save item with note"} 
                    className={`p-1.5 rounded-md ${isItemSaved(panelItemForAnimation.id) ? 'text-blue-600 bg-blue-100' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}
                >
                    {isItemSaved(panelItemForAnimation.id) ? <IconBookmarkFilled className="w-5 h-5" /> : <IconBookmark className="w-5 h-5" />}
                </button>
                <button onClick={() => handleDownload(panelItemForAnimation)} title={panelItemForAnimation.fileUrl ? "Download PDF" : "No PDF"} className={`p-1.5 rounded-md ${panelItemForAnimation.fileUrl ? 'text-gray-500 hover:text-blue-600 hover:bg-blue-50' : 'text-gray-300 cursor-not-allowed'}`} disabled={!panelItemForAnimation.fileUrl}>
                    <IconDownload className="w-5 h-5" />
                </button>
            </div>
            
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-[0]"> 
              <div className="flex justify-between items-start">
                <h2 id="announcement-panel-title" className="text-lg font-semibold text-gray-800 pr-12 break-words">
                  {panelItemForAnimation.headline}
                </h2>
              </div>
               <p className="text-sm text-gray-500 mt-1">{panelItemForAnimation.company.name} ({panelItemForAnimation.company.ticker})</p>
               <p className="text-xs text-gray-400 mt-0.5">{formatDateTimeForDisplay(panelItemForAnimation.date).date} - {formatDateTimeForDisplay(panelItemForAnimation.date).time}</p>
            </div>

            <div className="flex-grow p-4 overflow-y-auto">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {panelItemForAnimation.aiSummary || 'No AI summary available.'}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </>
      )}

      {showNewAnnouncementsNotifier && newAnnouncementsCount > 0 && (
        <div 
          className="fixed bottom-5 right-5 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-xl cursor-pointer hover:bg-blue-700 transition-colors z-[100]"
          onClick={handleReloadAnnouncements}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleReloadAnnouncements();}}
          aria-label={`${newAnnouncementsCount} new announcements. Click to reload.`}
        >
          {newAnnouncementsCount} new announcement{newAnnouncementsCount > 1 ? 's' : ''} - Click to reload
        </div>
      )}
    </div>
  );
};

const AnnouncementsPageDefaultExport = AnnouncementsPageComponent;
export default AnnouncementsPageDefaultExport;
