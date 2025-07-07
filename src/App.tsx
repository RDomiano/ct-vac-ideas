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
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">🗺️ Connecticut Family Vacation Map</h1>
            <div className="flex gap-2">
              <button
                onClick={handleUpdateDistances}
                className="px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-md text-sm font-medium transition-all"
                title="Recalculate distances from 95 Main St, Stonington, CT"
              >
                📐 Update Distances
              </button>
              <button
                onClick={handleExportNotes}
                className="px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-md text-sm font-medium transition-all"
              >
                📥 Export Notes
              </button>
            </div>
          </div>
          <p className="text-blue-100 mb-3">
            Discover amazing places to visit during your family vacation in Connecticut and nearby areas!
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <span className="flex items-center gap-2">
              📍 <span className="font-medium">{locationsWithNotes.length}</span> locations
            </span>
            <span className="flex items-center gap-2">
              🎯 Color-coded by interest level
            </span>
            <span className="flex items-center gap-2">
              📱 Click markers for details
            </span>
            <span className="flex items-center gap-2">
              📝 Add personal notes (saved permanently)
            </span>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Filters and Content */}
        <div className="flex-1 p-4 flex flex-col min-h-0">
          <LocationFilters 
            locations={locationsWithNotes}
            onFilteredLocations={setFilteredLocations}
          />
          
          <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden min-h-0">
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
        
        {/* Right Sidebar */}
        <div className="w-80 flex-shrink-0">
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
