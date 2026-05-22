import {Grid, Cell} from "@/types/grid";
import {nextTick, reactive, ref} from "vue";

export function useGrid(size: number = 5) {
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

  const grid = reactive<Grid>(createGrid(size))
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
    const nextCell = findNextValidCell(row, col, 0, 1)
    if (nextCell) {
      focusCell(nextCell.row, nextCell.col)
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
      currentCol = size - 1
    }
  }

  function findNextValidCell(
    startRow: number,
    startCol: number,
    rowDelta: number,
    colDelta: number,
  ) {
    let row = startRow;
    let col = startCol;
    for (let i = 0; i < size * size; i++) {
      row = (row + rowDelta + size) % size;
      col = (col + colDelta + size) % size;
      const cell = grid[row][col]
      if (!cell.disabled) {
        return cell
      }
    }
    return null
  }

  function handleKeyDown(event: KeyboardEvent, cell: Cell) {
    let nextCell: Cell | null = null;
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        nextCell = findNextValidCell(cell.row, cell.col, -1, 0)
        break

      case 'ArrowDown':
        event.preventDefault()
        nextCell = findNextValidCell(cell.row, cell.col, 1, 0)
        break

      case 'ArrowLeft':
        event.preventDefault()
        nextCell = findNextValidCell(cell.row, cell.col, 0, -1)
        break

      case 'ArrowRight':
        event.preventDefault()
        nextCell = findNextValidCell(cell.row, cell.col, 0, 1)
        break

      case 'Backspace':
        if (!cell.letter) {
          moveToPreviousCell(cell.row, cell.col)
        }
        return
    }
    if (nextCell) {
      focusCell(nextCell.row, nextCell.col)
    }
  }

  return {
    grid,
    setInputRef,
    focusCell,
    toggleDisabled,
    updateLetter,
    handleKeyDown,
  }
}
