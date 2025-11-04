
'use client'

import React, { useMemo } from 'react'
import FilterSection from './FilterSection'
import { useAppContext } from '../contexts/AppContext'
import { FilterCategory } from '../../lib/types'

const CategoryFilter: React.FC = () => {
  const { 
    categoryFilters, 
    showProceduralAdminNews, 
    setShowProceduralAdminNews,
    isSelectAllCategoriesActive,
    toggleSelectAllCategories,
    setSubCategoryChecked,
  } = useAppContext();

  const handleSubCategoryCheck = (superCategoryName: string, subCategoryName: string, checked: boolean) => {
    setSubCategoryChecked(superCategoryName, subCategoryName, checked);
  };

  const handleProceduralAdminToggle = (checked: boolean) => {
    setShowProceduralAdminNews(checked);
  };

  const handleSelectAllCategoriesToggle = (checked: boolean) => {
    toggleSelectAllCategories(checked);
  };
  
  const sortedCategoryFilters = useMemo(() => {
    return [...categoryFilters].sort((a, b) => {
      const countA = a.subCategories.reduce((sum, sub) => sum + sub.count, 0);
      const countB = b.subCategories.reduce((sum, sub) => sum + sub.count, 0);
      return countB - countA; // Sort descending by total count
    });
  }, [categoryFilters]);


  return (
    <FilterSection title="Category" defaultOpen={true}>
      {/* Select All Categories Toggle */}
      <div className="mb-2 pb-2 border-b border-gray-100">
        <label 
          className={`flex items-center space-x-2 text-sm text-gray-700 p-1.5 rounded-md 
                     ${showProceduralAdminNews ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}`}
        >
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={isSelectAllCategoriesActive}
            onChange={(e) => handleSelectAllCategoriesToggle(e.target.checked)}
            disabled={showProceduralAdminNews}
            aria-label="Select all categories"
          />
          <span>Select All Categories</span>
        </label>
      </div>

      {sortedCategoryFilters.map((superCategory: FilterCategory) => (
        <div key={superCategory.name} className="pt-2 pb-1 border-b border-gray-100 last:border-b-0">
          <div className="mb-1"> 
            <h5 className="text-sm font-semibold text-gray-800"> 
              {superCategory.name}
            </h5>
            {/* TODO: Add super-category level checkbox if desired:
            <label className="flex items-center space-x-2 text-sm mb-1 cursor-pointer">
              <input 
                type="checkbox" 
                // checked={superCategory.allChecked} 
                // onChange={(e) => handleSuperCategoryToggle(superCategory.name, e.target.checked)}
                disabled={showProceduralAdminNews || isSelectAllCategoriesActive} // If all selected, individual super toggles might be confusing
                className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span>Select All in {superCategory.name}</span>
            </label>
            */}
          </div>
          
          <div className="pl-2 mt-1 space-y-1"> 
            {superCategory.subCategories.map((subCategory) => (
              <label 
                key={subCategory.name} 
                className={`flex items-center space-x-2 text-xs text-gray-600 p-1.5 rounded-md 
                           ${showProceduralAdminNews ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}`}
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={subCategory.checked || false} // Individual sub-category state
                  onChange={(e) => handleSubCategoryCheck(superCategory.name, subCategory.name, e.target.checked)}
                  disabled={showProceduralAdminNews}
                  aria-label={`${subCategory.name} (${subCategory.count})`}
                />
                <span>{subCategory.name} ({subCategory.count})</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      {/* Procedural/Admin News Toggle */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <label className="flex items-center justify-between space-x-2 text-sm text-gray-700 hover:bg-gray-100 p-1.5 rounded-md cursor-pointer">
          <span>Show Procedural/Admin News</span>
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={showProceduralAdminNews}
            onChange={(e) => handleProceduralAdminToggle(e.target.checked)}
            aria-label="Show procedural or administrative news"
          />
        </label>
      </div>
    </FilterSection>
  );
};

export default CategoryFilter;
