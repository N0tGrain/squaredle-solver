<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue'
import GridCell from './GridCell.vue'

import type { Grid, Cell } from '@/types/grid'

const GRID_SIZE = 5

function createGrid(size: number): Grid {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col): Cell => ({
      row,
      col,
      letter: '',
      disabled: false,
    })),
  )
}

const grid = reactive<Grid>(createGrid(GRID_SIZE))

const inputRefs = ref<HTMLInputElement[][]>([])

function setInputRef(el: HTMLInputElement | null, row: number, col: number,
) {
  if (!el) return
  if (!inputRefs.value[row]) {
    inputRefs.value[row] = []
  }
  inputRefs.value[row][col] = el
}

function focusCell(row: number, col: number) {
  const cell = grid[row]?.[col]
  if (!cell || cell.disabled) return
  nextTick(() => {
    inputRefs.value[row]?.[col]?.focus()
  })
}

function toggleDisabled(cell: Cell) {
  cell.disabled = !cell.disabled
  if (cell.disabled) {
    cell.letter = ''
  }
}

function updateLetter(cell: Cell, event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, 1)
    .toUpperCase()

  cell.letter = value
  if (value) {
    moveToNextCell(cell.row, cell.col)
  }
}

function moveToNextCell(row: number, col: number) {
  let currentCol = col + 1
  let currentRow = row

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
  let currentRow = row

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
    <GridCell
      v-for="cell in grid.flat()"
      :key="`${cell.row}-${cell.col}`"
      :ref="(component) => {
        const gridCell = component as InstanceType<typeof GridCell>
        setInputRef(gridCell?.element as HTMLInputElement, cell.row, cell.col)
      }"
      :cell="cell"
      @input="updateLetter(cell, $event)"
      @keydown="handleKeyDown($event, cell)"
      @toggle="toggleDisabled(cell)"/>
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

</style>
