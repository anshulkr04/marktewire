
import React, { useState, useEffect } from 'react';
import { IconDatabase, IconSparkles, IconTrash, IconTarget } from '../../constants';

interface MarketInsightsFunnelProps {
  dateRange: { // Keep dateRange for potential future direct use or display context
    startDate: string; 
    endDate: string;   
  };
  totalItemsInDateRangeFromApi: number;
  proceduralItemsInDateRangeFromApi: number;
}

interface FunnelStats {
  total_processed: number;
  procedural_filtered: number;
  relevant_shown: number;
}

const MarketInsightsFunnel: React.FC<MarketInsightsFunnelProps> = ({ 
  dateRange, 
  totalItemsInDateRangeFromApi, 
  proceduralItemsInDateRangeFromApi 
}) => {
  const [stats, setStats] = useState<FunnelStats | null>(null);

  useEffect(() => {
    // Calculate relevant_shown based on the props
    const relevant_shown = totalItemsInDateRangeFromApi - proceduralItemsInDateRangeFromApi;
    
    setStats({ 
      total_processed: totalItemsInDateRangeFromApi, 
      procedural_filtered: proceduralItemsInDateRangeFromApi, 
      relevant_shown: relevant_shown < 0 ? 0 : relevant_shown // Ensure non-negative
    });

  }, [dateRange, totalItemsInDateRangeFromApi, proceduralItemsInDateRangeFromApi]);

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-IN');
  };

  if (!stats) {
    return (
        <div className="flex items-center justify-center text-xs text-gray-500 p-1.5 bg-white rounded-md h-[34px]">
            Loading insights...
        </div>
    );
  }

  return (
    <div 
        className="flex items-center flex-wrap justify-center md:justify-start space-x-1 sm:space-x-1.5 text-xs text-gray-700 bg-white p-1.5 rounded-md min-h-[34px]"
        title="MarketWire AI: Total Processed → Procedural Removed → Actionable Insights Delivered (for selected date range)"
    >
      <div className="flex items-center" title="Total Announcements Processed (in date range)">
        <IconDatabase className="w-3.5 h-3.5 text-gray-500 mr-0.5 flex-shrink-0" />
        <span className="font-medium">{formatNumber(stats.total_processed)}</span>
      </div>

      <div className="flex items-center text-gray-400" title="Applying MarketWire AI">
        <IconSparkles className="w-3.5 h-3.5 text-blue-500 mx-0.5 flex-shrink-0"/>
        <span className="hidden sm:inline">&rarr;</span>
        <span className="sm:hidden mx-0.5">&rarr;</span>
      </div>

      <div className="flex items-center" title="Procedural Updates Removed (in date range)">
        <IconTrash className="w-3.5 h-3.5 text-red-500 mr-0.5 flex-shrink-0" />
        <span className="font-medium">{formatNumber(stats.procedural_filtered)}</span>
      </div>
      
      <span className="text-gray-400 mx-0.5">&rarr;</span>
      
      <div className="flex items-center" title="Actionable Insights Delivered (in date range)">
        <IconTarget className="w-3.5 h-3.5 text-green-500 mr-0.5 flex-shrink-0" />
        <span className="font-semibold text-green-600">{formatNumber(stats.relevant_shown)}</span>
      </div>
    </div>
  );
};

export default MarketInsightsFunnel;
