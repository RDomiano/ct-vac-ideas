// Standalone Node.js script to recalculate distances from 95 Main Street, Stonington, CT
// Run with: node scripts/recalculate-distances.js

const fs = require('fs');
const path = require('path');

// Origin point: 95 Main Street, Stonington, CT
const ORIGIN_LAT = 41.3387;
const ORIGIN_LNG = -71.9076;

// Haversine formula to calculate distance between two points on Earth
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Estimate ETA based on distance
function calculateETA(distanceMiles) {
  let avgSpeed;
  if (distanceMiles <= 5) {
    avgSpeed = 25;
  } else if (distanceMiles <= 20) {
    avgSpeed = 35;
  } else {
    avgSpeed = 45;
  }
  
  const timeHours = distanceMiles / avgSpeed;
  const timeMinutes = timeHours * 60;
  
  // Round to nearest 5 minutes
  return Math.round(timeMinutes / 5) * 5;
}

// Simple geocoding using OpenStreetMap
async function geocodeAddress(address) {
  try {
    const fetch = (await import('node-fetch')).default;
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error for address:', address, error);
    return null;
  }
}

function parseCSVLine(line) {
  const values = [];
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
  
  values.push(current.trim());
  
  return values.map(value => {
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }
    return value;
  });
}

async function main() {
  try {
    const csvPath = path.join(__dirname, '../public/CT_locations.csv');
    const csvText = fs.readFileSync(csvPath, 'utf8');
    
    const lines = csvText.trim().split('\n');
    const header = lines[0];
    const dataLines = lines.slice(1);
    
    const updatedLines = [header];
    
    console.log('Starting distance/ETA recalculation from 95 Main Street, Stonington, CT...');
    console.log(`Processing ${dataLines.length} locations...`);
    
    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      if (!line.trim()) continue;
      
      const values = parseCSVLine(line);
      if (values.length < 6) continue;
      
      const name = values[0];
      const address = values[1];
      
      console.log(`${i + 1}/${dataLines.length}: ${name}`);
      console.log(`  Address: ${address}`);
      
      const coords = await geocodeAddress(address);
      
      if (coords) {
        const distance = calculateDistance(ORIGIN_LAT, ORIGIN_LNG, coords.lat, coords.lng);
        const eta = calculateETA(distance);
        
        values[4] = (Math.round(distance * 10) / 10).toString();
        values[5] = eta.toString();
        
        console.log(`  → ${values[4]} miles, ${values[5]} minutes`);
      } else {
        console.warn(`  → Could not geocode address`);
      }
      
      // Rebuild the CSV line
      const updatedLine = values.map(value => {
        if (value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',');
      
      updatedLines.push(updatedLine);
      
      // Be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    const updatedCSV = updatedLines.join('\n');
    const outputPath = path.join(__dirname, '../public/CT_locations_updated.csv');
    
    fs.writeFileSync(outputPath, updatedCSV, 'utf8');
    
    console.log('\n✅ Distance/ETA recalculation complete!');
    console.log(`Updated file saved as: ${outputPath}`);
    console.log('\nTo use the updated file:');
    console.log('1. Replace CT_locations.csv with CT_locations_updated.csv');
    console.log('2. Or rename CT_locations_updated.csv to CT_locations.csv');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
