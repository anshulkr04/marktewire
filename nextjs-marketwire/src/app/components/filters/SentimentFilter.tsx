
'use client'

import React from 'react'
import FilterSection from './FilterSection'
import { Sentiment } from '../../lib/types'
import { useAppContext } from '../contexts/AppContext'

const sentiments = [
  { value: Sentiment.Positive, label: 'Positive', color: 'bg-green-500' },
  { value: Sentiment.Neutral, label: 'Neutral', color: 'bg-yellow-500' },
  { value: Sentiment.Negative, label: 'Negative', color: 'bg-red-500' },
];

const SentimentFilter: React.FC = () => {
  const { selectedSentimentFilters, setSelectedSentimentFilters } = useAppContext();

  const handleCheckboxChange = (sentimentValue: Sentiment) => {
    setSelectedSentimentFilters(prev => 
      prev.includes(sentimentValue) 
        ? prev.filter(val => val !== sentimentValue)
        : [...prev, sentimentValue]
    );
  };

  return (
    <FilterSection title="Sentiment">
      {sentiments.map((sentiment) => (
        <label key={sentiment.value} className="flex items-center space-x-2 text-sm text-gray-600 hover:bg-gray-100 p-1 rounded-md cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={selectedSentimentFilters.includes(sentiment.value)}
            onChange={() => handleCheckboxChange(sentiment.value)}
          />
          <span className={`w-3 h-3 rounded-full ${sentiment.color}`}></span>
          <span>{sentiment.label}</span>
        </label>
      ))}
    </FilterSection>
  );
};

export default SentimentFilter;
    