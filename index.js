const LEFT_KEY = 'ArrowLeft';
const UP_KEY = 'ArrowUp';
const RIGHT_KEY = 'ArrowRight';
const DOWN_KEY = 'ArrowDown';

let grids = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
];

let gridChanged = false;
let playerWin = false;

let emptygrids = [
    [0,0],[0,1],[0,2],[0,3],
    [1,0],[1,1],[1,2],[1,3],
    [2,0],[2,1],[2,2],[2,3],
    [3,0],[3,1],[3,2],[3,3],
];

let empty = [];

function ifEqualAround(i, j) {
  if (i-1 >= 0 && grids[i-1][j] && grids[i][j] === grids[i-1][j]) {
    return true;
  } else if (j+1 <= 3 && grids[i][j+1] && grids[i][j] === grids[i][j+1]) {
    return true;
  } else if (i+1 <= 3 && grids[i+1][j] && grids[i][j] === grids[i+1][j]) {
    return true;
  } else if (j-1 >= 0 && grids[i][j-1] && grids[i][j] === grids[i][j-1]) {
    return true;
  } else {
    return false;
  }
}

function isMovementLeft() {
  for (let i=0; i<4; i++) {
    for (let j=0; j<4; j++) {
      if (!grids[i][j]) {
        return true;
      }
    }
  }
  return false;
}

function isFail() {
  for (let i=0; i<4; i++) {
    for (let j=0; j<4; j++) {
      if (grids[i][j] && ifEqualAround(i,j)) {
        return false;
      }
    }
  }
  if (isMovementLeft()) {
    return false;
  } else {
    return true;
  }
}

function randomPosition(max) {
    return Math.floor(Math.random() * max);
}

function spawnATwo() {
    empty = [];
    let gridAdded = false;
    for (let i=0; i<emptygrids.length; i++) {
        if (!grids[emptygrids[i][0]][emptygrids[i][1]]) {
            empty.push(emptygrids[i]);
        }
    }
    if (empty.length) {
        let position;
        if (empty.length === 1) {
            position = 0;
        } else {
            position = randomPosition(empty.length);
        }
        grids[empty[position][0]][empty[position][1]] = 2;
        gridAdded = true;
    }

    if (!gridAdded) {
        gameOver();
    } else {
        renderGridValues();
    }
}

function gameOver() {
    document.getElementById('failure-overlay').style.display = 'block';
    document.removeEventListener('keydown', handleKeyDown);
}

function gameWon() {
    document.getElementById('success-overlay').style.display = 'block';
    document.removeEventListener('keydown', handleKeyDown);
}

function renderGridValues() {
    for (let i=0; i<4; i++) {
        for (let j=0; j<4; j++) {
            if (grids[i][j]) {
                let numberNode = document.createElement('div');
                numberNode.className = `gridNumber${grids[i][j]}`;
                numberNode.innerText = grids[i][j];
                let gridNode = document.getElementById(`${i}${j}`)
                gridNode.replaceChildren(numberNode);
            } else {
                let gridNode = document.getElementById(`${i}${j}`)
                gridNode.innerHTML = null;
            }
        }
    }
}

function isRowZero(row) {
    const rowString = row.join('');
    return ['0000', '000', '00', '0'].indexOf(rowString) >= 0;
}
//2 2 0 0
function addArray(array) {
    for (let i=0; i<array.length; i++) {
        const checkArray = array.slice(i);
        if (isRowZero(checkArray)) {
            break;
        }
        if (array[i] && array[i+1] && array[i] === array[i+1]) {
            gridChanged = true;
            array[i] = array[i] + array[i+1];
            if (array[i] === 2048) {
                playerWin = true;
            }
            array.splice(i+1, 1);
            array.push(0);
        }
    }
    return array;
}

function rearrangeArray(array) {
    let cutPosition = 0;
    while (cutPosition < array.length) {
        const checkArray = array.slice(cutPosition);
        if (isRowZero(checkArray)) {
            break;
        }
        if (!array[cutPosition]) {
            gridChanged = true;
            array.splice(cutPosition, 1);
            array.push(0);
        } else {
            cutPosition++;
        }
    }

    return addArray(array);
}

function moveAllToLeft() {
    for (let i=0; i<4; i++) {
        let array = grids[i];
        grids[i] = rearrangeArray(array);
        renderGridValues();
    }
}

function moveAllToRight() {
    for (let i=0; i<4; i++) {
        let array = grids[i].reverse();
        array = rearrangeArray(array);
        grids[i] = array.reverse();
        renderGridValues();
    }
}

function getColumnArray(column) {
    const array = [grids[0][column],grids[1][column],grids[2][column],grids[3][column]];
    return array;
}

function setColumnArray(array, column) {
    for (let i=0; i<4; i++) {
        grids[i][column] = array[i];
    }
}

//0,0 1,0 2,0 3,0
function moveAllToTop() {
    for (let i=0; i<4; i++) {
        let array = getColumnArray(i);
        array = rearrangeArray(array);
        setColumnArray(array, i);
        renderGridValues();
    }
}

//3,0 2,0 1,0 0,0
function moveAllToBottom() {
    for (let i=0; i<4; i++) {
        let array = getColumnArray(i).reverse();
        array = rearrangeArray(array).reverse();
        setColumnArray(array, i);
        renderGridValues();
    }
}
//4,2,0,0
function addUpRow(row) {
    for (let i=0; i<row.length; i++) {
        if (row[i+1]) {
            if (row[i] === row[i+1]) {
                row[i] = row[i] + row[i+1];
                row.splice(i+1,1);
                row.push(0);
            }
        }
    }
    return row;
}

let deepArrCopy = [];
function saveGridInfo() {
  deepArrCopy = [
    [...grids[0]],
    [...grids[1]],
    [...grids[2]],
    [...grids[3]]
  ];
}

function getSavedGridInfo() {
  grids = [
    [...deepArrCopy[0]],
    [...deepArrCopy[1]],
    [...deepArrCopy[2]],
    [...deepArrCopy[3]]
  ];
}

function handleUndo(e) {
  e.preventDefault();
  e.stopPropagation();
  if (deepArrCopy.length) {
    getSavedGridInfo();
    renderGridValues();
  }
}

let xDown = null;                                                        
let yDown = null;

function getTouches(evt) {
  return evt.touches || evt.originalEvent.touches;
}                                                     
                                                                         
function handleTouchStart(evt) {
    evt.preventDefault();
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                
                                                                         
function handleTouchMove(evt) {
    evt.preventDefault();
    gridChanged = false;
    if ( ! xDown || ! yDown ) {
        return;
    }

    let xUp = evt.touches[0].clientX;                                    
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;
                                                                         
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
        if ( xDiff > 0 ) {
          moveAllToLeft();  
        } else {
          moveAllToRight();  
        }                       
    } else {
        if ( yDiff > 0 ) {
          moveAllToTop();   
        } else { 
          moveAllToBottom();  
        }                                                                 
    }
    xDown = null;
    yDown = null;   
    eventEnds();                                          
};

function handleKeyDown(event) {
        if ([LEFT_KEY, RIGHT_KEY, UP_KEY, DOWN_KEY].indexOf(event.key) >= 0) {
            event.preventDefault();
            event.stopPropagation();
        }
        gridChanged = false;
        switch(event.key) {
            case LEFT_KEY : {
                moveAllToLeft();
                break;
            }
            case RIGHT_KEY : {
                moveAllToRight();
                break;
            }
            case UP_KEY : {
                moveAllToTop();
                break;
            }
            case DOWN_KEY : {
                moveAllToBottom();
                break;
            }
            default : {
                return;
            }
        }
        eventEnds();      
    }

function eventEnds() {
  if (gridChanged && !playerWin) {
      saveGridInfo();
      spawnATwo();
  }
  if (!gridChanged && !playerWin && isFail()) {
      gameOver();
  }
  if (playerWin) {
      gameWon()
  }
}    

function handleRestart() {
  grids = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
  gridChanged = false;
  playerWin = false;
  document.getElementById('failure-overlay').style.display = 'none';
  document.getElementById('success-overlay').style.display = 'none';
  start();
}    

function gatherEvents() {
    document.getElementById('undo-btn').addEventListener('click', handleUndo, false);
    document.getElementById('start-btn').addEventListener('click', handleRestart, false);
    document.getElementById('restart-btn').addEventListener('click', handleRestart, false);
    document.addEventListener('touchstart', handleTouchStart, false);        
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener("keydown", handleKeyDown, false);
}

function start() {
  spawnATwo();
  spawnATwo();
  gatherEvents(); 
}

window.onload = start;
