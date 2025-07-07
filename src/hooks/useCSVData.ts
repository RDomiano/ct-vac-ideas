import { useState, useEffect } from 'react';
import type { Location } from '../types';
import { parseCSV, addCoordinates } from '../utils/csvParser';

export function useCSVData(csvPath: string) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCSV() {
      try {
        setLoading(true);
        const response = await fetch(csvPath);
        
        if (!response.ok) {
          throw new Error(`Failed to load CSV: ${response.statusText}`);
        }
        
        const csvText = await response.text();
        const parsedLocations = parseCSV(csvText);
        const locationsWithCoords = addCoordinates(parsedLocations);
        
        setLocations(locationsWithCoords);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load CSV data');
        console.error('Error loading CSV:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCSV();
  }, [csvPath]);

  return { locations, loading, error };
}
