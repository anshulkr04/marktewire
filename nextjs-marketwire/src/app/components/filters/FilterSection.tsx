
import React, { useState, ReactNode } from 'react';
import { IconChevronDown, IconChevronUp } from '../../constants';

interface FilterSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="py-3 border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left focus:outline-none"
      >
        <h4 className="text-sm font-medium text-gray-700 uppercase">{title}</h4>
        {isOpen ? <IconChevronUp className="w-5 h-5 text-gray-500" /> : <IconChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="mt-3 space-y-2 pl-1 pr-1">
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterSection;
    