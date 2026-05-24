import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const INPUT = path.join(__dirname, 'raw_words.txt')
const OUTPUT = path.join(__dirname, '../data/words.txt')

const raw = fs.readFileSync(INPUT, 'utf8')

const cleaned = raw
  .split(/\r?\n/)
  .map(w => w.trim())
  .filter(Boolean)
  .filter(w => w.length >= 4)
  .filter(w => /^[a-z]+$/.test(w))
  .filter(w => w.length <= 20)

const words = [...new Set(cleaned)].sort()

fs.writeFileSync(OUTPUT, words.join('\n'))

console.log(`Built words.txt with ${words.length} words`)
