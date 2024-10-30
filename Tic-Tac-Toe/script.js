
const board = document.getElementById('game-board');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart-button');
const modeSelect = document.getElementById('mode-select');
const difficultySelect = document.getElementById('difficulty-select');

let currentPlayer = 'O'; // Start with player 'O' for 2-player mode
let boardState = ['', '', '', '', '', '', '', '', ''];
let gameMode = '2player';
let aiDifficulty = 1; // Default to Easy
let gameInProgress = true;

// Function to handle cell click
const handleClick = (e) => {
    const cellIndex = e.target.dataset.cell;

    if (boardState[cellIndex] === '' && currentPlayer === 'O' && gameInProgress) {
        boardState[cellIndex] = currentPlayer;
        e.target.textContent = currentPlayer;

        if (checkWin()) {
            setTimeout(() => alert(`${currentPlayer} wins!`), 100);
            gameInProgress = false;
            return;
        }

        if (boardState.every(cell => cell !== '')) {
            setTimeout(() => alert("It's a draw!"), 100);
            gameInProgress = false;
            return;
        }

        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        // AI move if playing against AI and it's AI's turn
        if (gameMode === 'ai' && currentPlayer === 'X') {
            setTimeout(aiMove, 500); // Delay AI move for better user experience
        }
    }
};

// Minimax algorithm
const minimax = (boardState, depth, isMaximizing) => {
    const winner = checkWinner(boardState);
    if (winner === 'X') return 10 - depth;
    if (winner === 'O') return depth - 10;
    if (boardState.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i] === '') {
                boardState[i] = 'X';
                const score = minimax(boardState, depth + 1, false);
                boardState[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i] === '') {
                boardState[i] = 'O';
                const score = minimax(boardState, depth + 1, true);
                boardState[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

// Function for AI move
const aiMove = () => {
    if (!gameInProgress) return;

    let bestMove = -1;
    let bestScore = -Infinity;

    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === '') {
            boardState[i] = 'X';
            const score = minimax(boardState, 0, false);
            boardState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (bestMove !== -1) {
        boardState[bestMove] = 'X';
        cells[bestMove].textContent = 'X';

        if (checkWin()) {
            setTimeout(() => alert("X wins!"), 100);
            gameInProgress = false;
            return;
        }

        if (boardState.every(cell => cell !== '')) {
            setTimeout(() => alert("It's a draw!"), 100);
            gameInProgress = false;
            return;
        }

        // Switch back to player 'O'
        currentPlayer = 'O';
    }
};

// Function to check for a win
const checkWin = () => {
    const winner = checkWinner(boardState);
    return winner !== null;
};

// Function to check winner
const checkWinner = (state) => {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const [a, b, c] of winningCombinations) {
        if (state[a] && state[a] === state[b] && state[a] === state[c]) {
            return state[a];
        }
    }
    return null;
};

// Function to restart the game
const restartGame = () => {
    boardState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'O'; // Start with player 'O' for 2-player mode
    gameInProgress = true;
};

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleClick));
restartButton.addEventListener('click', restartGame);

modeSelect.addEventListener('change', (e) => {
    gameMode = e.target.value;
    restartGame();
});

difficultySelect.addEventListener('change', (e) => {
    aiDifficulty = parseInt(e.target.value);
});

// Initial setup
restartGame();
