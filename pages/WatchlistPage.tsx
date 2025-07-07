import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Watchlist as WatchlistType, Company, Investor, AlertPreference } from '../types';
import { 
    IconPlus, IconEdit, IconSettings, IconBell, IconX, IconSearch, 
    RoutesPath, IconFileImport, IconEye, IconBolt, IconInfoCircle, 
    IconBuilding, IconTrash, IconChevronDown, IconChevronUp, IconUpload, IconDownload, IconPlusCircle,
    IconCheck, IconListDetails 
} from '../constants';
import Button from '../components/ui/Button';
import { FilterCategoriesData, SMART_ALERTS_TOOLTIP } from '../constants'; 

const MAX_WATCHLISTS = 10;

type EditTab = 'Basics' | 'Companies' | 'Categories' | 'Super Investors';

interface CategoryGroupForSelection {
  name: string; // Super-category name
  subCategories: { name: string; checked: boolean }[]; // Sub-category name (base name, without count)
  expanded: boolean;
}

const WatchlistPage: React.FC = () => {
  const { 
    watchlists, setWatchlists, 
    companies, investors, 
    setSelectedWatchlistFilters 
  } = useAppContext();
  const navigate = useNavigate();

  const [selectedWatchlistId, setSelectedWatchlistId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWatchlist, setEditingWatchlist] = useState<Partial<WatchlistType> | null>(null);
  const [activeEditTab, setActiveEditTab] = useState<EditTab>('Basics');
  
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const [companySearchDropdownVisible, setCompanySearchDropdownVisible] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [investorSearchTerm, setInvestorSearchTerm] = useState('');
  const [investorSearchDropdownVisible, setInvestorSearchDropdownVisible] = useState(false);
  
  const [showCreateFlowModal, setShowCreateFlowModal] = useState(false);
  const [newWlAlertPref, setNewWlAlertPref] = useState<AlertPreference>('daily_summary');

  const [showCsvImportModal, setShowCsvImportModal] = useState(false);

  const [categoryGroupsForEdit, setCategoryGroupsForEdit] = useState<CategoryGroupForSelection[]>([]);

  const [companiesMarkedForRemoval, setCompaniesMarkedForRemoval] = useState<Set<string>>(new Set());
  const [investorsMarkedForRemoval, setInvestorsMarkedForRemoval] = useState<Set<string>>(new Set());


  // Initialize and update selected watchlist
  useEffect(() => {
    if (watchlists.length > 0) {
      const currentSelectedExists = watchlists.some(wl => wl.id === selectedWatchlistId);
      if (!selectedWatchlistId || !currentSelectedExists) {
        const smartAlertsWL = watchlists.find(wl => wl.isSmartAlerts);
        if (smartAlertsWL) {
          setSelectedWatchlistId(smartAlertsWL.id);
        } else if (watchlists.length > 0) {
          setSelectedWatchlistId(watchlists[0].id);
        }
        setIsEditing(false); // Ensure not in edit mode when auto-selecting
      }
    } else {
      setSelectedWatchlistId(null);
      setIsEditing(false);
    }
  }, [watchlists, selectedWatchlistId]);

  // Populate editingWatchlist and categoryGroupsForEdit when edit mode starts or selected watchlist changes
  useEffect(() => {
    if (isEditing && selectedWatchlistId) {
      const wlToEdit = watchlists.find(wl => wl.id === selectedWatchlistId);
      if (wlToEdit) {
        setEditingWatchlist(JSON.parse(JSON.stringify(wlToEdit)));
        const initialCategoryGroups = FilterCategoriesData.map(fc => ({
          name: fc.name,
          expanded: true, 
          subCategories: fc.subCategories.map(sc => {
            const baseName = sc.name.split(' (')[0];
            return {
              name: baseName,
              checked: wlToEdit.categories?.includes(baseName) || false,
            };
          }),
        }));
        setCategoryGroupsForEdit(initialCategoryGroups);
        setCompaniesMarkedForRemoval(new Set()); // Reset marked items
        setInvestorsMarkedForRemoval(new Set()); // Reset marked items

      } else { 
        setIsEditing(false);
        setEditingWatchlist(null);
        setCategoryGroupsForEdit([]);
      }
    } else {
      setEditingWatchlist(null);
      setCategoryGroupsForEdit([]);
      setCompaniesMarkedForRemoval(new Set());
      setInvestorsMarkedForRemoval(new Set());
    }
    setCompanySearchTerm('');
    setInvestorSearchTerm('');
    setCategorySearchTerm('');
    setActiveEditTab('Basics'); 
  }, [isEditing, selectedWatchlistId, watchlists]);

  // Update editingWatchlist.categories when categoryGroupsForEdit changes
  useEffect(() => {
    if (isEditing && editingWatchlist) {
      const selectedCategories = categoryGroupsForEdit
        .flatMap(group => group.subCategories)
        .filter(subCat => subCat.checked)
        .map(subCat => subCat.name);
      setEditingWatchlist(prev => prev ? { ...prev, categories: selectedCategories } : null);
    }
  }, [categoryGroupsForEdit, isEditing]);


  const handleSelectWatchlist = (id: string) => {
    if (isEditing && editingWatchlist) {
        if(confirm("You have unsaved changes. Are you sure you want to switch watchlists? Your changes will be lost.")) {
             setIsEditing(false); 
        } else {
            return; 
        }
    }
    setSelectedWatchlistId(id);
    setIsEditing(false); 
  };

  const handleCreateNewWatchlistClick = () => {
    if (watchlists.filter(wl=>!wl.isSmartAlerts).length >= (MAX_WATCHLISTS - (smartAlertsWatchlist ? 1:0))) {
      alert(`You can create a maximum of ${MAX_WATCHLISTS - (smartAlertsWatchlist ? 1:0)} custom watchlists.`);
      return;
    }
    setShowCreateFlowModal(true);
  };

  const handleCreateFlowContinue = () => {
    setShowCreateFlowModal(false);
    const newWatchlistData: WatchlistType = {
      id: `wl${Date.now()}`,
      name: 'Untitled Watchlist',
      companies: [],
      isins: [], 
      categories: [],
      superInvestors: [],
      alertPreference: newWlAlertPref,
      isSmartAlerts: false,
    };
    setWatchlists(prev => [...prev, newWatchlistData]);
    setSelectedWatchlistId(newWatchlistData.id);
    setIsEditing(true); 
  };
  
  const handleSaveChanges = () => {
    if (editingWatchlist && editingWatchlist.id) {
      if (!editingWatchlist.name?.trim()) {
        alert("Watchlist name cannot be empty.");
        setActiveEditTab('Basics');
        return;
      }
      if ((editingWatchlist.companies?.length ?? 0) === 0) {
        alert("Please select at least one company.");
        setActiveEditTab('Companies');
        return;
      }
      if ((editingWatchlist.categories?.length ?? 0) === 0) {
        alert("Please select at least one category.");
        setActiveEditTab('Categories');
        return;
      }

      const finalCategories = categoryGroupsForEdit
        .flatMap(group => group.subCategories)
        .filter(subCat => subCat.checked)
        .map(subCat => subCat.name);

      const watchlistToSave: WatchlistType = {
        id: editingWatchlist.id!,
        name: editingWatchlist.name!.trim(),
        companies: editingWatchlist.companies || [],
        isins: editingWatchlist.isins || [],
        categories: finalCategories,
        superInvestors: editingWatchlist.superInvestors || [],
        alertPreference: editingWatchlist.alertPreference || 'no_alerts', 
        isSmartAlerts: editingWatchlist.isSmartAlerts || false,
      };

      setWatchlists(prev => prev.map(wl => wl.id === watchlistToSave.id ? watchlistToSave : wl));
      setIsEditing(false);
      setEditingWatchlist(null);
      setCompaniesMarkedForRemoval(new Set());
      setInvestorsMarkedForRemoval(new Set());
      alert("✓ Saved successfully");
    }
  };
  
  const handleCancelEdit = () => {
    const originalWatchlist = watchlists.find(wl => wl.id === selectedWatchlistId);
    let hasChanges = false;
    if (editingWatchlist && originalWatchlist) {
        // A more robust deep comparison might be needed for complex objects
        hasChanges = JSON.stringify(editingWatchlist) !== JSON.stringify(originalWatchlist);
    } else if (editingWatchlist && !originalWatchlist) { // Case for new unsaved watchlist
        hasChanges = true; 
    }


    if (hasChanges && confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        if (editingWatchlist?.name === 'Untitled Watchlist' && !watchlists.find(wl => wl.id === editingWatchlist?.id)?.name.startsWith("Untitled Watchlist")) {
           // If it was a new "Untitled Watchlist" that was never properly named from initial creation, remove it
           setWatchlists(prev => prev.filter(wl => wl.id !== editingWatchlist?.id));
           const smartAlertsOnCancel = watchlists.find(wl => wl.isSmartAlerts && wl.id !== editingWatchlist?.id);
           const nextWatchlistOnCancel = watchlists.find(wl => wl.id !== editingWatchlist?.id);
           setSelectedWatchlistId(smartAlertsOnCancel?.id || nextWatchlistOnCancel?.id || null);
        }
        setIsEditing(false);
        setEditingWatchlist(null);
        setCompaniesMarkedForRemoval(new Set());
        setInvestorsMarkedForRemoval(new Set());
    } else if (!hasChanges) {
        setIsEditing(false);
        setEditingWatchlist(null);
        setCompaniesMarkedForRemoval(new Set());
        setInvestorsMarkedForRemoval(new Set());
    }
  };

  const handleDeleteWatchlist = () => {
    if (selectedWatchlistData && !selectedWatchlistData.isSmartAlerts) {
      if (confirm(`Are you sure you want to delete the watchlist "${selectedWatchlistData.name}"?`)) {
        setWatchlists(prev => prev.filter(wl => wl.id !== selectedWatchlistData.id));
        const smartAlertsWL = watchlists.find(wl => wl.isSmartAlerts && wl.id !== selectedWatchlistData.id);
        const nextWatchlist = watchlists.find(wl => wl.id !== selectedWatchlistData.id);
        setSelectedWatchlistId(smartAlertsWL?.id || nextWatchlist?.id || null);
        setIsEditing(false);
      }
    }
  };

  const handleToggleCompanyMarkedForRemoval = (companyId: string) => {
    setCompaniesMarkedForRemoval(prev => {
        const newSet = new Set(prev);
        if (newSet.has(companyId)) {
            newSet.delete(companyId);
        } else {
            newSet.add(companyId);
        }
        return newSet;
    });
  };

  const handleSelectAllCompaniesForRemoval = (checked: boolean) => {
    if (checked && editingWatchlist?.companies) {
        setCompaniesMarkedForRemoval(new Set(editingWatchlist.companies));
    } else {
        setCompaniesMarkedForRemoval(new Set());
    }
  };

  const handleDeleteMarkedCompanies = () => {
    if (companiesMarkedForRemoval.size === 0) return;
    const count = companiesMarkedForRemoval.size;
    setEditingWatchlist(prev => {
        if (!prev || !prev.companies) return prev;
        // Also remove corresponding ISINs if they exist
        const companyIdsToRemove = new Set(companiesMarkedForRemoval);
        const updatedIsins = (prev.isins || []).filter(isin => {
            const companyForIsin = companies.find(c => c.isin === isin);
            return !(companyForIsin && companyIdsToRemove.has(companyForIsin.id));
        });

        return {
            ...prev,
            companies: prev.companies.filter(id => !companyIdsToRemove.has(id)),
            isins: updatedIsins
        };
    });
    setCompaniesMarkedForRemoval(new Set());
    alert(`${count} compan${count > 1 ? 'ies' : 'y'} removed from watchlist.`);
  };
  
  const handleCompanySearchSelect = (company: Company) => {
    if (!editingWatchlist?.companies?.includes(company.id)) {
        setEditingWatchlist(prev => {
          if (!prev) return null;
          const updatedCompanies = [...(prev.companies || []), company.id];
          const updatedIsins = company.isin ? [...(prev.isins || []), company.isin] : (prev.isins || []);
          // Deduplicate ISINs just in case
          const uniqueIsins = Array.from(new Set(updatedIsins));
          return { ...prev, companies: updatedCompanies, isins: uniqueIsins };
        });
        alert(`✓ Added: ${company.name}`);
    }
    setCompanySearchTerm('');
    setCompanySearchDropdownVisible(false);
  };

  const handleManageCategoriesSubCategoryToggle = (superCategoryName: string, subCategoryName: string) => {
    setCategoryGroupsForEdit(prevGroups => 
      prevGroups.map(group => 
        group.name === superCategoryName 
        ? {
            ...group,
            subCategories: group.subCategories.map(sub => 
              sub.name === subCategoryName ? {...sub, checked: !sub.checked} : sub
            )
          }
        : group
      )
    );
  };
  
  const toggleSuperCategoryExpansion = (superCategoryName: string) => {
    setCategoryGroupsForEdit(prevGroups =>
      prevGroups.map(group =>
        group.name === superCategoryName ? { ...group, expanded: !group.expanded } : group
      )
    );
  };

  const handleSelectAllCategories = (checked: boolean) => {
     setCategoryGroupsForEdit(prevGroups => prevGroups.map(group => ({
        ...group,
        subCategories: group.subCategories.map(sub => ({...sub, checked: checked}))
     })));
  };

  const handleToggleInvestorMarkedForRemoval = (investorId: string) => {
    setInvestorsMarkedForRemoval(prev => {
        const newSet = new Set(prev);
        if (newSet.has(investorId)) {
            newSet.delete(investorId);
        } else {
            newSet.add(investorId);
        }
        return newSet;
    });
  };

  const handleSelectAllInvestorsForRemoval = (checked: boolean) => {
    if (checked && editingWatchlist?.superInvestors) {
        setInvestorsMarkedForRemoval(new Set(editingWatchlist.superInvestors));
    } else {
        setInvestorsMarkedForRemoval(new Set());
    }
  };

  const handleDeleteMarkedInvestors = () => {
    if (investorsMarkedForRemoval.size === 0) return;
    const count = investorsMarkedForRemoval.size;
    setEditingWatchlist(prev => {
        if (!prev || !prev.superInvestors) return prev;
        return {
            ...prev,
            superInvestors: prev.superInvestors.filter(id => !investorsMarkedForRemoval.has(id))
        };
    });
    setInvestorsMarkedForRemoval(new Set());
    alert(`${count} investor${count > 1 ? 's' : ''} removed from watchlist.`);
  };

  const handleAddSuperInvestor = (investorId: string) => {
    if (!editingWatchlist?.superInvestors?.includes(investorId)) {
        setEditingWatchlist(prev => {
          if (!prev) return null;
          const updatedInvestors = [...(prev.superInvestors || []), investorId];
          return { ...prev, superInvestors: updatedInvestors };
        });
        alert(`✓ Added: ${investors.find(i=>i.id === investorId)?.name}`);
    }
  };


  const handleAlertPreferenceChange = (preference: AlertPreference) => {
    setEditingWatchlist(prev => prev ? { ...prev, alertPreference: preference } : null);
  };

  const handleViewAnnouncements = () => {
    if (selectedWatchlistData) {
      setSelectedWatchlistFilters([selectedWatchlistData.id]);
      navigate(RoutesPath.ANNOUNCEMENTS);
    }
  };

  const selectedWatchlistData = watchlists.find(wl => wl.id === selectedWatchlistId);

  const filteredWatchlistsForList = useMemo(() => {
    return watchlists.filter(wl => !wl.isSmartAlerts).sort((a,b) => a.name.localeCompare(b.name));
  }, [watchlists]);
  
  const smartAlertsWatchlist = useMemo(() => watchlists.find(wl => wl.isSmartAlerts), [watchlists]);

  const filteredCompaniesForSearchDropdown = useMemo(() => {
    if (!companySearchTerm) return [];
    return companies.filter(c => 
      c.name.toLowerCase().includes(companySearchTerm.toLowerCase()) ||
      c.ticker.toLowerCase().includes(companySearchTerm.toLowerCase())
    ).slice(0, 10); 
  }, [companies, companySearchTerm]);

  const filteredCategoriesForEdit = useMemo(() => {
    if (!categorySearchTerm) return categoryGroupsForEdit;
    return categoryGroupsForEdit.map(group => ({
      ...group,
      subCategories: group.subCategories.filter(sub => sub.name.toLowerCase().includes(categorySearchTerm.toLowerCase()))
    })).filter(group => group.subCategories.length > 0);
  }, [categoryGroupsForEdit, categorySearchTerm]);

  const popularInvestorsList = useMemo(() => investors.slice(0, 6), [investors]); 

  const filteredInvestorsForSearch = useMemo(() => {
    if (!investorSearchTerm) return [];
    return investors.filter(i => 
      i.name.toLowerCase().includes(investorSearchTerm.toLowerCase())
    ).slice(0,10);
  }, [investors, investorSearchTerm]);

  // Tab Content Render Functions
  const renderBasicsTab = () => (
    <div className="space-y-6">
      {!editingWatchlist?.isSmartAlerts && (
        <div>
          <label htmlFor="watchlistName" className="block text-sm font-medium text-gray-700 mb-1">Watchlist Name</label>
          <input
            type="text"
            id="watchlistName"
            value={editingWatchlist?.name || ''}
            onChange={(e) => setEditingWatchlist(prev => prev ? { ...prev, name: e.target.value } : null)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            maxLength={50}
          />
          {editingWatchlist?.name && editingWatchlist.name.length > 45 && <p className="text-xs text-red-500 mt-1">Max 50 characters</p>}
        </div>
      )}
      {editingWatchlist?.isSmartAlerts && (
         <h3 className="text-lg font-medium text-gray-800">{editingWatchlist.name}</h3>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Alert Preferences</label>
        <div className="space-y-3">
          {(['smart_alerts', 'daily_summary', 'no_alerts'] as AlertPreference[]).map(pref => (
            <div key={pref} className={`p-3 border rounded-md ${editingWatchlist?.alertPreference === pref ? 'bg-blue-50 border-blue-300' : 'border-gray-200'}`}>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="alertPreference" 
                  value={pref}
                  checked={editingWatchlist?.alertPreference === pref}
                  onChange={() => handleAlertPreferenceChange(pref)}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-1"
                  disabled={editingWatchlist?.isSmartAlerts && pref !== 'smart_alerts'}
                />
                <div className="flex-1">
                  <span className="font-medium text-gray-800">
                    {pref === 'smart_alerts' && 'Smart Alerts'}
                    {pref === 'daily_summary' && 'End-of-Day Summary'}
                    {pref === 'no_alerts' && 'No Alerts'}
                    {pref === 'smart_alerts' && (
                      <span title={SMART_ALERTS_TOOLTIP} className="ml-1 inline-block">
                        <IconInfoCircle className="w-4 h-4 text-gray-500 inline-block align-middle"/>
                      </span>
                    )}
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {pref === 'smart_alerts' && 'AI-filtered alerts within minutes via WhatsApp.'}
                    {pref === 'daily_summary' && 'Comprehensive daily digest via Email at 9 PM IST.'}
                    {pref === 'no_alerts' && 'Check updates at your convenience. No notifications sent.'}
                  </p>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCompaniesTab = () => {
    const isSelectAllCompaniesChecked = (editingWatchlist?.companies?.length || 0) > 0 && 
                                      (editingWatchlist?.companies || []).every(id => companiesMarkedForRemoval.has(id));
    return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium text-gray-700">Selected Companies ({editingWatchlist?.companies?.length || 0})</h3>
        {(editingWatchlist?.companies?.length || 0) > 0 && (
            <label className="flex items-center space-x-1.5 text-xs text-gray-600 cursor-pointer">
                <input
                    type="checkbox"
                    checked={isSelectAllCompaniesChecked}
                    onChange={(e) => handleSelectAllCompaniesForRemoval(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span>Select All for Removal</span>
            </label>
        )}
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch className="h-4 w-4 text-gray-400" />
        </div>
        <input 
            type="text" 
            placeholder="🔍 Type company name or ticker to add..." 
            value={companySearchTerm}
            onChange={e => {setCompanySearchTerm(e.target.value); setCompanySearchDropdownVisible(true);}}
            onBlur={() => setTimeout(() => setCompanySearchDropdownVisible(false), 150)} 
            onFocus={() => setCompanySearchDropdownVisible(true)}
            className="w-full pl-9 p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        />
        {companySearchDropdownVisible && filteredCompaniesForSearchDropdown.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredCompaniesForSearchDropdown.map(company => (
                    <div 
                        key={company.id} 
                        onMouseDown={() => handleCompanySearchSelect(company)}
                        className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                        {company.name} ({company.ticker})
                    </div>
                ))}
            </div>
        )}
      </div>
      
      <div className="border rounded-md p-2 min-h-[100px] max-h-60 overflow-y-auto bg-gray-50 space-y-1">
        {editingWatchlist?.companies?.map(id => {
          const company = companies.find(c => c.id === id);
          return company ? (
            <div key={id} className="flex items-center justify-between p-1.5 bg-white border rounded-md text-sm">
              <label className="flex items-center space-x-2 cursor-pointer flex-grow truncate">
                <input 
                    type="checkbox"
                    checked={companiesMarkedForRemoval.has(id)} 
                    onChange={() => handleToggleCompanyMarkedForRemoval(id)}
                    className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <IconBuilding className="w-4 h-4 inline-block mr-1 align-middle text-gray-500 flex-shrink-0"/>
                <span className="truncate" title={`${company.name} (${company.ticker})`}>{company.name} ({company.ticker})</span>
              </label>
            </div>
          ) : null;
        })}
        {(editingWatchlist?.companies?.length || 0) === 0 && <p className="text-xs text-gray-400 text-center p-2">No companies selected.</p>}
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Bulk Actions</h4>
        <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" leftIcon={<IconUpload className="w-4 h-4"/>} onClick={() => setShowCsvImportModal(true)}>Import CSV</Button>
            <Button variant="secondary" size="sm" leftIcon={<IconDownload className="w-4 h-4"/>} onClick={() => alert("Mock: Exporting company list...")}>Export List</Button>
            {companiesMarkedForRemoval.size > 0 && (
                 <Button variant="danger" size="sm" leftIcon={<IconTrash className="w-4 h-4"/>} onClick={handleDeleteMarkedCompanies}>
                    Delete Marked ({companiesMarkedForRemoval.size})
                 </Button>
            )}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Quick Add</h4>
        <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" leftIcon={<IconPlusCircle className="w-4 h-4"/>} onClick={() => alert("Mock: Adding Nifty 50 companies...")}>Nifty 50</Button>
            <Button variant="secondary" size="sm" leftIcon={<IconPlusCircle className="w-4 h-4"/>} onClick={() => alert("Mock: Adding Nifty Bank companies...")}>Nifty Bank</Button>
            <Button variant="secondary" size="sm" leftIcon={<IconPlusCircle className="w-4 h-4"/>} onClick={() => alert("Mock: Adding Nifty IT companies...")}>Nifty IT</Button>
        </div>
      </div>
    </div>
  );};

  const renderCategoriesTab = () => (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-700">Manage Categories ({editingWatchlist?.categories?.length || 0} selected)</h3>
      <input 
        type="text" 
        placeholder="🔍 Filter categories..." 
        value={categorySearchTerm}
        onChange={e => setCategorySearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={() => handleSelectAllCategories(true)}>Select All</Button>
        <Button variant="secondary" size="sm" onClick={() => handleSelectAllCategories(false)}>Clear All</Button>
        <Button variant="secondary" size="sm" onClick={() => alert("Mock: Selecting common categories...")}>Select Common</Button>
      </div>
      <div className="border rounded-md p-2 max-h-80 overflow-y-auto space-y-2 bg-gray-50">
        {filteredCategoriesForEdit.map(group => (
          <div key={group.name}>
            <button 
                onClick={() => toggleSuperCategoryExpansion(group.name)}
                className="w-full flex justify-between items-center py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded"
            >
              {group.name}
              {group.expanded ? <IconChevronUp className="w-4 h-4"/> : <IconChevronDown className="w-4 h-4"/>}
            </button>
            {group.expanded && (
              <div className="pl-3 mt-1 space-y-1">
                {group.subCategories.map(subCat => (
                  <label key={subCat.name} className="flex items-center space-x-2 text-xs p-1 hover:bg-white rounded-md cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subCat.checked}
                      onChange={() => handleManageCategoriesSubCategoryToggle(group.name, subCat.name)}
                      className="form-checkbox h-3.5 w-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span>{subCat.name}</span>
                  </label>
                ))}
                {group.subCategories.length === 0 && categorySearchTerm && <p className="text-xs text-gray-400 p-1 italic">No matches in this group.</p>}
              </div>
            )}
          </div>
        ))}
        {filteredCategoriesForEdit.length === 0 && categorySearchTerm && <p className="text-xs text-gray-400 text-center p-2">No categories match your filter.</p>}
      </div>
    </div>
  );

  const renderSuperInvestorsTab = () => {
    const isSelectAllInvestorsChecked = (editingWatchlist?.superInvestors?.length || 0) > 0 && 
                                       (editingWatchlist?.superInvestors || []).every(id => investorsMarkedForRemoval.has(id));
    return (
     <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-700">Super Investors</h3>
      <input 
        type="text" 
        placeholder="🔍 Search investors to add..." 
        value={investorSearchTerm}
        onChange={e => {setInvestorSearchTerm(e.target.value); if(e.target.value) setInvestorSearchDropdownVisible(true); else setInvestorSearchDropdownVisible(false);}}
        onFocus={() => { if(investorSearchTerm) setInvestorSearchDropdownVisible(true); }}
        onBlur={() => setTimeout(() => setInvestorSearchDropdownVisible(false), 150)}
        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
      />
      {investorSearchDropdownVisible && investorSearchTerm && filteredInvestorsForSearch.length > 0 && (
         <div className="border rounded-md p-2 max-h-40 overflow-y-auto bg-gray-50 space-y-1">
            <p className="text-xs text-gray-500 mb-1">Search Results (click to add):</p>
            {filteredInvestorsForSearch.map(investor => (
                 <button 
                    key={investor.id} 
                    onMouseDown={() => { 
                        handleAddSuperInvestor(investor.id);
                        setInvestorSearchTerm(''); 
                        setInvestorSearchDropdownVisible(false);
                    }}
                    className="w-full text-left p-1.5 bg-white border rounded-md hover:bg-gray-100 text-sm"
                    disabled={editingWatchlist?.superInvestors?.includes(investor.id)}
                 >
                    {investor.name} {editingWatchlist?.superInvestors?.includes(investor.id) && <span className="text-green-500 text-xs">(Following)</span>}
                 </button>
            ))}
         </div>
      )}
       {investorSearchDropdownVisible && investorSearchTerm && filteredInvestorsForSearch.length === 0 && (
        <p className="text-xs text-gray-400 text-center p-2">No investors match your search.</p>
       )}

      <div>
        <div className="flex justify-between items-center mb-1">
            <h4 className="text-sm font-medium text-gray-600">Following ({editingWatchlist?.superInvestors?.length || 0})</h4>
            {(editingWatchlist?.superInvestors?.length || 0) > 0 && (
                <label className="flex items-center space-x-1.5 text-xs text-gray-600 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isSelectAllInvestorsChecked}
                        onChange={(e) => handleSelectAllInvestorsForRemoval(e.target.checked)}
                        className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span>Select All for Removal</span>
                </label>
            )}
        </div>
        <div className="border rounded-md p-2 min-h-[60px] max-h-40 overflow-y-auto bg-gray-50 space-y-1">
          {editingWatchlist?.superInvestors?.map(id => {
            const investor = investors.find(i => i.id === id);
            return investor ? (
              <div key={id} className="flex items-center justify-between p-1.5 bg-white border rounded-md text-sm">
                 <label className="flex items-center space-x-2 cursor-pointer flex-grow truncate">
                    <input 
                        type="checkbox"
                        checked={investorsMarkedForRemoval.has(id)} 
                        onChange={() => handleToggleInvestorMarkedForRemoval(id)}
                        className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="truncate" title={investor.name}>👤 {investor.name}</span>
                </label>
              </div>
            ) : null;
          })}
          {(editingWatchlist?.superInvestors?.length || 0) === 0 && <p className="text-xs text-gray-400 text-center p-2">Not following any specific super investors for this watchlist.</p>}
        </div>
        {investorsMarkedForRemoval.size > 0 && (
            <Button variant="danger" size="sm" leftIcon={<IconTrash className="w-4 h-4"/>} onClick={handleDeleteMarkedInvestors} className="mt-2">
                Delete Marked ({investorsMarkedForRemoval.size})
            </Button>
        )}
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Popular Investors (Click to add)</h4>
        <div className="flex flex-wrap gap-2">
            {popularInvestorsList.map(inv => (
                <Button 
                    key={inv.id}
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleAddSuperInvestor(inv.id)}
                    className={`!px-2 !py-1 ${editingWatchlist?.superInvestors?.includes(inv.id) ? 'bg-green-100 !text-green-700 !border-green-300' : ''}`}
                    leftIcon={editingWatchlist?.superInvestors?.includes(inv.id) ? <IconCheck className="w-3 h-3"/> : <IconPlus className="w-3 h-3"/>}
                    disabled={editingWatchlist?.superInvestors?.includes(inv.id)}
                >
                    {inv.name}
                </Button>
            ))}
        </div>
        <Button variant="secondary" size="sm" className="mt-3 text-xs" onClick={() => alert("Mock: Showing all 50+ investors...")}>Show All {investors.length}+ Investors</Button>
      </div>
    </div>
  );};

  const renderEditForm = () => {
    if (!editingWatchlist || !selectedWatchlistData) return null;
    const isSmartAlertsWLEditing = editingWatchlist.isSmartAlerts || false;
    const currentWLName = watchlists.find(wl => wl.id === editingWatchlist.id)?.name || "Untitled Watchlist";
    const formTitle = isSmartAlertsWLEditing ? "Smart Alerts Settings" : 
                      (currentWLName === 'Untitled Watchlist' && editingWatchlist.name === 'Untitled Watchlist' && !watchlists.some(wl => wl.id === editingWatchlist.id && wl.name !== 'Untitled Watchlist')) ? "Create New Watchlist" : "Edit Watchlist";


    return (
      <div className="p-0 h-full flex flex-col">
        <div className="flex justify-between items-center sticky top-0 bg-white pt-5 pb-3 px-6 z-10 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{formTitle}</h2>
          {(!isSmartAlertsWLEditing || formTitle === "Create New Watchlist") && ( 
            <button onClick={handleCancelEdit} title="Cancel" className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
              <IconX className="w-5 h-5"/>
            </button>
          )}
        </div>

        <div className="px-6 pt-1 pb-3 border-b">
          <nav className="flex space-x-1">
            {(['Basics', 'Companies', 'Categories', 'Super Investors'] as EditTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveEditTab(tab)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md
                  ${activeEditTab === tab ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {activeEditTab === 'Basics' && renderBasicsTab()}
            {activeEditTab === 'Companies' && renderCompaniesTab()}
            {activeEditTab === 'Categories' && renderCategoriesTab()}
            {activeEditTab === 'Super Investors' && renderSuperInvestorsTab()}
        </div>
        
        <div className="px-6 py-4 border-t sticky bottom-0 bg-white z-10 flex justify-end space-x-3">
          <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
          <Button onClick={handleSaveChanges} className="min-w-[120px]">Save Changes</Button>
        </div>
      </div>
    );
  };

  const renderViewConfiguration = () => {
    if (!selectedWatchlistData) return <div className="p-6 text-gray-500 flex items-center justify-center h-full">Select or create a watchlist to view its configuration.</div>;
    
    const alertPrefTextMap: Record<AlertPreference, string> = {
        smart_alerts: 'Smart Alerts (WhatsApp)',
        daily_summary: 'End-of-Day Summary (Email)',
        no_alerts: 'No Alerts (Manual Check)'
    };
    const alertPrefDescMap: Record<AlertPreference, string> = {
        smart_alerts: 'AI-filtered alerts within minutes.',
        daily_summary: 'Comprehensive daily digest at 9 PM IST.',
        no_alerts: 'Check updates at your convenience.'
    };

    return (
        <div className="p-6 space-y-5 h-full flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 truncate pr-4 flex items-center" title={selectedWatchlistData.name}>
                    {selectedWatchlistData.isSmartAlerts && <IconBolt className="w-5 h-5 mr-2 text-yellow-500"/>}
                    {selectedWatchlistData.name}
                </h2>
                <div className="flex space-x-2">
                    <Button 
                        onClick={() => setIsEditing(true)} 
                        variant="secondary" 
                        size="sm" 
                        leftIcon={selectedWatchlistData.isSmartAlerts ? <IconSettings className="w-4 h-4"/> :<IconEdit className="w-4 h-4"/>}
                    >
                        {selectedWatchlistData.isSmartAlerts ? "Settings" : "Edit Watchlist"}
                    </Button>
                    <Button 
                        onClick={handleViewAnnouncements} 
                        variant="primary" 
                        size="sm" 
                        leftIcon={<IconEye className="w-4 h-4" />}
                    >
                        View Announcements
                    </Button>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-md font-semibold text-gray-700 mb-1">Alert Preference</h3>
                <div className="flex items-center">
                    <p className="text-sm text-gray-800 font-medium">
                        {alertPrefTextMap[selectedWatchlistData.alertPreference] || 'Not Set'}
                    </p>
                    {selectedWatchlistData.alertPreference === 'smart_alerts' && (
                        <span title={SMART_ALERTS_TOOLTIP} className="ml-1.5">
                            <IconInfoCircle className="w-4 h-4 text-gray-500"/>
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-500">{alertPrefDescMap[selectedWatchlistData.alertPreference]}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Tracked Companies</h3>
                    <p className="text-2xl font-bold text-gray-800">{selectedWatchlistData.companies.length}</p>
                    {selectedWatchlistData.companies.length > 0 && (
                        <ul className="text-xs text-gray-500 mt-1 list-disc list-inside max-h-20 overflow-y-auto">
                            {selectedWatchlistData.companies.slice(0,3).map(id => <li key={id} className="truncate">{companies.find(c=>c.id===id)?.name || id}</li>)}
                            {selectedWatchlistData.companies.length > 3 && <li>...and {selectedWatchlistData.companies.length - 3} more</li>}
                        </ul>
                    )}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Tracked Categories</h3>
                    <p className="text-2xl font-bold text-gray-800">{selectedWatchlistData.categories.length}</p>
                     {selectedWatchlistData.categories.length > 0 && (
                        <ul className="text-xs text-gray-500 mt-1 list-disc list-inside max-h-20 overflow-y-auto">
                            {selectedWatchlistData.categories.slice(0,3).map(catName => <li key={catName} className="truncate">{catName}</li>)}
                            {selectedWatchlistData.categories.length > 3 && <li>...and {selectedWatchlistData.categories.length - 3} more</li>}
                        </ul>
                    )}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Super Investors</h3>
                    <p className="text-2xl font-bold text-gray-800">{selectedWatchlistData.superInvestors.length}</p>
                    {selectedWatchlistData.superInvestors.length > 0 && (
                        <ul className="text-xs text-gray-500 mt-1 list-disc list-inside max-h-20 overflow-y-auto">
                            {selectedWatchlistData.superInvestors.slice(0,3).map(id => <li key={id} className="truncate">{investors.find(i=>i.id===id)?.name || id}</li>)}
                            {selectedWatchlistData.superInvestors.length > 3 && <li>...and {selectedWatchlistData.superInvestors.length - 3} more</li>}
                        </ul>
                    )}
                </div>
            </div>
             {!selectedWatchlistData.isSmartAlerts && (
                <div className="mt-auto pt-5 border-t">
                    <Button 
                        onClick={handleDeleteWatchlist} 
                        variant="danger" 
                        size="sm"
                        leftIcon={<IconTrash className="w-3.5 h-3.5"/>}
                    >
                        Delete Watchlist
                    </Button>
                </div>
            )}
        </div>
    );
  };
  
  const CsvImportModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div className="relative mx-auto p-6 border w-full max-w-lg shadow-xl rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Import Companies</h3>
                <button onClick={() => setShowCsvImportModal(false)} className="p-1 rounded-full hover:bg-gray-200">
                    <IconX className="w-5 h-5 text-gray-500"/>
                </button>
            </div>
            <div className="text-center border-2 border-dashed border-gray-300 rounded-md p-8 mb-4 hover:border-blue-500 cursor-pointer">
                <IconUpload className="w-12 h-12 text-gray-400 mx-auto mb-3"/>
                <p className="text-sm text-gray-500">Drag & drop CSV file or click to browse</p>
                <input type="file" accept=".csv" className="hidden"/>
            </div>
            <p className="text-sm text-center text-gray-500 mb-2">Or paste tickers (one per line):</p>
            <textarea 
                rows={4} 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="RELIANCE&#10;TCS&#10;HDFCBANK"
            ></textarea>
            <div className="mt-5 flex justify-between items-center">
                <Button variant="secondary" size="sm" onClick={() => alert("Mock: Download template")}>Download Template</Button>
                <div>
                    <Button variant="secondary" size="sm" onClick={() => setShowCsvImportModal(false)} className="mr-2">Cancel</Button>
                    <Button variant="primary" size="sm" onClick={() => { alert("Mock: Importing companies..."); setShowCsvImportModal(false); }}>Import</Button>
                </div>
            </div>
        </div>
    </div>
  );


  return (
    <div className="flex h-full bg-white rounded-lg shadow overflow-hidden">
      {/* Left Pane */}
      <div className="w-[300px] border-r border-gray-200 p-4 flex flex-col flex-shrink-0">
        <h2 className="text-md font-semibold text-gray-700 mb-1">My Watchlists ({watchlists.filter(wl=>!wl.isSmartAlerts).length}/{MAX_WATCHLISTS - (smartAlertsWatchlist ? 1:0) })</h2>
        
        {smartAlertsWatchlist && (
            <button
                key={smartAlertsWatchlist.id}
                onClick={() => handleSelectWatchlist(smartAlertsWatchlist.id)}
                title={smartAlertsWatchlist.name}
                className={`w-full text-left px-3 py-2 my-1 rounded-md text-sm flex items-center truncate transition-colors
                            ${selectedWatchlistId === smartAlertsWatchlist.id 
                                ? 'bg-yellow-200 text-yellow-900 font-semibold' 
                                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 font-medium'}`}
            >
                <IconBolt className="w-4 h-4 mr-2 flex-shrink-0"/>
                <span className="truncate">
                    {smartAlertsWatchlist.name}
                </span>
            </button>
        )}
        
        <div className="flex-grow overflow-y-auto space-y-0.5 pr-1 -mr-1 custom-scrollbar mt-2">
          {filteredWatchlistsForList.map(wl => (
             <button
                key={wl.id}
                onClick={() => handleSelectWatchlist(wl.id)}
                title={wl.name}
                className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center truncate transition-colors
                            ${selectedWatchlistId === wl.id 
                                ? 'bg-blue-600 text-white font-medium' 
                                : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {/* Removed leading icon and (Active) text as per new spec */}
                <span className="truncate">{wl.name}</span>
              </button>
          ))}
           {watchlists.filter(wl => !wl.isSmartAlerts).length === 0 && (
            <p className="text-xs text-gray-400 p-2 text-center">No custom watchlists yet.</p>
           )}
        </div>
        <div className="mt-auto pt-4 border-t border-gray-200">
          <Button 
            onClick={handleCreateNewWatchlistClick} 
            leftIcon={<IconPlus className="w-4 h-4"/>} 
            className="w-full"
            disabled={watchlists.filter(wl=>!wl.isSmartAlerts).length >= (MAX_WATCHLISTS - (smartAlertsWatchlist ? 1:0))}
            title={watchlists.filter(wl=>!wl.isSmartAlerts).length >= (MAX_WATCHLISTS - (smartAlertsWatchlist ? 1:0)) ? `Maximum ${MAX_WATCHLISTS - (smartAlertsWatchlist ? 1:0)} custom watchlists allowed` : "Create New Watchlist"}
          >
            Create New Watchlist
          </Button>
        </div>
      </div>

      {/* Right Pane */}
      <div className="flex-grow overflow-hidden"> 
        {showCreateFlowModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Create New Watchlist</h3>
                        <button onClick={() => setShowCreateFlowModal(false)} className="p-1 rounded-full hover:bg-gray-200"><IconX className="w-5 h-5 text-gray-500"/></button>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Choose how you want to receive alerts for this new watchlist:</p>
                    <div className="space-y-3">
                        {(['smart_alerts', 'daily_summary', 'no_alerts'] as AlertPreference[]).map(pref => (
                             <div key={pref} className={`p-3 border rounded-md cursor-pointer hover:border-blue-400 ${newWlAlertPref === pref ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'}`} onClick={() => setNewWlAlertPref(pref)}>
                                <label className="flex items-start space-x-3 cursor-pointer">
                                    <input type="radio" name="createWlAlertPref" value={pref} checked={newWlAlertPref === pref} onChange={() => setNewWlAlertPref(pref)} className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-1"/>
                                    <div className="flex-1">
                                        <span className="font-medium text-gray-800">
                                            {pref === 'smart_alerts' && 'Smart Alerts'}
                                            {pref === 'daily_summary' && 'Daily Summary (Default)'}
                                            {pref === 'no_alerts' && 'No Alerts'}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {pref === 'smart_alerts' && '📱 WhatsApp notifications, ⚡ AI-processed within minutes.'}
                                            {pref === 'daily_summary' && '📧 Email digest at 9 PM IST, 📊 Comprehensive daily roundup.'}
                                            {pref === 'no_alerts' && '👁️ Manual monitoring only, 🔕 No notifications sent.'}
                                        </p>
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <Button variant="secondary" onClick={() => setShowCreateFlowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleCreateFlowContinue}>Continue →</Button>
                    </div>
                </div>
            </div>
        )}
        {selectedWatchlistId ? (isEditing ? renderEditForm() : renderViewConfiguration()) : 
            <div className="p-6 text-gray-500 flex items-center justify-center h-full text-center">
                <IconListDetails className="w-16 h-16 text-gray-300 mb-4"/>
                <p>{watchlists.length > 0 ? "Select a watchlist from the left to view or edit its configuration." : `Create your first watchlist (up to ${MAX_WATCHLISTS} allowed).`}</p>
            </div>
        }
      </div>
      {showCsvImportModal && <CsvImportModal />}
    </div>
  );
};

export default WatchlistPage;
