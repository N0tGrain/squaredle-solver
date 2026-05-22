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

<!--  @mouseEnter="highlightNeighbours(cell)"-->

  <button @click="onSolve()">Solve</button>

  <div class="word-list">
    <div v-for="result in results" :key="result.word" class="word-item" @click="selectWord(result.word, result.path)">
      {{result.word}}
    </div>
  </div>

</template>

<style scoped>

.board {
  display: grid;
  grid-template-columns: repeat(5, 70px);
  gap: 10px;
  width: fit-content;
  margin: 40px auto;
}

.word-list {
  max-height: 300px;
  overflow: auto;
  margin-top: 20px;
}

.word-item {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}

.word-item:hover {
  background: #e5e7eb;
  color: black;
}

</style>
