# Connecticut Family Vacation Map

A beautiful, interactive web application built with React, Leaflet, and Storybook to help families discover amazing vacation spots in Connecticut and nearby areas.

🌐 **Live Demo**: [https://ct-vac-ideas.vercel.app](https://ct-vac-ideas.vercel.app)

## Features

- 🗺️ **Interactive Map**: Explore locations on a full-featured map powered by Leaflet
- 🎯 **Interest Level Coding**: Color-coded markers based on your interest level (1-5)
- 🔍 **Smart Filtering**: Search by name, keywords, or address
- 📱 **Responsive Design**: Works great on desktop and mobile devices
- 📋 **Detailed Popups**: Click markers to see location details, distance, and estimated travel time
- 📝 **Personal Notes**: Add and edit your own notes for each location (saved locally)
- 📊 **Sidebar Navigation**: Browse locations in a sortable, filterable sidebar
- 🎨 **Component Library**: Built with Storybook for easy component development

## Interest Level Legend

The priority system ranges from 1 (least interesting) to 5 (most interesting):

- � **Level 5** (Purple): Most Interesting - Absolute must-see destinations!
- � **Level 4** (Blue): Very Interesting - High priority locations
- � **Level 3** (Green): Moderately Interesting - Worth visiting
- � **Level 2** (Yellow): Somewhat Interesting - Nice if you have time
- � **Level 1** (Orange): Least Interesting - Optional visits

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser and visit:** http://localhost:5173

4. **Run Storybook (for component development):**
   ```bash
   npm run storybook
   ```

## How to Use

### Main App
1. Open the app in your browser (or visit the live demo at [ct-vac-ideas.vercel.app](https://ct-vac-ideas.vercel.app))
2. Use the **search bar** to find specific locations by name, keywords, or address
3. **Filter by interest level** using the checkboxes - uncheck levels you don't want to see
4. **Click on map markers** to see detailed information about each location
5. Use the **legend** in the top-right corner to understand the color coding
6. **Add personal notes** by clicking on markers or using the sidebar
7. **Browse locations** using the sidebar on the left for detailed sorting and filtering

### Adding Personal Notes
- Click on any marker popup and use the "Add Note" or "Edit Note" buttons
- Use the sidebar to view and edit notes for each location
- Notes are automatically saved to your browser's local storage

### Adding New Locations
To add new locations to the map:

1. Edit the `public/CT_locations.csv` file
2. Add new rows with the following format:
   ```
   Name,Address,Keywords,Level of Interest,Distance (miles),ETA (min),Notes
   ```
3. Save the file and refresh the app
4. Use the "Update Distances" button in the app to recalculate distances from your base location

### Storybook Development
View and develop components in isolation:
```bash
npm run storybook
```

## Project Structure

```
src/
├── components/          # React components
│   ├── CTLocationsMap.tsx     # Main map component with popups and legend
│   ├── LocationFilters.tsx    # Search and filter component
│   └── LocationSidebar.tsx    # Sidebar with location list and notes
├── hooks/              # Custom React hooks
│   └── useCSVData.ts         # Hook for loading CSV data
├── types/              # TypeScript type definitions
│   └── index.ts             # Location and map types
├── utils/              # Utility functions
│   ├── csvParser.ts         # CSV parsing and geocoding
│   ├── csvWriter.ts         # CSV export with notes
│   ├── distanceCalculator.ts # Distance/ETA calculation
│   └── addressCorrections.ts # Address/coordinate overrides
├── stories/            # Storybook stories
│   ├── CTLocationsMap.stories.ts
│   ├── LocationFilters.stories.ts
│   └── LocationSidebar.stories.tsx
└── App.tsx             # Main app component
```

## Deployment

This app is automatically deployed to Vercel from the GitHub repository:
- **Live Demo**: [https://ct-vac-ideas.vercel.app](https://ct-vac-ideas.vercel.app)
- **Repository**: [https://github.com/RDomiano/ct-vac-ideas](https://github.com/RDomiano/ct-vac-ideas)
- **Deployment**: Automatic via Vercel when pushing to the main branch

To deploy your own version:
1. Fork the repository
2. Connect your fork to Vercel
3. Deploy automatically on every push

## Technologies Used

- **React** - UI framework
- **TypeScript** - Type safety and better development experience
- **Leaflet** - Interactive maps
- **React-Leaflet** - React components for Leaflet
- **TailwindCSS** - Modern utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Storybook** - Component development and documentation
- **Vercel** - Deployment and hosting platform
- **ESLint** - Code linting and formatting

## Data Format

The CSV file should have the following columns:
- **Name**: Location name
- **Address**: Full address
- **Keywords**: Comma-separated tags describing the location
- **Level of Interest**: Number from 1 (least interesting) to 5 (most interesting)
- **Distance (miles)**: Distance from your base location (auto-calculated)
- **ETA (min)**: Estimated travel time in minutes (auto-calculated)
- **Notes**: Personal notes (optional, managed through the app)

## Customization

### Changing the Base Location
The app calculates distances from 95 Main St, Stonington, CT. To change this:
1. Edit the `ORIGIN_ADDRESS` in `src/utils/distanceCalculator.ts`
2. Use the "Update Distances" button in the app to recalculate

### Updating Colors
Modify the color scheme in `src/components/CTLocationsMap.tsx` in the `getInterestColor` function.

### Adding New Filters
Extend the `src/components/LocationFilters.tsx` component to add additional filtering options.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Test with both the main app and Storybook
5. Submit a pull request

## License

MIT License - feel free to use this project for your family vacations! 🏖️
```
