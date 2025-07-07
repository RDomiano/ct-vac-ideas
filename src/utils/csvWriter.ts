import type { Location } from '../types';

export const saveNotesToCSV = async (locations: Location[]) => {
  // Create CSV content with notes
  const headers = ['Name', 'Address', 'Keywords', 'Level of Interest', 'Distance (miles)', 'ETA (minutes)', 'Notes'];
  
  const csvRows = [
    headers.join(','),
    ...locations.map(location => {
      const row = [
        `"${location.name.replace(/"/g, '""')}"`,
        `"${location.address.replace(/"/g, '""')}"`,
        `"${location.keywords.replace(/"/g, '""')}"`,
        location.levelOfInterest.toString(),
        location.distance.toString(),
        location.eta.toString(),
        `"${(location.notes || '').replace(/"/g, '""')}"`
      ];
      return row.join(',');
    })
  ];
  
  const csvContent = csvRows.join('\n');
  
  // Create a blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'CT_locations_with_notes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// For server-side saving (if you have a backend)
export const saveNotesToServer = async (locations: Location[]) => {
  try {
    const response = await fetch('/api/save-notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ locations }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save notes to server');
    }
    
    return true;
  } catch (error) {
    console.error('Error saving notes to server:', error);
    return false;
  }
};

// For browser-based storage that persists across sessions
export const saveNotesToIndexedDB = async (locations: Location[]) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CTMapNotes', 1);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      
      // Save each location's notes
      locations.forEach(location => {
        if (location.notes) {
          store.put({
            locationName: location.name,
            notes: location.notes,
            timestamp: new Date().toISOString()
          });
        }
      });
      
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('notes')) {
        const store = db.createObjectStore('notes', { keyPath: 'locationName' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

export const loadNotesFromIndexedDB = async (): Promise<Record<string, string>> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CTMapNotes', 1);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['notes'], 'readonly');
      const store = transaction.objectStore('notes');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        const notes: Record<string, string> = {};
        getAllRequest.result.forEach((item: { locationName: string; notes: string; timestamp: string }) => {
          notes[item.locationName] = item.notes;
        });
        resolve(notes);
      };
      
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('notes')) {
        const store = db.createObjectStore('notes', { keyPath: 'locationName' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};
