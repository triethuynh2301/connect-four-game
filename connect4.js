/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  // construct one row 
  for (let col = 0; col < WIDTH; col++){
    board[col] = [];
    for (let row = 0; row < HEIGHT; row++){
      board[col][row] = undefined;
    }
  }


  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board');

  // create the header row and add click event
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  
  // add table cell to header row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    headCell.addEventListener('click', handleClick);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // create other rows for the board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // make a div and insert into correct table cell
  const selector = `${y}-${x}`;
  const div = document.createElement('div');
  const divClass = (currPlayer === 1) ? 'piece p1' : 'piece p2';
  div.setAttribute('class', divClass);
  const tableCell = document.getElementById(selector);
  tableCell.append(div);
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (checkForTie()) {
    endGame("This match is a tie");
  }

  // switch players
  currPlayer = (currPlayer === 1) ? 2 : 1;
}

/**
 * Check to see if all cells on the boards are filled
 * @returns True if all cells are filled
 */
function checkForTie() {
  let allCellsFilled = true;
  for (let row = 0; row < WIDTH; row++){
    if (!allCellsFilled) break;
    for (let col = 0; col < HEIGHT; col++){
      if (board[row][col] === undefined) {
        allCellsFilled = false;
        break;
      }
    }
  }

  return allCellsFilled;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO:There can only be a win in 1 of these 4 scenarios:
  // 1) same color horizontally
  // 2) same color vertically
  // 3) same color diagonally from left to right
  // 4) same color diagonally from right to left
  // The code stores cells color in 4 different array horizontally,
  // vertically, diagonally left and right. It checks for every time to
  // make sure there is no match in all 4 arrays. If there is, then a win happens
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
