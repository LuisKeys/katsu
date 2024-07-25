import { KatsuState } from "../state/katsu_state";

const getColumnWidths = (state: KatsuState, userIndex: number) => {
  let columnWidths: number[] = [];
  const result = state.users[userIndex].result;
  for (let i = 0; i < result.fields.length; i++) {
    let columnWidth = 0;
    for (let j = 0; j < result.rows.length; j++) {
      let cell = result.rows[j][i];
      if (cell === null) cell = '';
      let cellLength = cell.toString().length;
      if (cellLength > columnWidth) columnWidth = cellLength;
    }
    columnWidths.push(columnWidth);
  }
  return columnWidths;
}

export {
  getColumnWidths
};