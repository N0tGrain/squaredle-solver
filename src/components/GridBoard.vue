<script setup lang="ts">
import { useGrid } from "@/composables/useGrid";
import GridCell from "@/components/GridCell.vue";
import { ref, computed } from "vue";
import { Cell } from "@/types/grid";
import { getNeighbours } from "@/utils/neighbours";
import { useSolver } from "@/composables/useSolver";

const {
  grid,
  setInputRef,
  toggleDisabled,
  updateLetter,
  handleKeyDown,
  resetGrid,
} = useGrid(5);

const highlightedCells = ref<Cell[]>([]);
const { solve } = useSolver();

const selectedWord = ref<string | null>(null);
const selectedPath = ref<Cell[]>([]);
const results = ref<{ word: string; path: Cell[] }[]>([]);

const groupedResults = computed(() => {
  const grouped: Record<number, { word: string; path: Cell[] }[]> = {};

  results.value.forEach((result) => {
    const length = result.word.length;

    if (!grouped[length]) {
      grouped[length] = [];
    }

    grouped[length].push(result);
  });

  return Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b)
    .map((length) => ({
      length,
      words: grouped[length].sort((a, b) =>
        a.word.localeCompare(b.word),
      ),
    }));
});

function highlightNeighbours(cell: Cell) {
  highlightedCells.value = getNeighbours(grid, cell.row, cell.col);
}

function onSolve() {
  results.value = solve(grid);
}

function selectWord(word: string, path: Cell[]) {
  selectedWord.value = word;
  selectedPath.value = path;
}

function clearBoard() {
  resetGrid();

  results.value = [];
  selectedWord.value = null;
  selectedPath.value = [];
  highlightedCells.value = [];
}

function isInSelectedPath(cell: Cell) {
  return selectedPath.value.some(
    (c) => c.row === cell.row && c.col === cell.col,
  );
}

function isHighlighted(cell: Cell) {
  return highlightedCells.value.some(
    (highlightedCell) =>
      highlightedCell.row === cell.row &&
      highlightedCell.col === cell.col,
  );
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

            setInputRef(
              gridCell?.element as HTMLInputElement,
              cell.row,
              cell.col,
            )
          }"
          :cell="cell"
          :highlighted="isInSelectedPath(cell)"
          @input="updateLetter(cell, $event)"
          @keydown="handleKeyDown($event, cell)"
          @toggle="toggleDisabled(cell)"
        />
      </div>

      <div class="board-actions">
        <button @click="onSolve()">Solve</button>

        <button
          @click="clearBoard()"
          type="button"
        >
          Clear Board
        </button>
      </div>

      <div class="board-help">
        <p>Use the arrow keys to move between tiles.</p>
        <p>Double-click a tile to disable it.</p>
        <p>Play the original game at
          <a href="https://squaredle.app/" target="_blank" rel="noopener noreferrer">Squaredle</a>
        </p>
      </div>
    </section>

    <section class="result-panel">
      <div class="result-header">
        <h2>Matches</h2>

        <span
          v-if="results.length"
          class="result-count"
        >
          {{ results.length }} words
        </span>
      </div>

      <div
        class="word-list"
        v-if="results.length"
      >
        <div
          v-for="group in groupedResults"
          :key="`length-${group.length}`"
          class="word-length-group"
        >
          <div class="length-header">
            {{ group.length }} letters
          </div>

          <div class="word-grid">
            <div
              v-for="result in group.words"
              :key="result.word"
              class="word-item"
              @click="selectWord(result.word, result.path)"
            >
              {{ result.word }}
            </div>
          </div>
        </div>
      </div>

      <div
        class="empty-state"
        v-else
      >
        Add letters to the board and tap Solve to reveal
        matching paths.
      </div>
    </section>
  </div>
</template>

<style scoped>
.board-shell {
  display: grid;
  grid-template-columns: minmax(500px, 650px) minmax(0, 1fr);
  gap: 1.5rem;
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  padding: 1rem 5rem;
  align-items: start;
  box-sizing: border-box;
}

.board-help {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.8;
}

.board-help p {
  margin: 0;
  line-height: 1.4;
}

.board-help a {
  color: var(--vt-c-indigo);
  font-weight: 600;
  text-decoration: none;
}

.board-help a:hover {
  text-decoration: underline;
}

.board-panel, .result-panel {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.08);
}

.board-panel {
  position: sticky;
  top: 1rem;
  width: 100%;
}

.board {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  gap: 0.85rem;
}

.board-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.85rem;
  margin-top: 1rem;
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
  flex: 1;
  min-width: 140px;
}

.board-actions button:hover {
  transform: translateY(-1px);
}

.board-actions button[type="button"] {
  background: var(--color-border-hover);
  color: var(--color-text);
}

.result-panel {
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 2rem);
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.result-header h2 {
  margin: 0;
  color: var(--color-heading);
  font-size: 1.2rem;
}

.result-count {
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.7;
}

.word-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
  align-content: start;
  padding-right: 0.25rem;
}

.word-length-group {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 18px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.length-header {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-heading);
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.word-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 0.65rem;
}

.word-item {
  cursor: pointer;
  padding: 0.85rem 0.75rem;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text);
  text-align: center;
  font-size: 0.92rem;
  font-weight: 500;
  transition: transform 0.15s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.word-item:hover {
  transform: translateY(-2px);
  border-color: var(--vt-c-indigo);
  background: rgba(204, 85, 0, 0.08);
}

.empty-state {
  padding: 2rem;
  border-radius: 18px;
  border: 1px dashed var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  text-align: center;
}

/* Tablet */
@media (max-width: 1300px) {
  .board-shell {
    grid-template-columns: 320px minmax(0, 1fr);
    padding: 1rem 2rem;
  }
  .word-list {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

/* Mobile */
@media (max-width: 1000px) {
  .board-shell {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .board-panel {
    position: static;
    max-width: 100%;
  }

  .result-panel {
    height: auto;
  }

  .word-list {
    overflow: visible;
    grid-template-columns: 1fr;
  }
}

/* Small mobile */
@media (max-width: 640px) {
  .board-actions {
    flex-direction: column;
  }

  .board-actions button {
    width: 100%;
  }

  .word-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>
