<script setup lang="ts">

import {useGrid} from "@/composables/useGrid";
import GridCell from "@/components/GridCell.vue";

const {
  grid,
  setInputRef,
  toggleDisabled,
  updateLetter,
  handleKeyDown,
} = useGrid(5)

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

</style>
