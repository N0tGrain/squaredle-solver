import wordsRaw from '@/data/words.txt?raw'
import {buildTrieFromWords} from "@/utils/trieBuilder"
import {Grid} from "@/types/grid"
import {findAllPaths} from "@/utils/dfs"

export function useSolver() {
  const wordList = wordsRaw.split('\n')
  const trie = buildTrieFromWords(wordList)

  function solve(grid: Grid) {
    return findAllPaths(grid, trie)
  }

  return { solve }
}
