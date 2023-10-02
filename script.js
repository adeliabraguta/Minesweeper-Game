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

let boardSize = 10
const board = createBoard(boardSize)
generateMines(board, boardSize)

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

console.log(board)

function displayBoard(board) {
    let elements = [];
    board.forEach(row => {
        row.forEach(value => {
            let element = document.createElement('div')
            element.classList.add('tile')
            if (value < 0) {
                element.classList.add('mine')
            }
            if (value > 0) {
                element.innerHTML = value
                element.classList.add('value')
            }
            elements.push(element)
        })
    })
    return elements
}

countMines(board);
const tiles = displayBoard(board)
tiles.forEach(tile => {
    document.querySelector('.board').appendChild(tile)

})

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



