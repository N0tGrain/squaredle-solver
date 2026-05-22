import {Cell, Grid} from "@/types/grid";
import {getNeighbours} from "@/utils/neighbours";

type PathResult = {
  word: string
  path: Cell[]
}

export function findAllPaths(grid: Grid): PathResult[] {
  const results: PathResult[] = []
  const size = grid.length;
  const visited = new Set<String>()

  function key(cell: Cell) {
    return `${cell.row},${cell.col}`
  }

  function dfs(cell: Cell, currentWord: string, path: Cell[]) {
    visited.add(key(cell))

    if (currentWord.length > 20) return

    const newWord = currentWord + cell.letter
    const newPath = [...path, cell]

    if (newWord.length >= 2) {
      results.push({word: newWord, path: newPath})
    }

    const neighbours = getNeighbours(grid, cell.row, cell.col)
    for (const neighbour of neighbours) {
      const k = key(neighbour)
      if (visited.has(k)) continue
      dfs(neighbour, newWord, newPath)
    }
    visited.delete(key(cell))
  }

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const start = grid[row][col]
      if (start.disabled || !start.letter) continue
      dfs(start, '', [])
    }
  }

  return results
}
