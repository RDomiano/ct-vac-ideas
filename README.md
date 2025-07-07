# Connecticut Family Vacation Map

A beautiful, interactive web application built with React, Leaflet, and Storybook to help families discover amazing vacation spots in Connecticut and nearby areas.

## Features

- 🗺️ **Interactive Map**: Explore locations on a full-featured map powered by Leaflet
- 🎯 **Interest Level Coding**: Color-coded markers based on your interest level (1-5)
- 🔍 **Smart Filtering**: Search by name, keywords, or address
- 📱 **Responsive Design**: Works great on desktop and mobile devices
- 📋 **Detailed Popups**: Click markers to see location details, distance, and estimated travel time
- 🎨 **Component Library**: Built with Storybook for easy component development

## Interest Level Legend

- 🔴 **Level 1** (Red): Must See - Don't miss these amazing spots!
- 🟠 **Level 2** (Orange): High Priority
- 🟡 **Level 3** (Yellow): Moderate Interest
- 🟢 **Level 4** (Light Green): Worth Visiting
- 🟢 **Level 5** (Green): Nice to Have - If you have extra time

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
1. Open the app in your browser
2. Use the **search bar** to find specific locations by name, keywords, or address
3. **Filter by interest level** using the checkboxes - uncheck levels you don't want to see
4. **Click on map markers** to see detailed information about each location
5. Use the **legend** in the top-right corner to understand the color coding

### Adding New Locations
To add new locations to the map:

1. Edit the `public/CT_locations.csv` file
2. Add new rows with the following format:
   ```
   Name,Address,Keywords,Level of Interest,Distance (miles),ETA (min)
   ```
3. Save the file and refresh the app

### Storybook Development
View and develop components in isolation:
```bash
npm run storybook
```

## Technologies Used

- **React** - UI framework
- **TypeScript** - Type safety and better development experience
- **Leaflet** - Interactive maps
- **React-Leaflet** - React components for Leaflet
- **Vite** - Fast build tool and development server
- **Storybook** - Component development and documentation
- **ESLint** - Code linting and formatting

## License

MIT License - feel free to use this project for your family vacations! 🏖️
```
