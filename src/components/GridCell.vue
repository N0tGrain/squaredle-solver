<script setup lang="ts">

import type {Cell} from "@/types/grid";
import {ref} from "vue";

const props = defineProps<{cell: Cell, highlighted: boolean}>()
const emit = defineEmits<{
  input: [event: Event]
  keydown: [event: KeyboardEvent]
  toggle: []
}>()

const element = ref<HTMLInputElement | null>(null)
defineExpose({element})

</script>

<template>
  <input
    ref="element"
    :value="props.cell.letter"
    :disabled="props.cell.disabled"
    maxlength="1"
    class="cell"
    :class="{disabled: props.cell.disabled, highlighted: highlighted}"
    @input="emit('input', $event)"
    @keydown="emit('keydown', $event)"
    @dblclick="emit('toggle')"
  />
</template>

<style scoped>

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


.highlighted {
  border-color: #22c55e;
  background: #dcfce7;
}

</style>
