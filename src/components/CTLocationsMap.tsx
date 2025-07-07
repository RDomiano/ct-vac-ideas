import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useEffect } from 'react';
import type { MapProps, Location } from '../types';
import 'leaflet/dist/leaflet.css';

// Map updater component to handle programmatic pan/zoom
interface MapUpdaterProps {
  center?: [number, number];
  zoom?: number;
}

function MapUpdater({ center, zoom }: MapUpdaterProps) {
  const map = useMap();
  
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);
  
  return null;
}
const createInterestIcon = (level: number) => {
  const colors = {
    1: '#94a3b8', // Gray - Least interesting  
    2: '#60a5fa', // Light blue
    3: '#3b82f6', // Blue - Interesting
    4: '#1d4ed8', // Dark blue
    5: '#7c3aed', // Purple - Most interesting
  };
  
  const color = colors[level as keyof typeof colors] || '#888888';
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="${color}"/>
        <circle cx="12.5" cy="12.5" r="6" fill="white"/>
        <text x="12.5" y="17" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="${color}">${level}</text>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

interface LocationMarkerProps {
  location: Location;
  onNotesUpdate?: (locationName: string, notes: string) => void;
}

function LocationMarker({ location, onNotesUpdate }: LocationMarkerProps) {
  if (!location.lat || !location.lng) {
    return null;
  }

  const icon = createInterestIcon(location.levelOfInterest);

  return (
    <Marker 
      position={[location.lat, location.lng]} 
      icon={icon}
    >
      <Popup maxWidth={300} minWidth={250} className="custom-popup">
        <div className="p-1 sm:p-2">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2 border-b border-gray-200 pb-1">
            {location.name}
          </h3>
          
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <div>
              <span className="font-medium text-gray-700">📍 Address:</span>
              <p className="text-gray-600 mt-0.5 sm:mt-1 text-xs sm:text-sm">{location.address}</p>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">🏷️ Keywords:</span>
              <div className="flex flex-wrap gap-1 mt-0.5 sm:mt-1">
                {location.keywords.split(',').slice(0, 4).map((keyword, i) => (
                  <span 
                    key={i}
                    className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                  >
                    {keyword.trim()}
                  </span>
                ))}
                {location.keywords.split(',').length > 4 && (
                  <span className="text-xs text-gray-500">+{location.keywords.split(',').length - 4} more</span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-1 sm:pt-2 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <span className="font-medium">Interest:</span>
                  <div 
                    className={`w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full ${
                      location.levelOfInterest === 1 ? 'bg-slate-400' :
                      location.levelOfInterest === 2 ? 'bg-blue-400' :
                      location.levelOfInterest === 3 ? 'bg-blue-500' :
                      location.levelOfInterest === 4 ? 'bg-blue-600' : 'bg-purple-600'
                    }`}
                  />
                  <span>{location.levelOfInterest}/5</span>
                </span>
                <span><span className="font-medium">Distance:</span> {location.distance} mi</span>
                <span><span className="font-medium">ETA:</span> {location.eta} min</span>
              </div>
            </div>
            
            {onNotesUpdate && (
              <div className="pt-1 sm:pt-2 border-t border-gray-100">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  📝 Personal Notes
                </label>
                <textarea
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  rows={2}
                  placeholder="Add your notes..."
                  value={location.notes || ''}
                  onChange={(e) => onNotesUpdate(location.name, e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export function CTLocationsMap({ 
  locations, 
  centerLat = 41.5, 
  centerLng = -72.0, 
  zoom = 9,
  selectedLocation,
  onNotesUpdate
}: MapProps) {
  const validLocations = locations.filter(loc => loc.lat && loc.lng);

  // Determine map center and zoom based on selected location
  const mapCenter: [number, number] = selectedLocation && selectedLocation.lat && selectedLocation.lng
    ? [selectedLocation.lat, selectedLocation.lng]
    : [centerLat, centerLng];
  
  const mapZoom = selectedLocation ? 13 : zoom;

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="h-full w-full rounded-lg"
        key={selectedLocation ? `${selectedLocation.lat}-${selectedLocation.lng}` : 'default'}
        touchZoom={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater 
          center={mapCenter} 
          zoom={mapZoom}
        />
        
        {validLocations.map((location, index) => (
          <LocationMarker 
            key={`${location.name}-${index}`} 
            location={location}
            onNotesUpdate={onNotesUpdate}
          />
        ))}
      </MapContainer>
      
      {/* Mobile-responsive Legend */}
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white rounded-lg shadow-lg p-2 sm:p-3 z-[1000] max-w-xs">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2">
          <span className="hidden sm:inline">Interest Level</span>
          <span className="sm:hidden">Interest</span>
        </h4>
        <div className="space-y-0.5 sm:space-y-1">
          {[1, 2, 3, 4, 5].map(level => {
            const colors: Record<number, string> = {
              1: 'bg-slate-400',
              2: 'bg-blue-400', 
              3: 'bg-blue-500',
              4: 'bg-blue-600',
              5: 'bg-purple-600'
            };
            const labels: Record<number, string> = {
              1: 'Least Interesting',
              2: '',
              3: 'Interesting',
              4: '',
              5: 'Most Interesting'
            };
            
            return (
              <div key={level} className="flex items-center gap-1 sm:gap-2">
                <div className={`w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full ${colors[level]}`} />
                <span className="text-xs text-gray-700">
                  {level}
                  {/* Mobile: Hide labels except for extreme values */}
                  <span className="hidden sm:inline">
                    {labels[level] && ` - ${labels[level]}`}
                  </span>
                  <span className="sm:hidden">
                    {(level === 1 || level === 5) && labels[level] ? ` - ${labels[level]}` : ''}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CTLocationsMap;
