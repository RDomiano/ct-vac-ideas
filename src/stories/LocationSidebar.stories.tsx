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
  }
];

const meta: Meta<typeof LocationSidebar> = {
  title: 'Components/LocationSidebar',
  component: LocationSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    locations: sampleLocations,
    onLocationSelect: (location: Location) => {
      console.log('Location selected:', location);
    },
    onNotesUpdate: (locationName: string, notes: string) => {
      console.log('Notes updated for', locationName, ':', notes);
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    locations: sampleLocations,
  }
};
