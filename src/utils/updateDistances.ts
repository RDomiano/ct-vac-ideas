// Script to recalculate distances and ETAs in the CSV file
// Run this in the browser console or as a standalone utility

import { recalculateAllLocations } from './distanceCalculator';

export async function updateCSVDistances() {
  try {
    // Load the current CSV file
    const response = await fetch('/CT_locations.csv');
    const csvText = await response.text();
    
    console.log('Loaded CSV file, starting recalculation...');
    
    // Recalculate all distances and ETAs
    const updatedCSV = await recalculateAllLocations(csvText);
    
    // Create a downloadable file
    const blob = new Blob([updatedCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'CT_locations_updated_distances.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    console.log('Updated CSV file downloaded successfully!');
    return updatedCSV;
    
  } catch (error) {
    console.error('Error updating CSV distances:', error);
    throw error;
  }
}

// Make it available globally for browser console use
declare global {
  interface Window {
    updateCSVDistances: () => Promise<string>;
  }
}

window.updateCSVDistances = updateCSVDistances;
