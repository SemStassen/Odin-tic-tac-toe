// const gameBoardObject = (function () {
// 	// const gameboard = new Array(9);
// 	const gameboard = ['O', 'X', 'O',
// 					   'O', 'O', 'X',
// 					   'O', 'X', 'X']
// 	return {
// 		gameboard,
// 	};
// })();

// const displayController = (function () {
// 	const _tiles = document.querySelectorAll(".game-tile");
// 	const _addEventListeners = function () {
// 		[..._tiles].forEach((tile, index) => {
// 			tile.addEventListener("click", function () {
// 				console.log(index);
// 			});
// 		});
// 	};


// 	const initBoard = function () {
// 		_addEventListeners();
// 	};
// 	const populateBoard = function () {
// 		[..._tiles].forEach((tile, index) => {
// 			console.log(tile);
// 			tile.textContent = gameBoardObject.gameboard[index];
// 		});
// 	};
// 	return {
// 		populateBoard,
// 		initBoard,
// 	};
// })();

// const playerFactory = function () {
// 	return {};
// };

// const playerOne = playerFactory();
// const playerTwo = playerFactory();

// displayController.populateBoard();
// displayController.initBoard();
// function gameBoard() {
// 	const boardRows = 3;
// 	const boardColumns = 3;
// 	const board = [];

// 	for (let i = 0; i < boardRows; i++) {
// 		board[i] = [];
// 		for (let j = 0; j < boardColumns; j++) {
// 			board[i][j] = cellFactory();
// 		}
// 	}

// 	const getBoard = () => board.map((row) => row.map((cell) => cell.getValue()));

// 	const addMarker = (player, row, column) => {
// 		if (board[row][column].getValue() == '') {
// 			board[row][column].addToken(player);
// 		}
// 	} 

// 	const printBoard = () => {
// 		const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
// 		console.log(boardWithCellValues);
		
// 	}

// 	return {getBoard, addMarker, printBoard}
// }

// function cellFactory () {
// 	let value = '';

// 	const addToken = (player) => {
// 		value = player;
// 	}

// 	const getValue = () => value;

// 	return {
// 		addToken,
// 		getValue
// 	};
// }

// const playerFactory = (name, token) => {
// 	const getName = () => name;
// 	const getToken = () => token;

// 	return {getName, getToken}
// }

// const gameController = (() => {
// 	const board = gameBoard();

// 	const players = [
// 		playerFactory('Sem', 'X'),
// 		playerFactory('Test', 'O'),
// 	];

// 	let activePlayer = players[0];

// 	const switchActivePlayer = () => {
// 		activePlayer = (activePlayer == players[0]) ? players[1] : players[0]
// 	}

// 	const getActivePlayer = () => activePlayer;

// 	const printNewRound = () => {
// 		board.printBoard();
// 		console.log(` ${getActivePlayer().getName()}'s beurt` );
// 	}

// 	const playRound = (row, column) => {
// 		// console.log('beginstand');
// 		// printNewRound();

// 		board.addMarker(getActivePlayer().getToken(), row, column);

// 		checkForWin();

// 		switchActivePlayer();
		
// 		// console.log('eindstand');
// 		// printNewRound();
// 	}

// 	const checkForWin = () => {
// 		const boardWithValues = board.getBoard();
// 		console.log(boardWithValues);

// 	}



// 	return {
// 		getActivePlayer,
// 		playRound
// 	}
// })()

// gameController.playRound(2, 2);
