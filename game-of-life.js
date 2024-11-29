const cells = [];

let boxWidth;
let boxHeight;

document.querySelector('.js-grid-button')
  .addEventListener('click', () => {
    document.querySelector('.js-game-shell')
      .innerHTML = '';
    const widthInputElement = document.querySelector('.js-width-input');
    boxWidth = widthInputElement.value;
    const heightInputElement = document.querySelector('.js-height-input');
    boxHeight = heightInputElement.value;
    updateGrid();
    populateCells();
  });


document.querySelector('.js-play-game-button')
  .addEventListener('click', () => {
    setInterval(playGame, 1000);
  });  

function updateGrid() {
  let gridRowCSS = '';
  for (let i = 0; i < boxWidth; i++) {
    gridRowCSS += '40px ';
  }
  document.querySelector('.js-game-shell')
    .innerHTML = `<div style="
      display: grid;
      grid-template-columns: ${gridRowCSS};
    " class="js-game-grid game-grid"></div>`;
}

function populateCells() {
  for (let i = 0; i < boxHeight; i++) {
    for (let j = 0; j < boxWidth; j++) {
      cells.push({
        rowId: `${i + 1}`,
        columnId: `${j + 1}`
      });
    }
  }
  
  let cellHTML = ``;
  cells.forEach(cell => {
    cellHTML += `<div class="js-cell cell row-${cell.rowId} column-${cell.columnId} dead" data-row-id="${cell.rowId}" data-column-id="${cell.columnId}"></div>`;
  })
  document.querySelector('.js-game-grid')
    .innerHTML = cellHTML;
  
  document.querySelectorAll('.js-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      if (cell.classList.contains('alive')) {
        cell.classList.remove('alive');
        cell.classList.add('dead');
      } else {
        cell.classList.remove('dead');
        cell.classList.add('alive');
      }
    })
  })
}

const cellElements = [];

function playGame() {
  document.querySelectorAll('.js-cell').forEach(cell => cellElements.push(cell));
  
  cellElements.forEach((cell, index) => {
    let cellNeighbors = [];
    const cellRow = Number(cell.dataset.rowId);
    const cellColumn = Number(cell.dataset.columnId);
    
    cellNeighbors.push(document.querySelector(`.row-${cellRow - 1}.column-${cellColumn - 1}`));
    cellNeighbors.push(document.querySelector(`.row-${cellRow - 1}.column-${cellColumn}`));
    cellNeighbors.push(document.querySelector(`.row-${cellRow - 1}.column-${cellColumn + 1}`));
    cellNeighbors.push(document.querySelector(`.row-${cellRow}.column-${cellColumn - 1}`));
    cellNeighbors.push(document.querySelector(`.row-${cellRow}.column-${cellColumn + 1}`));
    cellNeighbors.push(document.querySelector(`.row-${cellRow + 1}.column-${cellColumn - 1}`));
    cellNeighbors.push(document.querySelector(`.row-${cellRow + 1}.column-${cellColumn}`));
    cellNeighbors.push(document.querySelector(`.row-${cellRow + 1}.column-${cellColumn + 1}`));
    
    cellNeighbors = cellNeighbors.filter(value => value);

    let neighborsAlive = 0;

    cellNeighbors.forEach(neighbor => {
      if (neighbor.classList.contains('alive')) {
        neighborsAlive ++;
      }});
    
    let behaviorFlag = 0;
      
    if (cell.classList.contains('alive')) {
      if (neighborsAlive <= 1 || neighborsAlive >= 4) {
        behaviorFlag = 0;
      } else {
        behaviorFlag = 1;
      }
    } else if (neighborsAlive === 3) {
      behaviorFlag = 1;
    }

    if (behaviorFlag === 0) {
      cell.classList.add('will-die');
    } else {
      cell.classList.add('will-live');
    }
    
  });

  cellElements.forEach(cell => {
    if (cell.classList.contains('will-die')) {
      clearClassesFlags(cell);
      cell.classList.add('dead');
    } else if (cell.classList.contains('will-live')) {
      clearClassesFlags(cell);
      cell.classList.add('alive');
    }
  });

  cellElements.splice(0, cellElements.length);
  console.log(cellElements);
}

function clearClassesFlags (cell) {
  cell.classList.remove('will-die');
  cell.classList.remove('will-live');
  cell.classList.remove('alive');
  cell.classList.remove('dead');
}