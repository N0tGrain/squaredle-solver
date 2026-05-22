import {createTrie, insertWord, TrieNode} from "@/utils/trie";

export function buildTrieFromWords(words: string[]): TrieNode {
  const root = createTrie()
  for (const word of words) {
    const clean = word.trim().toUpperCase()
    if (clean.length < 2) continue
    insertWord(root, clean)
  }
  return root
}
