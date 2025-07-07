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
      <Popup maxWidth={350} className="custom-popup">
        <div className="p-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">
            {location.name}
          </h3>
          
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">📍 Address:</span>
              <p className="text-gray-600 mt-1">{location.address}</p>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">🏷️ Keywords:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {location.keywords.split(',').map((keyword, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <span className="font-medium">Interest:</span>
                  <div 
                    className={`w-3 h-3 rounded-full ${
                      location.levelOfInterest === 1 ? 'bg-red-500' :
                      location.levelOfInterest === 2 ? 'bg-orange-500' :
                      location.levelOfInterest === 3 ? 'bg-yellow-500' :
                      location.levelOfInterest === 4 ? 'bg-lime-500' : 'bg-green-500'
                    }`}
                  />
                  <span>{location.levelOfInterest}/5</span>
                </span>
                <span><span className="font-medium">Distance:</span> {location.distance} mi</span>
                <span><span className="font-medium">ETA:</span> {location.eta} min</span>
              </div>
            </div>
            
            {onNotesUpdate && (
              <div className="pt-2 border-t border-gray-100">
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
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Interest Level</h4>
        <div className="space-y-1">
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
              <div key={level} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colors[level]}`} />
                <span className="text-xs text-gray-700">
                  {level}{labels[level] && ` - ${labels[level]}`}
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
