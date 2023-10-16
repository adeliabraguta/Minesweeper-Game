'use strict'


let numberOfMines = 0;

function createBoard(boardSize) {
    const board = [];
    let value = 0
    for (let x = 0; x < boardSize; x++) {
        let row = []
        for (let y = 0; y < boardSize; y++) {
            row.push(0)
        }
        board.push(row)
    }
    return board
}


function generateMines(board, boardSize) {
    let numberMines = 20;
    const coordinates = {}
    while (numberMines > 0) {
        let x = Math.floor(Math.random() * boardSize)
        let y = Math.floor(Math.random() * boardSize)
        if (coordinates[`${x}${y}`]) {
            continue
        }
        coordinates[`${x}${y}`] = true
        board[x][y] = -1
        numberMines -= 1
    }
}

let countFlags = 0;

function display(board) {
    tiles = displayBoard(board)
    tiles.forEach(tile => {
        document.querySelector('.start-board').appendChild(tile)
        tile.classList.add('start-tile')
    })
}

function displayEmpty(board, element, x, y) {
    if (
        element.classList.contains('revealed') ||
        element.classList.contains('flag'))
    {
        return;
    }
    element.classList.add('revealed', 'empty');
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i >= 0 && i < boardSize && j >= 0 && j < boardSize) {
                const adjacentElement = tiles[i * boardSize +j];
                if (board[i][j] === 0) {
                    displayEmpty(board, adjacentElement, i, j);
                }
                if (board[i][j] > 0) {
                    adjacentElement.classList.add('revealed', 'value' + board[i][j]);
                    adjacentElement.innerHTML = board[i][j];
                }
            }
        }
    }
}


function displayBoard(board) {
    let elements = [];
    board.forEach((row, x) => {
        row.forEach((tile, y) => {
            let element = document.createElement('div')
            element.classList.add('tile')
            element.addEventListener('click', () => {
                if (element.classList.contains('flag')) {
                    return
                }
                if (board[x][y] === 0) {
                    displayEmpty(board, element, x, y)
                }
                if (board[x][y] < 0) {
                    GameOver(board)
                }
                if (board[x][y] > 0) {
                    element.innerHTML = board[x][y]
                    element.classList.add('revealed', 'value' + board[x][y]);
                }
                if(WinGame()){
                    gameOver.innerHTML = "You Won!"
                    gameOver.style.color = "#8EEDD1"
                    gameOver.style.visibility = "visible"
                }
            })
            element.addEventListener('contextmenu', (e) => {
                e.preventDefault()
                if(element.classList.contains('revealed')){
                    return
                }
                if(!element.classList.contains('flag')){
                    element.innerHTML = '🚩'
                    element.classList.add('flag')
                    countFlags++
                } else if(element.classList.contains('flag')){
                    element.innerHTML = ' '
                    element.classList.remove('flag')
                    countFlags--                }
                const flags = document.getElementById('count-flags')
                flags.innerText = countFlags;
            })
            elements.push(element)
        })
    })
    return elements
}

let boardSize = 10
let tiles
const startRestartButton = document.getElementById("st");
let gameStarted = false;

const startBoard = createBoard(boardSize)
display(startBoard)

startRestartButton.addEventListener("click", function () {
    if (!gameStarted) {
        StartGame();
        startRestartButton.innerText = "Restart Game";
    } else {
        RestartGame();
    }
    gameStarted = true;
});


function StartGame() {
    StartTimer()
    startRestartButton.style.visibility = "hidden"
    const board = createBoard(boardSize)
    console.log(board)
    generateMines(board, boardSize)
    countMines(board);
    const display = document.querySelector(".board")
    display.style.display = "grid"
    tiles = displayBoard(board)
    tiles.forEach(tile => {
        document.querySelector('.board').appendChild(tile)
    })
    const startBoard = document.querySelector(".start-board")
    startBoard.style.display = "none"
    const flags = document.getElementById('count-flags')
    flags.innerText = 0;
    countFlags = 0


}

const gameOver = document.getElementById("game-over")

function RestartGame() {
    const boardElement = document.querySelector('.board');
    while (boardElement.firstChild) {
        boardElement.removeChild(boardElement.firstChild);
    }
    StartTimer()
    StartGame()
    startRestartButton.innerText = "Start Game";
    gameOver.style.visibility = "hidden"
    gameStarted = false;
}

function GameOver(board) {
    clearInterval(timeInterval);
    board.forEach((row, x) => {
        row.forEach((value, y) => {
            if (value === -1) {
                const element = tiles[x * boardSize + y];
                element.innerHTML = '💣';
                element.classList.add('mine');
                gameOver.style.visibility = "visible"
                gameOver.style.color = "#AB091E"
                startRestartButton.style.visibility = "visible"
            }
        })
    })
}

function WinGame() {
    let counter = 0
    for(let x = 0; x<boardSize; x++){
        for(let y =0; y< boardSize; y++){
            if(tiles[x *boardSize+ y].classList.contains('revealed')){
                counter++
            }
        }
    }
    if(counter === 80){
        return true;
    }
}

const timer = document.getElementById("timer")
let timeInterval

function StartTimer() {
    clearInterval(timeInterval)
    let seconds = 0,
        minutes = 0

    timeInterval = setInterval(() => {
        timer.innerHTML =
            (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
        seconds++
        if (seconds === 60) {
            minutes++
            seconds = 0
        }
    }, 1000)
}

function countMines(board) {
    let counter = 0;
    for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {
            counter = 0
            if (board[x][y] === 0) {
                // top
                if (x - 1 >= 0) {
                    if (board[x - 1][y] === -1) {
                        counter++
                    }
                }
                //right
                if (y + 1 < boardSize) {
                    if (board[x][y + 1] === -1) {
                        counter++
                    }
                }
                // down
                if (x + 1 < boardSize) {
                    if (board[x + 1][y] === -1) {
                        counter++
                    }
                }
                //left
                if (y - 1 >= 0) {
                    if (board[x][y - 1] === -1) {
                        counter++
                    }
                }
                //top-left
                if (x - 1 >= 0 && y - 1 >= 0) {
                    if (board[x - 1][y - 1] === -1) {
                        counter++
                    }
                }
                //top-right
                if (x - 1 >= 0 && y + 1 < boardSize) {
                    if (board[x - 1][y + 1] === -1) {
                        counter++
                    }
                }
                //down-left
                if (x + 1 < boardSize && y - 1 >= 0) {
                    if (board[x + 1][y - 1] === -1) {
                        counter++
                    }
                }
                //down-right
                if (x + 1 < boardSize && y + 1 < boardSize) {
                    if (board[x + 1][y + 1] === -1) {
                        counter++
                    }
                }
                board[x][y] = counter
            }
        }
    }
}