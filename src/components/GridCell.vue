<script setup lang="ts">

import type {Cell} from "@/types/grid";
import {ref} from "vue";

const props = defineProps<{cell: Cell, highlighted?: boolean}>()
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
  width: 100%;
  aspect-ratio: 1 / 1;
  border: 2px solid var(--color-border);
  border-radius: 18px;
  font-size: clamp(1.5rem, 2vw, 2rem);
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  background: var(--color-background);
  color: var(--color-heading);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
  cursor: pointer;
}

.cell:focus {
  outline: none;
  border-color: var(--vt-c-indigo);
  box-shadow: 0 0 0 4px rgba(44, 62, 80, 0.12);
}

.cell:disabled {
  background: var(--vt-c-black-soft);
  border-color: var(--vt-c-black-soft);
  color: transparent;
  cursor: not-allowed;
}

.highlighted {
  background: rgba(44, 62, 80, 0.08);
  border-color: var(--vt-c-indigo);
  transform: translateY(-1px);
}

</style>
