// Address corrections for locations that don't geocode well
export const addressCorrections: Record<string, string> = {
  // Original problematic address -> Better address
  "112 Point Judith Rd, Narragansett, RI 02882": "Adventureland Family Fun Park, 1065 Point Judith Rd, Narragansett, RI 02882",
  "Point Judith Rd, Narragansett, RI 02882": "1065 Point Judith Rd, Narragansett, RI 02882",
  
  // Add other problematic addresses here as they're discovered
  "304 Great Island Rd, Narragansett, RI 02882": "Block Island Ferry Terminal, Point Judith, RI", // This is the ferry terminal
};

// Manual coordinate overrides for locations that consistently geocode incorrectly
export const coordinateOverrides: Record<string, { lat: number; lng: number }> = {
  "Adventureland Family Fun Park": { lat: 41.4425, lng: -71.4498 }, // Approximate correct location
  "Block Island (Ferry & Island Tour)": { lat: 41.3636, lng: -71.5076 }, // Point Judith Ferry Terminal
};

export function getCorrectAddress(originalAddress: string, locationName: string): string {
  // Check if we have a coordinate override (use original address)
  if (coordinateOverrides[locationName]) {
    return originalAddress;
  }
  
  // Check if we have an address correction
  return addressCorrections[originalAddress] || originalAddress;
}

export function getCoordinateOverride(locationName: string): { lat: number; lng: number } | null {
  return coordinateOverrides[locationName] || null;
}
