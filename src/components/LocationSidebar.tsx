import { useState } from 'react';
import type { Location } from '../types';

interface LocationSidebarProps {
  locations: Location[];
  onLocationSelect: (location: Location) => void;
  onNotesUpdate: (locationName: string, notes: string) => void;
}

export function LocationSidebar({ locations, onLocationSelect, onNotesUpdate }: LocationSidebarProps) {
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'alphabetical' | 'interest'>('alphabetical');

  const sortedLocations = [...locations].sort((a, b) => {
    if (sortBy === 'alphabetical') {
      return a.name.localeCompare(b.name);
    } else {
      // Sort by interest (5 = most interesting first)
      return b.levelOfInterest - a.levelOfInterest;
    }
  });

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

  const getInterestLabel = (level: number) => {
    switch (level) {
      case 1: return 'Least Interesting';
      case 2: return '';
      case 3: return 'Interesting';
      case 4: return '';
      case 5: return 'Most Interesting';
      default: return 'Unknown';
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full max-h-screen">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Locations</h2>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'alphabetical' | 'interest')}
            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="alphabetical">A-Z</option>
            <option value="interest">Interest</option>
          </select>
        </div>
        <p className="text-sm text-gray-600">{locations.length} total spots</p>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-0">
        {sortedLocations.map((location, index) => (
          <div key={`${location.name}-${index}`} className="border-b border-gray-100">
            <div 
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onLocationSelect(location)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{location.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{location.distance} mi • {location.eta} min</p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <div 
                    className={`w-3 h-3 rounded-full ${getInterestColor(location.levelOfInterest)}`}
                    title={getInterestLabel(location.levelOfInterest)}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedLocation(
                        expandedLocation === location.name ? null : location.name
                      );
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {location.keywords.split(',').slice(0, 3).map((keyword, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </div>
            
            {expandedLocation === location.name && (
              <div className="px-4 pb-4 bg-gray-50">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Address</p>
                    <p className="text-sm text-gray-600">{location.address}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Keywords</p>
                    <p className="text-sm text-gray-600">{location.keywords}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">
                      Personal Notes
                    </label>
                    <textarea
                      className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                      placeholder="Add your notes about this location..."
                      value={location.notes || ''}
                      onChange={(e) => onNotesUpdate(location.name, e.target.value)}
                    />
                  </div>
                  
                  <button
                    onClick={() => onLocationSelect(location)}
                    className="w-full py-2 px-3 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    📍 Show on Map
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
