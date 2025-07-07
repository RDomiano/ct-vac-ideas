<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Connecticut Family Vacation Map - Copilot Instructions

This is a React TypeScript application for displaying family vacation locations in Connecticut on an interactive map.

## Project Context
- Built with React, TypeScript, Leaflet, and Storybook
- Displays CSV data as interactive map markers with popups
- Features color-coded interest levels and filtering capabilities
- Designed for family vacation planning

## Code Style Preferences
- Use TypeScript for all new files
- Prefer functional components with hooks over class components
- Use type-only imports when importing types
- Follow the existing component structure in `src/components/`
- Use meaningful component and variable names
- Include proper TypeScript typing for all props and functions

## Architecture Patterns
- Components go in `src/components/`
- Custom hooks go in `src/hooks/`
- Types and interfaces go in `src/types/`
- Utility functions go in `src/utils/`
- Storybook stories go in `src/stories/`

## Map and Data Handling
- Use React-Leaflet for map components
- CSV data is loaded from `public/CT_locations.csv`
- Coordinate data is geocoded in `utils/csvParser.ts`
- Interest levels range from 1 (must see) to 5 (nice to have)
- Colors: Red (1), Orange (2), Yellow (3), Light Green (4), Green (5)

## Storybook
- Create stories for all new components
- Use realistic sample data in stories
- Include multiple variants/states in stories
- Follow the existing story structure

## Dependencies
- leaflet and react-leaflet for maps
- papaparse for CSV parsing (though we use custom parser)
- @types/leaflet for TypeScript support

When suggesting improvements or new features, consider the family vacation use case and prioritize usability and visual appeal.
