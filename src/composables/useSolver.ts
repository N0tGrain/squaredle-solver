import { wordList } from '@/data/words'
import {buildTrieFromWords} from "@/utils/trieBuilder"
import {Grid} from "@/types/grid"
import {findAllPaths} from "@/utils/dfs"

const trie = buildTrieFromWords(wordList.map(w => w.toUpperCase()))

export function useSolver() {

  function solve(grid: Grid) {
    return findAllPaths(grid, trie)
  }

  return { solve }
}
