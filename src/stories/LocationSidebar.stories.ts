import type { Meta, StoryObj } from '@storybook/react-vite';
import { LocationSidebar } from '../components/LocationSidebar';
import type { Location } from '../types';

// Sample data for Storybook
const sampleLocations: Location[] = [
  {
    name: "Mystic Aquarium",
    address: "55 Coogan Blvd, Mystic, CT 06355",
    keywords: "aquarium, beluga whales, sea lions, touch tanks, family",
    levelOfInterest: 1,
    distance: 7,
    eta: 15,
    lat: 41.3542,
    lng: -71.9661,
    notes: "Kids love the beluga whales! Bring extra time for the touch tanks."
  },
  {
    name: "The Dinosaur Place",
    address: "1650 Hartford-New London Turnpike, Oakdale, CT 06370",
    keywords: "animatronic dinosaurs, playground, walking trails, family fun",
    levelOfInterest: 5,
    distance: 32,
    eta: 40,
    lat: 41.4779,
    lng: -72.1670
  },
  {
    name: "Gillette Castle State Park",
    address: "67 River Rd, East Haddam, CT 06423",
    keywords: "castle, history, architecture, river, family",
    levelOfInterest: 5,
    distance: 35,
    eta: 45,
    lat: 41.4551,
    lng: -72.4687,
    notes: "Great for photos. Pack a picnic for the grounds!"
  },
  {
    name: "Mystic Seaport Museum",
    address: "75 Greenmanville Ave, Mystic, CT 06355",
    keywords: "maritime, ships, history, hands-on, family",
    levelOfInterest: 3,
    distance: 7,
    eta: 15,
    lat: 41.3542,
    lng: -71.9650
  },
  {
    name: "Ocean Beach Park",
    address: "98 Neptune Ave, New London, CT 06320",
    keywords: "beach, boardwalk, mini golf, arcade, water park",
    levelOfInterest: 4,
    distance: 15,
    eta: 25,
    lat: 41.3557,
    lng: -72.0995
  }
];

const meta: Meta<typeof LocationSidebar> = {
  title: 'Components/LocationSidebar',
  component: LocationSidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A sidebar component that displays a scrollable list of locations with expandable details, notes functionality, and click-to-zoom map integration.'
      }
    }
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex' }}>
        <div style={{ flex: 1, background: '#f3f4f6', padding: '20px' }}>
          <p style={{ color: '#6b7280' }}>Main content area (map would go here)</p>
        </div>
        <Story />
      </div>
    ),
  ],
  args: {
    locations: sampleLocations,
    onLocationSelect: (location: Location) => {
      console.log('Location selected:', location);
    },
    onNotesUpdate: (locationName: string, notes: string) => {
      console.log('Notes updated for', locationName, ':', notes);
    }
  },
  argTypes: {
    locations: {
      description: 'Array of location objects to display in the sidebar'
    },
    onLocationSelect: {
      description: 'Callback function called when a location is selected for map zoom'
    },
    onNotesUpdate: {
      description: 'Callback function called when notes are updated for a location'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Full Location Sidebar',
  args: {
    locations: sampleLocations,
  }
};

export const WithSomeNotes: Story = {
  name: 'Sidebar with Some Notes',
  args: {
    locations: sampleLocations.map((loc, i) => ({
      ...loc,
      notes: i % 2 === 0 ? `Note for ${loc.name}` : undefined
    }))
  }
};

export const FewLocations: Story = {
  name: 'Few Locations',
  args: {
    locations: sampleLocations.slice(0, 2)
  }
};

export const EmptyState: Story = {
  name: 'No Locations',
  args: {
    locations: []
  }
};
