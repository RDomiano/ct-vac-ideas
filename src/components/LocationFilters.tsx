import { useState } from 'react';
import type { Location } from '../types';

interface LocationFiltersProps {
  locations: Location[];
  onFilteredLocations: (locations: Location[]) => void;
}

export function LocationFilters({ locations, onFilteredLocations }: LocationFiltersProps) {
  const [selectedInterestLevels, setSelectedInterestLevels] = useState<number[]>([1, 2, 3, 4, 5]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInterestLevelToggle = (level: number) => {
    const newLevels = selectedInterestLevels.includes(level)
      ? selectedInterestLevels.filter(l => l !== level)
      : [...selectedInterestLevels, level];
    
    setSelectedInterestLevels(newLevels);
    applyFilters(newLevels, searchTerm);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    applyFilters(selectedInterestLevels, term);
  };

  const applyFilters = (interestLevels: number[], search: string) => {
    const filtered = locations.filter(location => {
      const matchesInterest = interestLevels.includes(location.levelOfInterest);
      const matchesSearch = search === '' || 
        location.name.toLowerCase().includes(search.toLowerCase()) ||
        location.keywords.toLowerCase().includes(search.toLowerCase()) ||
        location.address.toLowerCase().includes(search.toLowerCase()) ||
        location.notes?.toLowerCase().includes(search.toLowerCase());
      
      return matchesInterest && matchesSearch;
    });
    
    onFilteredLocations(filtered);
  };

  const resetFilters = () => {
    setSelectedInterestLevels([1, 2, 3, 4, 5]);
    setSearchTerm('');
    onFilteredLocations(locations);
  };

  const filteredCount = locations.filter(loc => {
    const matchesInterest = selectedInterestLevels.includes(loc.levelOfInterest);
    const matchesSearch = searchTerm === '' || 
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.keywords.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesInterest && matchesSearch;
  }).length;

  const getInterestColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-slate-400';
      case 2: return 'bg-blue-400';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-blue-600';
      case 5: return 'bg-purple-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-2 sm:p-3 mb-2 sm:mb-3">
      {/* Mobile: Compact header */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 className="text-sm sm:text-md font-semibold text-gray-800">
          <span className="hidden sm:inline">🔍 Filter Locations</span>
          <span className="sm:hidden">🔍 Filters</span>
        </h3>
        <span className="text-xs text-gray-500">{filteredCount}/{locations.length}</span>
      </div>
      
      {/* Search - More compact on mobile */}
      <div className="mb-2 sm:mb-3">
        <input
          type="text"
          placeholder="Search locations..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Mobile: Horizontal scrollable interest filters */}
      <div className="mb-1 sm:mb-2">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700">Interest Level</label>
          <button
            onClick={resetFilters}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Reset
          </button>
        </div>
        
        {/* Mobile: Horizontal scroll, Desktop: Flex wrap */}
        <div className="flex gap-1 overflow-x-auto sm:flex-wrap pb-1 sm:pb-0">
          {[5, 4, 3, 2, 1].map(level => (
            <label 
              key={level} 
              className="flex items-center gap-1 cursor-pointer px-2 py-1 rounded-md hover:bg-gray-50 border border-gray-200 flex-shrink-0 min-w-fit"
            >
              <input
                type="checkbox"
                checked={selectedInterestLevels.includes(level)}
                onChange={() => handleInterestLevelToggle(level)}
                className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div 
                className={`w-3 h-3 rounded-full ${getInterestColor(level)}`}
              />
              <span className="text-xs font-medium text-gray-700">{level}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LocationFilters;
