import { useState, useEffect } from 'react'
import './App.css'
import CTLocationsMap from './components/CTLocationsMap'
import { LocationFilters } from './components/LocationFilters'
import { LocationSidebar } from './components/LocationSidebar'
import { useCSVData } from './hooks/useCSVData'
import { saveNotesToIndexedDB, loadNotesFromIndexedDB, saveNotesToCSV } from './utils/csvWriter'
import { updateCSVDistances } from './utils/updateDistances'
import type { Location } from './types'

function App() {
  const { locations, loading, error } = useCSVData('/CT_locations.csv');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [locationsWithNotes, setLocationsWithNotes] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // Initialize locations with notes when data loads
  useEffect(() => {
    if (locations.length > 0) {
      // Load notes from IndexedDB
      loadNotesFromIndexedDB().then(notesMap => {
        const locationsWithSavedNotes = locations.map(location => ({
          ...location,
          notes: notesMap[location.name] || ''
        }));
        
        setLocationsWithNotes(locationsWithSavedNotes);
        setFilteredLocations(locationsWithSavedNotes);
      }).catch(error => {
        console.error('Error loading notes from IndexedDB:', error);
        // Fallback to localStorage
        const savedNotes = localStorage.getItem('ct-map-notes');
        const notesMap = savedNotes ? JSON.parse(savedNotes) : {};
        
        const locationsWithSavedNotes = locations.map(location => ({
          ...location,
          notes: notesMap[location.name] || ''
        }));
        
        setLocationsWithNotes(locationsWithSavedNotes);
        setFilteredLocations(locationsWithSavedNotes);
      });
    }
  }, [locations]);

  const handleNotesUpdate = (locationName: string, notes: string) => {
    // Update the location in our state
    const updatedLocations = locationsWithNotes.map(location => 
      location.name === locationName ? { ...location, notes } : location
    );
    setLocationsWithNotes(updatedLocations);
    
    // Also update filtered locations if they contain this location
    const updatedFiltered = filteredLocations.map(location => 
      location.name === locationName ? { ...location, notes } : location
    );
    setFilteredLocations(updatedFiltered);
    
    // Save to IndexedDB for persistence across sessions
    saveNotesToIndexedDB(updatedLocations).catch(error => {
      console.error('Error saving to IndexedDB:', error);
      // Fallback to localStorage
      const notesMap = updatedLocations.reduce((acc, location) => {
        if (location.notes) {
          acc[location.name] = location.notes;
        }
        return acc;
      }, {} as Record<string, string>);
      localStorage.setItem('ct-map-notes', JSON.stringify(notesMap));
    });
  };

  const handleExportNotes = () => {
    saveNotesToCSV(locationsWithNotes);
  };

  const handleUpdateDistances = async () => {
    try {
      console.log('Starting distance/ETA recalculation...');
      await updateCSVDistances();
      alert('Distance and ETA recalculation complete! Check your downloads for the updated CSV file.');
    } catch (error) {
      console.error('Error updating distances:', error);
      alert('Error updating distances. Check the console for details.');
    }
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Loading Connecticut Vacation Spots...</h2>
          <p className="text-gray-600">Preparing your family adventure map</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">Error loading locations: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">Error loading locations: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Responsive */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-6">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            {/* Mobile: Compact title */}
            <h1 className="text-lg sm:text-3xl font-bold">
              <span className="hidden sm:inline">🗺️ Connecticut Family Vacation Map</span>
              <span className="sm:hidden">🗺️ CT Vacation Map</span>
            </h1>
            
            {/* Mobile: Show only essential buttons */}
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={handleUpdateDistances}
                className="px-2 py-1 sm:px-3 sm:py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-md text-xs sm:text-sm font-medium transition-all"
                title="Recalculate distances from 95 Main St, Stonington, CT"
              >
                <span className="sm:hidden">📐</span>
                <span className="hidden sm:inline">📐 Update Distances</span>
              </button>
              <button
                onClick={handleExportNotes}
                className="px-2 py-1 sm:px-3 sm:py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-md text-xs sm:text-sm font-medium transition-all"
              >
                <span className="sm:hidden">📥</span>
                <span className="hidden sm:inline">📥 Export Notes</span>
              </button>
            </div>
          </div>
          
          {/* Mobile: Hide subtitle, Desktop: Show full description */}
          <p className="text-blue-100 mb-2 sm:mb-3 text-sm sm:text-base hidden sm:block">
            Discover amazing places to visit during your family vacation in Connecticut and nearby areas!
          </p>
          
          {/* Mobile: Show only location count, Desktop: Show all stats */}
          <div className="flex flex-wrap gap-2 sm:gap-6 text-xs sm:text-sm">
            <span className="flex items-center gap-1 sm:gap-2">
              📍 <span className="font-medium">{locationsWithNotes.length}</span> 
              <span className="hidden sm:inline">locations</span>
            </span>
            <span className="flex items-center gap-1 sm:gap-2 hidden sm:flex">
              🎯 Color-coded by interest level
            </span>
            <span className="flex items-center gap-1 sm:gap-2 hidden sm:flex">
              📱 Click markers for details
            </span>
            <span className="flex items-center gap-1 sm:gap-2 hidden sm:flex">
              📝 Add personal notes (saved permanently)
            </span>
          </div>
        </div>
      </header>
      
      {/* Main Content - Mobile-first responsive layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Mobile: Filters at top, Desktop: Left panel */}
        <div className="lg:flex-1 p-2 sm:p-4 flex flex-col min-h-0">
          <LocationFilters 
            locations={locationsWithNotes}
            onFilteredLocations={setFilteredLocations}
          />
          
          {/* Map container - Full height on mobile */}
          <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden min-h-0 mt-2 sm:mt-0" style={{ minHeight: '400px' }}>
            <CTLocationsMap 
              locations={filteredLocations}
              centerLat={41.4}
              centerLng={-72.0}
              zoom={9}
              selectedLocation={selectedLocation}
              onNotesUpdate={handleNotesUpdate}
            />
          </div>
        </div>
        
        {/* Desktop: Right Sidebar - Hidden on mobile/tablet */}
        <div className="hidden lg:block lg:w-80 flex-shrink-0">
          <LocationSidebar 
            locations={filteredLocations}
            onLocationSelect={handleLocationSelect}
            onNotesUpdate={handleNotesUpdate}
          />
        </div>
      </div>
    </div>
  )
}

export default App
