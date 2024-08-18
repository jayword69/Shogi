// app.js
/* jshint esversion: 6 */
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start');
    const resetButton = document.getElementById('reset');
    const board = document.getElementById('board');
    const turnIndicator = document.getElementById('current-player');
    const player1Captured = document.getElementById('player1-captured');
    const player2Captured = document.getElementById('player2-captured');
    let currentPlayer = 'player1';
    let selectedPiece = null;

    startButton.addEventListener('click', initializeGame);
    resetButton.addEventListener('click', resetGame);

    function initializeGame() {
        board.classList.remove('hidden');
        board.classList.add('show');
        initializeBoard();
        updateTurnIndicator();
    }

    function resetGame() {
        board.classList.add('hidden');
        board.classList.remove('show');
        clearBoard();
        clearCapturedPieces();
        currentPlayer = 'player1';
        selectedPiece = null;
        updateTurnIndicator();
    }

    function initializeBoard() {
        clearBoard();
        placeInitialPieces();
        addPieceInteraction();
    }

	function clearBoard() {
	    board.innerHTML = '';
	    for (let i = 0; i < 81; i++) {
	        const cell = document.createElement('div');
	        cell.className = 'cell';
	        cell.dataset.index = i;
	        board.appendChild(cell);
	    }
	}

    function placeInitialPieces() {
        const initialPositions = [
            { index: 0, piece: 'rook', color: 'player1' },
            { index: 1, piece: 'knight', color: 'player1' },
            { index: 2, piece: 'silver', color: 'player1' },
            { index: 3, piece: 'gold', color: 'player1' },
            { index: 4, piece: 'king', color: 'player1' },
            { index: 5, piece: 'gold', color: 'player1' },
            { index: 6, piece: 'silver', color: 'player1' },
            { index: 7, piece: 'knight', color: 'player1' },
            { index: 8, piece: 'rook', color: 'player1' },
            { index: 10, piece: 'bishop', color: 'player1' },
            { index: 16, piece: 'lance', color: 'player1' },
            { index: 18, piece: 'pawn', color: 'player1' },
            { index: 19, piece: 'pawn', color: 'player1' },
            { index: 20, piece: 'pawn', color: 'player1' },
            { index: 21, piece: 'pawn', color: 'player1' },
            { index: 22, piece: 'pawn', color: 'player1' },
            { index: 23, piece: 'pawn', color: 'player1' },
            { index: 24, piece: 'pawn', color: 'player1' },
            { index: 25, piece: 'pawn', color: 'player1' },
            { index: 26, piece: 'pawn', color: 'player1' },

            { index: 72, piece: 'rook', color: 'player2' },
            { index: 73, piece: 'knight', color: 'player2' },
            { index: 74, piece: 'silver', color: 'player2' },
            { index: 75, piece: 'gold', color: 'player2' },
            { index: 76, piece: 'king', color: 'player2' },
            { index: 77, piece: 'gold', color: 'player2' },
            { index: 78, piece: 'silver', color: 'player2' },
            { index: 79, piece: 'knight', color: 'player2' },
            { index: 80, piece: 'rook', color: 'player2' },
            { index: 70, piece: 'bishop', color: 'player2' },
            { index: 64, piece: 'lance', color: 'player2' },
            { index: 54, piece: 'pawn', color: 'player2' },
            { index: 55, piece: 'pawn', color: 'player2' },
            { index: 56, piece: 'pawn', color: 'player2' },
            { index: 57, piece: 'pawn', color: 'player2' },
            { index: 58, piece: 'pawn', color: 'player2' },
            { index: 59, piece: 'pawn', color: 'player2' },
            { index: 60, piece: 'pawn', color: 'player2' },
            { index: 61, piece: 'pawn', color: 'player2' },
            { index: 62, piece: 'pawn', color: 'player2' }
        ];

        initialPositions.forEach(position => {
            const cell = board.children[position.index];
            cell.innerHTML = `<div class="piece ${position.color} ${position.piece}" data-piece="${position.piece}">${getPieceSymbol(position.piece)}</div>`;
        });
    }

    function getPieceSymbol(piece) {
        const symbols = {
            king: '王',
            rook: '飛',
            bishop: '角',
            gold: '金',
            silver: '銀',
            knight: '桂',
            lance: '香',
            pawn: '歩'
        };
        return symbols[piece] || '';
    }

    function addPieceInteraction() {
        board.addEventListener('click', handleBoardClick);
    }

    function handleBoardClick(event) {
        const clickedElement = event.target;
        if (clickedElement.classList.contains('piece')) {
            handlePieceClick(clickedElement);
        } else if (clickedElement.classList.contains('cell') && clickedElement.classList.contains('highlight')) {
            movePiece(selectedPiece, clickedElement);
        }
    }

    function handlePieceClick(piece) {
        if (piece.classList.contains(currentPlayer)) {
            if (selectedPiece === piece) {
                deselectPiece();
            } else {
                selectPiece(piece);
            }
        } else if (selectedPiece && isValidMove(selectedPiece, piece.parentElement.dataset.index)) {
            capturePiece(piece);
            movePiece(selectedPiece, piece.parentElement);
        }
    }

    function selectPiece(piece) {
        deselectPiece();
        selectedPiece = piece;
        piece.classList.add('active');
        showPossibleMoves(piece);
    }

    function deselectPiece() {
        if (selectedPiece) {
            selectedPiece.classList.remove('active');
            clearHighlights();
            selectedPiece = null;
        }
    }

    function movePiece(fromPiece, toCell) {
        toCell.innerHTML = fromPiece.outerHTML;
        fromPiece.parentElement.innerHTML = '';
        deselectPiece();
        togglePlayer();
    }

    function capturePiece(piece) {
        const capturedPieceContainer = currentPlayer === 'player1' ? player1Captured : player2Captured;
        const capturedPiece = document.createElement('div');
        capturedPiece.className = `piece ${currentPlayer}`;
        capturedPiece.textContent = piece.textContent;
        capturedPieceContainer.appendChild(capturedPiece);
    }

    function isValidMove(piece, toIndex) {
        const fromIndex = parseInt(piece.parentElement.dataset.index);
        const possibleMoves = getPossibleMoves(piece, fromIndex);
        return possibleMoves.includes(parseInt(toIndex));
    }

    function showPossibleMoves(piece) {
        const index = parseInt(piece.parentElement.dataset.index);
        const possibleMoves = getPossibleMoves(piece, index);
        possibleMoves.forEach(moveIndex => {
            board.children[moveIndex].classList.add('highlight');
        });
    }

    function clearHighlights() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.classList.remove('highlight'));
    }

    function togglePlayer() {
        currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
        updateTurnIndicator();
    }

    function updateTurnIndicator() {
        turnIndicator.textContent = currentPlayer === 'player1' ? 'Jugador 1' : 'Jugador 2';
    }

    function clearCapturedPieces() {
        player1Captured.innerHTML = '';
        player2Captured.innerHTML = '';
    }

 function getPossibleMoves(piece, index) {
    const type = piece.dataset.piece;
    const color = piece.classList.contains('player1') ? 'player1' : 'player2';
    let possibleMoves = [];

    switch (type) {
        case 'king':
            addKingMoves(index, possibleMoves);
            break;
        case 'rook':
            addRookMoves(index, possibleMoves);
            break;
        case 'bishop':
            addBishopMoves(index, possibleMoves);
            break;
        case 'gold':
            addGoldMoves(index, possibleMoves, color);
            break;
        case 'silver':
            addSilverMoves(index, possibleMoves, color);
            break;
        case 'knight':
            addKnightMoves(index, possibleMoves, color);
            break;
        case 'lance':
            addLanceMoves(index, possibleMoves, color);
            break;
        case 'pawn':
            addPawnMoves(index, possibleMoves, color);
            break;
    }
    return possibleMoves.filter(moveIndex => isValidIndex(moveIndex) && !isSameColorPiece(moveIndex, color));
}

function addKingMoves(index, possibleMoves) {
    const directions = [-1, 1, -9, 9, -10, 10, -11, 11];
    directions.forEach(dir => {
        const moveIndex = index + dir;
        if (isValidIndex(moveIndex)) possibleMoves.push(moveIndex);
    });
}

function addRookMoves(index, possibleMoves) {
    addLineMoves(index, possibleMoves, [1, -1, 9, -9]);
}

function addBishopMoves(index, possibleMoves) {
    addLineMoves(index, possibleMoves, [10, -10, 11, -11]);
}

function addGoldMoves(index, possibleMoves, color) {
    const forwardDirection = color === 'player1' ? -9 : 9;
    const directions = [-1, 1, -9, 9, forwardDirection];
    directions.forEach(dir => {
        const moveIndex = index + dir;
        if (isValidIndex(moveIndex)) possibleMoves.push(moveIndex);
    });
}

function addSilverMoves(index, possibleMoves, color) {
    const forwardDirection = color === 'player1' ? -9 : 9;
    const directions = [-10, 10, -11, 11, forwardDirection];
    directions.forEach(dir => {
        const moveIndex = index + dir;
        if (isValidIndex(moveIndex)) possibleMoves.push(moveIndex);
    });
}

function addKnightMoves(index, possibleMoves, color) {
    const forwardDirection = color === 'player1' ? -9 : 9;
    const directions = [forwardDirection * 2 - 1, forwardDirection * 2 + 1];
    directions.forEach(dir => {
        const moveIndex = index + dir;
        if (isValidIndex(moveIndex)) possibleMoves.push(moveIndex);
    });
}

function addLanceMoves(index, possibleMoves, color) {
    const forwardDirection = color === 'player1' ? -9 : 9;
    addLineMoves(index, possibleMoves, [forwardDirection]);
}

function addPawnMoves(index, possibleMoves, color) {
    const forwardDirection = color === 'player1' ? -9 : 9;
    const moveIndex = index + forwardDirection;
    if (isValidIndex(moveIndex)) possibleMoves.push(moveIndex);
}

function addLineMoves(index, possibleMoves, directions) {
    directions.forEach(direction => {
        let currentIndex = index;
        while (true) {
            currentIndex += direction;
            if (!isValidIndex(currentIndex)) break;
            possibleMoves.push(currentIndex);
            if (board.children[currentIndex].firstChild) break;
            if (isEdge(currentIndex, direction)) break;
        }
    });
}

function isValidIndex(index) {
    return index >= 0 && index < 81;
}

function isEdge(index, direction) {
    return (direction === 1 && index % 9 === 8) || 
           (direction === -1 && index % 9 === 0) ||
           (direction === 9 && index >= 72) ||
           (direction === -9 && index <= 8);
}

// ... (resto del código)

function isSameColorPiece(index, color) {
    const cell = board.children[index];
    if (cell.firstChild) {
        return cell.firstChild.classList.contains(color);
    }
    return false;
}

// Inicialización del juego
initializeGame();

// Cierre del event listener de DOMContentLoaded, si lo estás usando
});