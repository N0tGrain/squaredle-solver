<script setup lang="ts">

import {useGrid} from "@/composables/useGrid";
import GridCell from "@/components/GridCell.vue";
import {ref} from "vue";
import {Cell} from "@/types/grid";
import {getNeighbours} from "@/utils/neighbours";
import {useSolver} from "@/composables/useSolver";

const {
  grid,
  setInputRef,
  toggleDisabled,
  updateLetter,
  handleKeyDown,
  resetGrid,
} = useGrid(5)

const highlightedCells = ref<Cell[]>([])
const { solve } = useSolver()
const selectedWord = ref<string | null>(null)
const selectedPath = ref<Cell[]>([])
const results = ref<{word: string; path: Cell[]}[]>([])

function highlightNeighbours(cell: Cell) {
  highlightedCells.value = getNeighbours(grid, cell.row, cell.col)
}

function onSolve() {
  results.value = solve(grid)
}

function selectWord(word: string, path: Cell[]) {
  selectedWord.value = word
  selectedPath.value = path
}

function clearBoard() {
  resetGrid()
  results.value = []
  selectedWord.value = null
  selectedPath.value = []
  highlightedCells.value = []
}

function isInSelectedPath(cell: Cell) {
  return selectedPath.value.some((c) => c.row === cell.row && c.col === cell.col)
}

function isHighlighted(cell: Cell) {
  return highlightedCells.value.some((highlightedCell) =>
    highlightedCell.row === cell.row && highlightedCell.col === cell.col,
  )
}

</script>

<template>
  <div class="board-shell">
    <section class="board-panel">
      <div class="board">
        <GridCell
          v-for="cell in grid.flat()"
          :key="`${cell.row}-${cell.col}`"
          :ref="(component) => {
            const gridCell = component as InstanceType<typeof GridCell>
            setInputRef(gridCell?.element as HTMLInputElement, cell.row, cell.col)
          }"
          :cell="cell"
          :highlighted="isInSelectedPath(cell)"
          @input="updateLetter(cell, $event)"
          @keydown="handleKeyDown($event, cell)"
          @toggle="toggleDisabled(cell)"/>
      </div>

      <div class="board-actions">
        <button @click="onSolve()">Solve</button>
        <button @click="clearBoard()" type="button">Clear Board</button>
      </div>
    </section>

    <section class="result-panel">
      <h2>Matches</h2>
      <div class="word-list" v-if="results.length">
        <div
          v-for="result in results"
          :key="result.word"
          class="word-item"
          @click="selectWord(result.word, result.path)">
          {{result.word}}
        </div>
      </div>
      <div class="empty-state" v-else>
        Add letters to the board and tap Solve to reveal matching paths.
      </div>
    </section>
  </div>
</template>

<style scoped>

.board-shell {
  display: grid;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 840px) {
  .board-shell {
    grid-template-columns: minmax(320px, 440px) minmax(420px, 1fr);
    align-items: start;
  }
}

.board-panel,
.result-panel {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.08);
}

.board {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.85rem;
  width: min(100%, 420px);
  margin: 0 auto;
}

.word-list {
  display: grid;
  gap: 0.6rem;
  max-height: calc(100vh - 320px);
  overflow: auto;
  padding: 0.25rem 0;
}

.word-item {
  cursor: pointer;
  padding: 0.95rem 1rem;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  transition: transform 0.15s ease, background-color 0.2s ease;
}

.word-item:hover {
  background: var(--color-background-soft);
  transform: translateX(2px);
}

.empty-state {
  padding: 1rem;
  border-radius: 18px;
  border: 1px dashed var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  text-align: center;
}

.result-panel h2 {
  margin-bottom: 1rem;
  color: var(--color-heading);
  font-size: 1.1rem;
  letter-spacing: 0.01em;
}

.board-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.85rem;
  margin-top: 0.85rem;
}

.board-actions button {
  border: none;
  border-radius: 9999px;
  padding: 12px 20px;
  font-size: 0.95rem;
  font-weight: 700;
  background: var(--vt-c-indigo);
  color: var(--vt-c-white);
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease;
  min-width: 160px;
}

.board-actions button[type="button"] {
  background: var(--color-border-hover);
  color: var(--color-text);
}

.board-actions button:hover {
  background: rgba(44, 62, 80, 0.9);
}

.board-actions button[type="button"]:hover {
  background: rgba(60, 60, 60, 0.2);
}

@media (max-width: 640px) {
  .board-shell {
    gap: 1rem;
  }

  .board,
  .board-actions button {
    width: 100%;
  }

  .board-actions {
    justify-content: stretch;
  }

  .board-actions button {
    min-width: 0;
  }
}
</style>
