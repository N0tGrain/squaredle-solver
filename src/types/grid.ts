export type Cell = {
  row: number,
  col: number,
  letter: string,
  disabled: boolean,
}

export type Grid = Cell[][];
