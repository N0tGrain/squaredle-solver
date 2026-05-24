import {Cell, Grid} from "@/types/grid";

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

export function getNeighbours(grid: Grid, row: number, col: number): Cell[] {
  const neighbours: Cell[] = []
  const size = grid.length

  for (const [rowOffset, colOffset] of DIRECTIONS) {
    const newRow = row + rowOffset
    const newCol = col + colOffset

    if (newRow < 0 || newRow >= size) continue
    if (newCol < 0 || newCol >= size) continue

    const neighbour = grid[newRow][newCol]

    if (!neighbour) continue
    if (neighbour.disabled) continue
    neighbours.push(neighbour)
  }
  return neighbours
}
