// Test geocoding for Adventureland Family Fun Park
// This can be run in the browser console to debug the geocoding issue

interface GeocodeResult {
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  class: string;
}

async function testGeocoding() {
  const address = "112 Point Judith Rd, Narragansett, RI 02882";
  
  try {
    console.log('Testing geocoding for:', address);
    
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=5`;
    
    console.log('Geocoding URL:', url);
    
    const response = await fetch(url);
    const data: GeocodeResult[] = await response.json();
    
    console.log('Geocoding results:', data);
    
    if (data && data.length > 0) {
      data.forEach((result: GeocodeResult, index: number) => {
        console.log(`Result ${index + 1}:`);
        console.log(`  Lat: ${result.lat}, Lng: ${result.lon}`);
        console.log(`  Display Name: ${result.display_name}`);
        console.log(`  Type: ${result.type}, Class: ${result.class}`);
        console.log('---');
      });
      
      // Test alternative addresses
      console.log('\nTesting alternative addresses...');
      
      const alternatives = [
        "Adventureland Family Fun Park, Narragansett, RI",
        "112 Point Judith Road, Narragansett, Rhode Island",
        "Point Judith Road, Narragansett, RI 02882"
      ];
      
      for (const altAddress of alternatives) {
        console.log(`\nTesting: ${altAddress}`);
        const altEncoded = encodeURIComponent(altAddress);
        const altUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${altEncoded}&limit=1`;
        
        const altResponse = await fetch(altUrl);
        const altData = await altResponse.json();
        
        if (altData && altData.length > 0) {
          console.log(`  → Lat: ${altData[0].lat}, Lng: ${altData[0].lon}`);
          console.log(`  → ${altData[0].display_name}`);
        } else {
          console.log('  → No results');
        }
        
        // Add delay to be respectful
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
  } catch (error) {
    console.error('Geocoding test error:', error);
  }
}

// Make available globally
declare global {
  interface Window {
    testGeocoding: () => Promise<void>;
  }
}

window.testGeocoding = testGeocoding;

export { testGeocoding };
