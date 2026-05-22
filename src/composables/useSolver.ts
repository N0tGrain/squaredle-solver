import { wordList } from '@/data/words'
import {buildTrieFromWords} from "@/utils/trieBuilder"
import {Grid} from "@/types/grid"
import {findAllPaths} from "@/utils/dfs"

export function useSolver() {
  const cleanedWords = wordList.map(w => w.toUpperCase())
    .filter(w => w.length >= 4)
    .filter(w => /^[A-Z]+$/.test(w))

  const trie = buildTrieFromWords(cleanedWords)

  function solve(grid: Grid) {
    return findAllPaths(grid, trie)
  }

  return { solve }
}
