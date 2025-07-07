// Utility to recalculate distances and ETAs from a fixed origin point

import { getCorrectAddress, getCoordinateOverride } from './addressCorrections';

// Origin point: 95 Main Street, Stonington, CT
const ORIGIN_LAT = 41.3387;
const ORIGIN_LNG = -71.9076;

// Haversine formula to calculate distance between two points on Earth
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Estimate ETA based on distance and typical driving conditions
function calculateETA(distanceMiles: number): number {
  // Average speed assumptions:
  // - Local driving (0-5 miles): 25 mph average (traffic, lights, etc.)
  // - Medium distance (5-20 miles): 35 mph average 
  // - Longer distance (20+ miles): 45 mph average (more highway)
  
  let avgSpeed: number;
  if (distanceMiles <= 5) {
    avgSpeed = 25;
  } else if (distanceMiles <= 20) {
    avgSpeed = 35;
  } else {
    avgSpeed = 45;
  }
  
  const timeHours = distanceMiles / avgSpeed;
  const timeMinutes = timeHours * 60;
  
  // Round to nearest 5 minutes for practical estimates
  return Math.round(timeMinutes / 5) * 5;
}

// Geocoding function to get coordinates for addresses
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    // Using OpenStreetMap Nominatim API (free, no API key required)
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=5`;
    
    const response = await fetch(url);
    const data: Array<{lat: string; lon: string; type: string; class: string}> = await response.json();
    
    if (data && data.length > 0) {
      // Try to pick the best result - prefer addresses over just place names
      // and avoid results that might be in water (like harbors, points, etc.)
      const bestResult = data.find((result) => 
        result.type === 'house' || 
        result.type === 'building' ||
        result.type === 'commercial' ||
        result.class === 'building' ||
        result.class === 'place'
      ) || data[0]; // fallback to first result
      
      return {
        lat: parseFloat(bestResult.lat),
        lng: parseFloat(bestResult.lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error for address:', address, error);
    return null;
  }
}

// Main function to recalculate distance and ETA for a location
export async function recalculateLocationMetrics(address: string, locationName?: string): Promise<{ distance: number; eta: number } | null> {
  // Check for coordinate override first
  if (locationName) {
    const coordOverride = getCoordinateOverride(locationName);
    if (coordOverride) {
      const distance = calculateDistance(ORIGIN_LAT, ORIGIN_LNG, coordOverride.lat, coordOverride.lng);
      const eta = calculateETA(distance);
      
      return {
        distance: Math.round(distance * 10) / 10,
        eta: eta
      };
    }
  }
  
  // Use corrected address if available
  const correctedAddress = getCorrectAddress(address, locationName || '');
  const coords = await geocodeAddress(correctedAddress);
  
  if (!coords) {
    console.warn('Could not geocode address:', correctedAddress);
    return null;
  }
  
  const distance = calculateDistance(ORIGIN_LAT, ORIGIN_LNG, coords.lat, coords.lng);
  const eta = calculateETA(distance);
  
  return {
    distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
    eta: eta
  };
}

// Function to recalculate all locations in CSV format
export async function recalculateAllLocations(csvText: string): Promise<string> {
  const lines = csvText.trim().split('\n');
  const header = lines[0];
  const dataLines = lines.slice(1);
  
  const updatedLines = [header];
  
  console.log('Starting distance/ETA recalculation from 95 Main Street, Stonington, CT...');
  
  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i];
    if (!line.trim()) continue;
    
    // Parse the CSV line
    const values = parseCSVLine(line);
    if (values.length < 6) continue;
    
    const address = values[1]; // Address is in column 2
    const locationName = values[0]; // Location name is in column 1
    console.log(`Processing ${i + 1}/${dataLines.length}: ${locationName} at ${address}`);
    
    const metrics = await recalculateLocationMetrics(address, locationName);
    
    if (metrics) {
      // Update distance and ETA columns (indices 4 and 5)
      values[4] = metrics.distance.toString();
      values[5] = metrics.eta.toString();
      console.log(`  → ${metrics.distance} miles, ${metrics.eta} minutes`);
    } else {
      console.warn(`  → Could not calculate metrics for ${values[0]}`);
    }
    
    // Rebuild the CSV line
    const updatedLine = values.map(value => {
      // Re-quote values that contain commas
      if (value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
    
    updatedLines.push(updatedLine);
    
    // Add a small delay to be respectful to the geocoding API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('Distance/ETA recalculation complete!');
  return updatedLines.join('\n');
}

// Helper function to parse CSV line (same as in csvParser.ts)
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last value
  values.push(current.trim());
  
  // Clean up quoted values by removing surrounding quotes
  return values.map(value => {
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }
    return value;
  });
}
