import {Cell, Grid} from "@/types/grid";

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, -1],
]

export function getNeighbours(grid: Grid, row: number, col: number): Cell[] {
  const neighbours: Cell[] = []
  for (const [rowOffset, colOffset] of DIRECTIONS) {
    const newRow = row + rowOffset
    const newCol = col + colOffset
    const neighbour = grid[newRow]?.[newCol]

    if (!neighbour) continue
    if (neighbour.disabled) continue
    neighbours.push(neighbour)
  }
  return neighbours
}
