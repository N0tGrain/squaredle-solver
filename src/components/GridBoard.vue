<script setup lang="ts">
import {nextTick, ref, reactive, onMounted} from 'vue'
import type {Grid, Cell} from "@/types/grid";

const element = ref()
onMounted(() => {
  focusCell(0, 0)
})

const GRID_SIZE = 5;

function createGrid(size: number): Grid {
  return Array.from({length: size}, (_, row) =>
    Array.from({length: size}, (_, col): Cell => ({
      row,
      col,
      letter: '',
      disabled: false,
    })),
  )
}

const grid = reactive<Grid>(createGrid(GRID_SIZE))
const inputRefs = ref<HTMLInputElement[][]>([])

function setInputRef(element: HTMLInputElement | null, row: number, col: number) {
  if (!element) return;
  if (!inputRefs.value[row]) {
    inputRefs.value[row] = []
  }
  inputRefs.value[row][col] = element;
}

function focusCell(row:number, col:number) {
  const cell = grid[row]?.[col]
  if (!cell || cell.disabled) return;

  nextTick(() => {
    inputRefs.value[row]?.[col]?.focus();
  })
}

function toggleDisabled(cell: Cell) {
  cell.disabled = !cell.disabled;
  if (cell.disabled) {
    cell.letter = '';
  }
}

function updateLetter(cell: Cell, event: Event) {
  const target = event.target as HTMLInputElement;
  const value = target.value.replace(/[^a-zA-Z]/g, '').slice(0, 1).toUpperCase()
  cell.letter = value;
  if (value) {
    moveToNextCell(cell.row, cell.col)
  }
}

function moveToNextCell(row: number, col: number) {
  let currentCol = col + 1;
  let currentRow = row;

  while (currentRow < GRID_SIZE) {
    while (currentCol < GRID_SIZE) {
      const nextCell = grid[currentRow][currentCol]
      if (!nextCell.disabled) {
        focusCell(currentRow, currentCol)
        return
      }
      currentCol++
    }
    currentRow++
    currentCol = 0
  }
}

function moveToPreviousCell(row: number, col: number) {
  let currentCol = col - 1
  let currentRow = row;

  while (currentRow >= 0) {
    while (currentCol >= 0) {
      const prevCell = grid[currentRow][currentCol]
      if (!prevCell.disabled) {
        focusCell(currentRow, currentCol)
        return
      }
      currentCol--
    }
    currentRow--
    currentCol = GRID_SIZE - 1
  }
}

function handleKeyDown(event: KeyboardEvent, cell: Cell) {
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()
      focusCell(cell.row - 1, cell.col)
      break
    case 'ArrowDown':
      event.preventDefault()
      focusCell(cell.row + 1, cell.col)
      break
    case 'ArrowLeft':
      event.preventDefault()
      focusCell(cell.row, cell.col - 1)
      break
    case 'ArrowRight':
      event.preventDefault()
      focusCell(cell.row, cell.col + 1)
      break
    case 'Backspace':
      if (!cell.letter) {
        moveToPreviousCell(cell.row, cell.col)
      }
      break
  }
}

</script>

<template>
  <div class="board">
    <div
      v-for="cell in grid.flat()"
      :key="`${cell.row}-${cell.col}`"
    >
      <input
        :ref="(el) => setInputRef(el as HTMLInputElement, cell.row, cell.col)"
        :value="cell.letter"
        :disabled="cell.disabled"
        maxlength="1"
        class="cell"
        :class="{ disabled: cell.disabled }"
        @input="updateLetter(cell, $event)"
        @keydown="handleKeyDown($event, cell)"
        @dblclick="toggleDisabled(cell)"
      />
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

.cell-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.cell {
  width: 70px;
  height: 70px;
  border: 2px solid #d1d5db;
  border-radius: 14px;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  background: white;
  transition: all 0.2s ease;
  cursor: pointer;
}

.cell:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
}

.cell:disabled {
  background: #1f2937;
  border-color: #1f2937;
  color: transparent;
  cursor: not-allowed;
}
</style>
