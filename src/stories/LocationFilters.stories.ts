import type { Meta, StoryObj } from '@storybook/react-vite';
import { LocationFilters } from '../components/LocationFilters';
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

const meta: Meta<typeof LocationFilters> = {
  title: 'Components/LocationFilters',
  component: LocationFilters,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A filter component that allows users to search and filter locations by interest level.'
      }
    }
  },
  args: {
    locations: sampleLocations,
    onFilteredLocations: (locations: Location[]) => {
      console.log('Filtered locations:', locations);
    }
  },
  argTypes: {
    locations: {
      description: 'Array of location objects to filter'
    },
    onFilteredLocations: {
      description: 'Callback function called when filters change'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Location Filters',
  args: {
    locations: sampleLocations,
    onFilteredLocations: (locations: Location[]) => {
      console.log('Filtered locations:', locations);
    }
  }
};

export const ManyLocations: Story = {
  args: {
    locations: [
      ...sampleLocations,
      ...sampleLocations.map((loc, i) => ({
        ...loc,
        name: loc.name + ` (${i + 1})`,
        levelOfInterest: (i % 5) + 1 as 1 | 2 | 3 | 4 | 5
      }))
    ],
    onFilteredLocations: (locations: Location[]) => {
      console.log('Filtered locations:', locations);
    }
  }
};
