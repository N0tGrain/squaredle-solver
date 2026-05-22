<script setup lang="ts">

import {useGrid} from "@/composables/useGrid";
import GridCell from "@/components/GridCell.vue";
import {ref} from "vue";
import {Cell} from "@/types/grid";
import {getNeighbours} from "@/utils/neighbours";

const {
  grid,
  setInputRef,
  toggleDisabled,
  updateLetter,
  handleKeyDown,
} = useGrid(5)

const highlightedCells = ref<Cell[]>([])

function highlightNeighbours(cell: Cell) {
  highlightedCells.value = getNeighbours(grid, cell.row, cell.col)
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
      :highlighted="isHighlighted(cell)"
      @mouseEnter="highlightNeighbours(cell)"
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

</style>
