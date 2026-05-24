import {Cell, Grid} from "@/types/grid";
import {getNeighbours} from "@/utils/neighbours";
import {isPrefix, isWord} from "@/utils/trie";

type PathResult = {
  word: string
  path: Cell[]
}

export function findAllPaths(grid: Grid, trie: any): PathResult[] {
  const results: PathResult[] = []
  const size = grid.length;
  const visited = new Set<string>()
  const seenWords = new Map<string, Cell[]>()

  function key(cell: Cell) {
    return `${cell.row},${cell.col}`
  }

  function dfs(cell: Cell, currentWord: string, path: Cell[]) {
    const newWord = currentWord + cell.letter

    if (currentWord.length > 20) return
    if (!isPrefix(trie, newWord)) return

    const k = key(cell)
    if (visited.has(k)) return
    visited.add(k)

    const newPath = [...path, cell]

    if (newWord.length >= 4 && isWord(trie, newWord)) {
      if (!seenWords.has(newWord)) {
        seenWords.set(newWord, newPath)
        results.push({word: newWord, path: newPath})
      }
    }
    const neighbours = getNeighbours(grid, cell.row, cell.col)

    for (const neighbour of neighbours) {
      dfs(neighbour, newWord, newPath)
    }
    visited.delete(k)
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
