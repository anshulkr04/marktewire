
import React, { useState, useMemo, useEffect } from 'react';
import { SavedItem, AnnouncementItem, MarketResultItem, Sentiment } from '../types';
import { IconBookmark, IconMessageCircle, IconX } from '../constants';
import Button from '../components/ui/Button';
import { useAppContext } from '../contexts/AppContext';

const formatDateForDisplayModal = (isoDateString?: string): string => {
  if (!isoDateString) return '';
  try {
    const dateObj = new Date(isoDateString);
    if (isNaN(dateObj.getTime())) return 'Invalid Date';
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' };
    return dateObj.toLocaleDateString('en-GB', options);
  } catch (e) {
    return 'Invalid Date';
  }
};

const SavedItemCard: React.FC<{ item: SavedItem; onUnsave: (id: string) => void; onShowNotes: (item: SavedItem) => void }> = ({ item, onUnsave, onShowNotes }) => {
  const renderContent = () => {
    if (item.type === 'announcement') {
      const content = item.content as AnnouncementItem;
      return (
        <div>
          <p className="text-sm text-blue-600 font-medium">{content.company.name} ({content.company.ticker})</p>
          <p className="text-md text-gray-700 mt-1">{content.headline}</p>
          <p className="text-xs text-gray-500 mt-1">Category: {content.category} | Event Date: {formatDateForDisplayModal(content.date)}</p>
        </div>
      );
    }
    if (item.type === 'market_data') {
      const content = item.content as MarketResultItem;
      return (
        <div>
          <p className="text-sm text-blue-600 font-medium">{content.company.name} ({content.company.ticker})</p>
          <p className="text-md text-gray-700 mt-1">{content.aiHeadline}</p>
          <p className="text-xs text-gray-500 mt-1">Revenue: {content.revenue} | Net Profit: {content.netProfit} | EPS: {content.eps} | Event Date: {formatDateForDisplayModal(content.date)}</p>
        </div>
      );
    }
    const genericContent = item.content as { title: string, description?: string };
    return (
        <div>
            <p className="text-md text-gray-700 mt-1">{genericContent.title}</p>
            {genericContent.description && <p className="text-xs text-gray-500 mt-1">{genericContent.description}</p>}
             <p className="text-xs text-gray-500 mt-1">Event Date: {formatDateForDisplayModal(item.eventDate)}</p>
        </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-grow pr-4">{renderContent()}</div>
        <div className="flex-shrink-0 flex flex-col items-end space-y-2">
           {item.priceChangeSinceEvent && (
             <span className={`text-sm font-medium ${item.priceChangeSinceEvent.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {item.priceChangeSinceEvent} (% since event)
             </span>
           )}
            <div className="flex space-x-2">
                {item.notes && (
                    <Button variant="secondary" size="sm" onClick={() => onShowNotes(item)} leftIcon={<IconMessageCircle className="w-4 h-4"/>}>
                        View Note
                    </Button>
                )}
                 {!item.notes && ( // Offer to add note if none exists
                    <Button variant="secondary" size="sm" onClick={() => onShowNotes(item)} leftIcon={<IconMessageCircle className="w-4 h-4"/>}>
                        Add Note
                    </Button>
                )}
                <Button variant="danger" size="sm" onClick={() => onUnsave(item.id)} leftIcon={<IconX className="w-4 h-4"/>}>
                    Unsave
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};


const SavedPage: React.FC = () => {
  const { 
    savedItemsData, 
    unsaveItem, 
    updateItemNote,
    selectedWatchlistFilters, 
    selectedSentimentFilters, 
    categoryFilters, 
    watchlists 
  } = useAppContext();
  
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<SavedItem | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState<string>('');

  const handleUnsave = (id: string) => {
    unsaveItem(id);
  };

  const handleShowNotes = (item: SavedItem) => {
    setSelectedItemForModal(item);
    setCurrentNoteText(item.notes || '');
    setShowNotesModal(true);
  };

  const handleSaveNote = () => {
    if (selectedItemForModal) {
      updateItemNote(selectedItemForModal.id, currentNoteText);
    }
    setShowNotesModal(false);
    setSelectedItemForModal(null);
    setCurrentNoteText('');
  };
  
  const allSavedItemsFromContext = useMemo(() => Array.from(savedItemsData.values()), [savedItemsData]);

  const filteredSavedItems = useMemo(() => {
    let filtered = [...allSavedItemsFromContext];

    if (selectedWatchlistFilters.length > 0) {
      const companyIdsInSelectedWatchlists = new Set<string>();
      selectedWatchlistFilters.forEach(wlId => {
        const watchlist = watchlists.find(wl => wl.id === wlId);
        watchlist?.companies.forEach(compId => companyIdsInSelectedWatchlists.add(compId));
      });
      filtered = filtered.filter(savedItem => {
        if (savedItem.type === 'announcement' || savedItem.type === 'market_data') {
          const content = savedItem.content as (AnnouncementItem | MarketResultItem);
          return companyIdsInSelectedWatchlists.has(content.company.id);
        }
        return true; 
      });
    }

    if (selectedSentimentFilters.length > 0) {
      filtered = filtered.filter(savedItem => {
        if (savedItem.type === 'announcement') {
          const content = savedItem.content as AnnouncementItem;
          return selectedSentimentFilters.includes(content.sentiment);
        }
        return true; 
      });
    }

    const activeSubCategories = new Set<string>();
    categoryFilters.forEach(cat => {
      cat.subCategories.forEach(subCat => {
        if (subCat.checked) activeSubCategories.add(subCat.name.split(' (')[0]);
      });
    });
    if (activeSubCategories.size > 0) {
      filtered = filtered.filter(savedItem => {
        if (savedItem.type === 'announcement') {
          const content = savedItem.content as AnnouncementItem;
          return activeSubCategories.has(content.category);
        }
        return true;
      });
    }
    
    return filtered.sort((a,b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
  }, [allSavedItemsFromContext, selectedWatchlistFilters, selectedSentimentFilters, categoryFilters, watchlists]);


  if (allSavedItemsFromContext.length === 0) {
     return (
      <div className="flex flex-col items-center justify-center h-full text-center p-10 bg-white rounded-lg shadow">
        <IconBookmark className="w-20 h-20 text-gray-300 mb-6" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Saved Items Yet</h2>
        <p className="text-gray-500">
          Start saving announcements or market data to see them here.
        </p>
      </div>
    );
  }
  
  if (filteredSavedItems.length === 0 && allSavedItemsFromContext.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-10 bg-white rounded-lg shadow">
        <IconBookmark className="w-20 h-20 text-gray-300 mb-6" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Saved Items Match Filters</h2>
        <p className="text-gray-500">
          Adjust your filters in the sidebar to see your saved items.
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Saved Items ({filteredSavedItems.length})</h1>
      <div className="grid grid-cols-1 gap-6">
        {filteredSavedItems.map((item) => (
          <SavedItemCard key={item.id} item={item} onUnsave={handleUnsave} onShowNotes={handleShowNotes} />
        ))}
      </div>

      {showNotesModal && selectedItemForModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                {selectedItemForModal.notes ? 'Edit Note' : 'Add Note'}
              </h3>
              
              {selectedItemForModal.noteSavedDate && (
                 <div className="mb-3 p-2 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-xs text-gray-500">
                        Note last saved: <span className="font-medium text-gray-700">{formatDateForDisplayModal(selectedItemForModal.noteSavedDate)}</span>
                    </p>
                    {selectedItemForModal.priceChangeSinceNoteSaved && (
                        <p className="text-xs text-gray-500">
                            Price change since note saved: 
                            <span className={`font-medium ml-1 ${selectedItemForModal.priceChangeSinceNoteSaved.startsWith('+') ? 'text-green-600' : selectedItemForModal.priceChangeSinceNoteSaved.startsWith('-') ? 'text-red-600' : 'text-gray-700'}`}>
                                {selectedItemForModal.priceChangeSinceNoteSaved}
                            </span>
                        </p>
                    )}
                 </div>
              )}
               <textarea
                value={currentNoteText}
                onChange={(e) => setCurrentNoteText(e.target.value)}
                placeholder="Type your note here..."
                rows={5}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                aria-label="Note content"
              />
              <div className="mt-4 flex justify-end space-x-2">
                <Button onClick={() => setShowNotesModal(false)} variant="secondary">
                  Cancel
                </Button>
                <Button onClick={handleSaveNote} variant="primary">
                  Save Note
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPage;
