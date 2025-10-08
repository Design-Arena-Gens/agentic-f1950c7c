import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'

const GRID_SIZE = 50
const CELL_SIZE = 12

type Cell = boolean
type Grid = Cell[][]

export default function GameOfLife() {
  const [grid, setGrid] = useState<Grid>(() => 
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
  )
  const [isRunning, setIsRunning] = useState(false)
  const [generation, setGeneration] = useState(0)
  const [speed, setSpeed] = useState(100)

  // Initialize grid with random pattern
  const initializeRandom = useCallback(() => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(null).map(() => Math.random() > 0.7)
    )
    setGrid(newGrid)
    setGeneration(0)
  }, [])

  // Clear grid
  const clearGrid = useCallback(() => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
    setGrid(newGrid)
    setGeneration(0)
  }, [])

  // Count living neighbors
  const countNeighbors = (grid: Grid, x: number, y: number): number => {
    let count = 0
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue
        const newX = x + i
        const newY = y + j
        if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
          if (grid[newX][newY]) count++
        }
      }
    }
    return count
  }

  // Apply Conway's rules
  const nextGeneration = useCallback((currentGrid: Grid): Grid => {
    return currentGrid.map((row, x) =>
      row.map((cell, y) => {
        const neighbors = countNeighbors(currentGrid, x, y)
        if (cell) {
          // Living cell
          return neighbors === 2 || neighbors === 3
        } else {
          // Dead cell
          return neighbors === 3
        }
      })
    )
  }, [])

  // Toggle cell state
  const toggleCell = useCallback((x: number, y: number) => {
    if (isRunning) return
    setGrid(prev => prev.map((row, i) => 
      i === x ? row.map((cell, j) => j === y ? !cell : cell) : row
    ))
  }, [isRunning])

  // Game loop
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setGrid(prev => {
        const next = nextGeneration(prev)
        return next
      })
      setGeneration(prev => prev + 1)
    }, speed)

    return () => clearInterval(interval)
  }, [isRunning, speed, nextGeneration])

  // Initialize with random pattern on mount
  useEffect(() => {
    initializeRandom()
  }, [initializeRandom])

  return (
    <>
      <Head>
        <title>Conway's Game of Life</title>
        <meta name="description" content="Interactive Conway's Game of Life implementation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <div className="header">
          <h1>Conway's Game of Life</h1>
          <div className="stats">
            <span>Generation: {generation}</span>
            <span>Living Cells: {grid.flat().filter(cell => cell).length}</span>
          </div>
        </div>

        <div className="controls">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`control-btn ${isRunning ? 'pause' : 'play'}`}
          >
            {isRunning ? '⏸️ Pause' : '▶️ Play'}
          </button>
          
          <button onClick={clearGrid} className="control-btn">
            🗑️ Clear
          </button>
          
          <button onClick={initializeRandom} className="control-btn">
            🎲 Random
          </button>

          <div className="speed-control">
            <label>Speed:</label>
            <input
              type="range"
              min="50"
              max="500"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="speed-slider"
            />
            <span>{Math.round(1000/speed)}ms</span>
          </div>
        </div>

        <div className="grid-container">
          <div 
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`
            }}
          >
            {grid.map((row, x) =>
              row.map((cell, y) => (
                <div
                  key={`${x}-${y}`}
                  className={`cell ${cell ? 'alive' : 'dead'}`}
                  onClick={() => toggleCell(x, y)}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE
                  }}
                />
              ))
            )}
          </div>
        </div>

        <div className="rules">
          <h3>Rules:</h3>
          <ul>
            <li>Any live cell with 2 or 3 neighbors survives</li>
            <li>Any dead cell with exactly 3 neighbors becomes alive</li>
            <li>All other cells die or stay dead</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          max-width: 1200px;
          width: 100%;
        }

        .header {
          text-align: center;
          margin-bottom: 20px;
          color: white;
        }

        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .stats {
          display: flex;
          gap: 20px;
          justify-content: center;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .controls {
          display: flex;
          gap: 15px;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .control-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .control-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.2);
        }

        .control-btn.play {
          background: #4CAF50;
          color: white;
        }

        .control-btn.pause {
          background: #f44336;
          color: white;
        }

        .speed-control {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          font-weight: 500;
        }

        .speed-slider {
          width: 100px;
        }

        .grid-container {
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .grid {
          display: grid;
          gap: 1px;
          background: #333;
          border: 2px solid #555;
          border-radius: 8px;
          overflow: hidden;
        }

        .cell {
          cursor: pointer;
          transition: all 0.1s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .cell.alive {
          background: #00ff88;
          box-shadow: 0 0 8px rgba(0, 255, 136, 0.6);
        }

        .cell.dead {
          background: #222;
        }

        .cell:hover {
          transform: scale(1.1);
          z-index: 1;
        }

        .rules {
          margin-top: 30px;
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 12px;
          color: white;
          max-width: 600px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .rules h3 {
          margin-bottom: 15px;
          font-size: 1.3rem;
        }

        .rules ul {
          list-style: none;
          padding: 0;
        }

        .rules li {
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
        }

        .rules li:before {
          content: "•";
          color: #00ff88;
          font-weight: bold;
          position: absolute;
          left: 0;
        }

        @media (max-width: 768px) {
          .header h1 {
            font-size: 2rem;
          }
          
          .stats {
            flex-direction: column;
            gap: 10px;
          }
          
          .controls {
            flex-direction: column;
            gap: 10px;
          }
          
          .grid-container {
            padding: 10px;
          }
        }
      `}</style>
    </>
  )
}