import type { Location } from '../types';
import { getCoordinateOverride } from './addressCorrections';

export function parseCSV(csvText: string): Location[] {
  const lines = csvText.trim().split('\n');
  
  // Skip header and parse each row
  return lines.slice(1).map(line => {
    // Simple CSV parser (handles basic cases)
    const values = parseCSVLine(line);
    
    return {
      name: values[0] || '',
      address: values[1] || '',
      keywords: values[2] || '',
      levelOfInterest: parseInt(values[3]) || 0,
      distance: parseFloat(values[4]) || 0,
      eta: parseInt(values[5]) || 0,
      notes: values[6] || '', // Include notes if available
    };
  }).filter(location => location.name); // Filter out empty rows
}

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

// Mock geocoding function - in a real app you'd use a geocoding service
export function addCoordinates(locations: Location[]): Location[] {
  // For Connecticut/Rhode Island area, we'll add approximate coordinates
  // In a real app, you'd use a geocoding service like Google Maps API
  const coordinateMap: Record<string, [number, number]> = {
    'Stonington': [41.3659, -71.9067],
    'Oakdale': [41.4779, -72.1670],
    'Mashantucket': [41.4779, -71.9670],
    'Mystic': [41.3542, -71.9661],
    'New London': [41.3557, -72.0995],
    'Narragansett': [41.4348, -71.4470], // Inland Narragansett, not Point Judith
    'Hartford': [41.7658, -72.6734],
    'Storrs': [41.8084, -72.2495],
    'Providence': [41.8240, -71.4128],
    'Niantic': [41.3251, -72.1995],
    'East Haddam': [41.4551, -72.4687],
    'Fall River': [41.7015, -71.1550],
    'Westerly': [41.3776, -71.8270],
    'Waterford': [41.3429, -72.1423],
    'North Kingstown': [41.5504, -71.4467],
    'South Kingstown': [41.4348, -71.5270],
    'Groton': [41.3501, -72.0781],
  };

  return locations.map(location => {
    // Check for coordinate override first
    const override = getCoordinateOverride(location.name);
    if (override) {
      return {
        ...location,
        lat: override.lat,
        lng: override.lng,
      };
    }

    // Extract city from address
    const addressParts = location.address.split(',');
    const city = addressParts[1]?.trim() || '';
    
    // Find matching coordinates
    const coords = Object.entries(coordinateMap).find(([key]) => 
      city.includes(key)
    )?.[1];

    if (coords) {
      return {
        ...location,
        lat: coords[0] + (Math.random() - 0.5) * 0.01, // Add small random offset
        lng: coords[1] + (Math.random() - 0.5) * 0.01,
      };
    }

    // Default to Connecticut center if no match
    return {
      ...location,
      lat: 41.5 + (Math.random() - 0.5) * 0.1,
      lng: -72.5 + (Math.random() - 0.5) * 0.1,
    };
  });
}
