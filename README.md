# Conway's Game of Life

An interactive web implementation of Conway's Game of Life built with Next.js and React.

## Features

- Interactive grid where you can click to toggle cells
- Play/pause controls
- Speed adjustment
- Random pattern generation
- Clear grid functionality
- Real-time generation counter
- Living cell counter
- Responsive design

## Rules

- Any live cell with 2 or 3 neighbors survives
- Any dead cell with exactly 3 neighbors becomes alive
- All other cells die or stay dead

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The app is configured for static export and can be deployed to Vercel:

```bash
vercel deploy --prod
```

## Controls

- **Play/Pause**: Start or stop the simulation
- **Clear**: Reset the grid to all dead cells
- **Random**: Generate a random pattern
- **Speed**: Adjust simulation speed (50ms to 500ms per generation)

Click on any cell to toggle it between alive and dead (only works when paused).