export interface Location {
  name: string;
  address: string;
  keywords: string;
  levelOfInterest: number;
  distance: number;
  eta: number;
  // These will be populated by geocoding
  lat?: number;
  lng?: number;
  // User-editable notes
  notes?: string;
}

export interface MapProps {
  locations: Location[];
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  selectedLocation?: Location | null;
  onNotesUpdate?: (locationName: string, notes: string) => void;
}
