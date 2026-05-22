<script setup lang="ts">
import {reactive} from 'vue'
import type {Grid, Cell} from "@/types/grid";

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

function toggleDisabled(cell: Cell) {
  cell.disabled = !cell.disabled;
  if (cell.disabled) {
    cell.letter = '';
  }
}

function updateLetter(cell: Cell, event: Event) {
  const target = event.target as HTMLInputElement;
  cell.letter = target.value.replace(/[^a-zA-Z]/g, '').slice(0, 1).toUpperCase()
}

</script>

<template>
  <div class="board">
    <div v-for="cell in grid.flat()"
         :key="`${cell.row}-${cell.col}`"
         class="cell-wrapper">
      <input :value="cell.letter"
             :disabled="cell.disabled"
             maxlength="1"
             class="cell"
             :class="{disabled: cell.disabled}"
             @input="updateLetter(cell, $event)"
             @dblclick="toggleDisabled(cell)"/>
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
