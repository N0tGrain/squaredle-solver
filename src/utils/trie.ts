export type TrieNode = {
  children: Map<string, TrieNode>
  isWord: boolean
}

export function createTrie(): TrieNode {
  return {
    children: new Map(),
    isWord: false,
  }
}

export function insertWord(root: TrieNode, word: string) {
  let node = root
  for (const char of word) {
    if (!node.children.has(char)) {
      node.children.set(char, createTrie())
    }
    node = node.children.get(char)
  }
  node.isWord = true
}

export function getNode(root: TrieNode, prefix: string): TrieNode | null {
  let node = root
  for (const char of prefix) {
    const next = node.children.get(char)
    if (!next) return null
    node = next
  }
  return node
}

export function isWord(root: TrieNode, word: string): boolean {
  const node = getNode(root, word)
  return node?.isWord ?? false
}

export function isPrefix(root: TrieNode, prefix: string): boolean {
  return getNode(root, prefix) !== null
}
