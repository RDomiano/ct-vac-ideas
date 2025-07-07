import type { Meta, StoryObj } from '@storybook/react-vite';
import CTLocationsMap from '../components/CTLocationsMap';
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
    lng: -71.9661
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
    lng: -72.4687
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

const meta: Meta<typeof CTLocationsMap> = {
  title: 'Components/CTLocationsMap',
  component: CTLocationsMap,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'An interactive map displaying Connecticut family vacation locations with color-coded interest levels and detailed popups.'
      }
    }
  },
  args: {
    locations: sampleLocations,
    centerLat: 41.4,
    centerLng: -72.0,
    zoom: 9
  },
  argTypes: {
    centerLat: {
      control: { type: 'number', min: 40, max: 43, step: 0.1 },
      description: 'Latitude for map center'
    },
    centerLng: {
      control: { type: 'number', min: -74, max: -70, step: 0.1 },
      description: 'Longitude for map center'
    },
    zoom: {
      control: { type: 'range', min: 6, max: 15, step: 1 },
      description: 'Map zoom level'
    },
    locations: {
      description: 'Array of location objects to display on the map'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Connecticut Locations Map',
  args: {
    locations: sampleLocations,
    centerLat: 41.4,
    centerLng: -72.0,
    zoom: 9
  }
};

export const ZoomedIn: Story = {
  name: 'Mystic Area (Zoomed In)',
  args: {
    locations: sampleLocations,
    centerLat: 41.354,
    centerLng: -71.966,
    zoom: 12
  }
};

export const SingleLocation: Story = {
  args: {
    locations: [sampleLocations[0]], // Just Mystic Aquarium
    centerLat: 41.354,
    centerLng: -71.966,
    zoom: 13
  }
};

export const HighInterestOnly: Story = {
  name: 'High Interest Locations Only',
  args: {
    locations: sampleLocations.filter(loc => loc.levelOfInterest <= 2),
    centerLat: 41.4,
    centerLng: -72.0,
    zoom: 9
  }
};

export const EmptyMap: Story = {
  args: {
    locations: [],
    centerLat: 41.4,
    centerLng: -72.0,
    zoom: 9
  }
};
