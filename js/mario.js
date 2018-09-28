var rowSize = prompt("Please enter row size");
var colSize = prompt("Please enter coloumn size");
window.focus();
var autoStarted = false;
var intervalId;

var directionKey;

document.querySelector('#mushroomsLeft').innerHTML = rowSize;

var marioStatus = {
    currentPos: [0, 0],
    rows: rowSize-1,
    cols: colSize-1,
    mushroomsLeft: rowSize,
    mushrooms: getRandom(rowSize, colSize),
    moves: 0,
    moveRight: function () {
        if (this.currentPos[1] < this.cols) {
            this.currentPos[1] += 1;
            return true;
        } else {
            directionKey = 37;
            return false;
        }
    },
    moveLeft: function () {
        if (this.currentPos[1] > 0) {
            this.currentPos[1] -= 1;
            return true;
        } else {
            directionKey = 39;
            return false;
        }
    },
    moveUp: function () {
        if (this.currentPos[0] > 0) {
            this.currentPos[0] -= 1;
            return true;
        } else {
            directionKey = 40;
            return false;
        }
    },
    moveDown: function () {
        if (this.currentPos[0] < this.rows) {
            this.currentPos[0] += 1;
            return true;
        } else {
            directionKey = 38;
            return false;
        }
    },
    updateMushroomCount: function(indeces) {
        this.moves++;
        var index = this.mushrooms.indexOf(indeces);
        if(index > -1){
            this.mushrooms.splice(index,1);
            this.mushroomsLeft -= 1;
            return true;
        }
        return false;
    }
}

document.onkeydown = function(e) {
    var key = e.keyCode;
    directionKey = key;
    triggerAuto();
    autoStarted = true;
}

function triggerAuto(){
    if(!autoStarted){
        intervalId = setInterval(autoMoveMario,700);
    }
}


function autoMoveMario() {
    switch(directionKey){
        case 37:
            marioStatus.moveLeft();
            break;
        case 38:
            marioStatus.moveUp();
            break;
        case 39:
            marioStatus.moveRight();
            break;
        case 40:
            marioStatus.moveDown();
            break;
        
    }
    moveMario();
}

function moveMario(){
    var size = 50;
    var top = marioStatus.currentPos[0] * size;
    var left = marioStatus.currentPos[1] * size;
    var indeces = marioStatus.currentPos[0] + ',' + marioStatus.currentPos[1];

    var mario = document.querySelector('.mario');

    mario.style.top = top + 'px';
    mario.style.left = left + 'px';

    var isUpdated = marioStatus.updateMushroomCount(indeces);

    if(isUpdated){
        document.querySelector('[data-indeces="'+indeces+'"]').removeAttribute('class');
        document.querySelector('#mushroomsLeft').innerHTML = marioStatus.mushroomsLeft;
    }

    document.querySelector('#marioMoves').innerHTML = marioStatus.moves;

    if(marioStatus.mushroomsLeft == 0){
        setTimeout(() => {alert("hurry, ate all the mushrooms")},300);
        clearInterval(intervalId);
    }
}

function generateGrid(rows, cols) {
    var mushrooms = marioStatus.mushrooms;
    var grid = [];
    for (var r = 0; r < rows; r++) {
        var temp = [];
        for (var c = 0; c < cols; c++) {
            if (mushrooms.indexOf(r + ',' + c) > -1) {
                temp[c] = 1;
            } else {
                temp[c] = 0;
            }
        }
        grid.push(temp);
    }
    return grid;
}

function getRandom(m, n) {
    var random = [];
    for (var i = 0; i < m; i++) {
        var mRandom = Math.floor(Math.random() * m);
        var nRandom = Math.floor(Math.random() * n);
        var indeces = mRandom + ',' + nRandom;
        if (random.indexOf(indeces) == -1) {
            random.push(indeces)
        } else {
            i--;
        }
    }
    return random;
}

function drawGrid(gridArray) {
    var withoutMushRoom = '<div></div>';
    var formGrid = '';
    for (var i = 0; i < gridArray.length; i++) {
        var formRow = '<div class="row">';
        var formColumn = '';
        for (var j = 0; j < gridArray[i].length; j++) {
            if (gridArray[i][j] == 1) {
                formColumn += '<div class="mushroom" data-indeces="' + i + ',' + j + '"></div>';
            } else {
                formColumn += withoutMushRoom;
            }
        }
        formGrid += formRow + formColumn + '</div>';
    }
    return formGrid;
}


var grid = generateGrid(rowSize, colSize);
var formContent = drawGrid(grid);
document.querySelector('.mario-grid').innerHTML = formContent +'<div class="mario"></div>';

moveMario();