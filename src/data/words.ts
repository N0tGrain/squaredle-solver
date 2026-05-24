import rawWords from './words.txt?raw'

export const wordList = rawWords.split('\n').map(line => line.trim()).filter(Boolean)
