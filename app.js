"use strict"

const view = (() => {

	const _gameBoard = document.querySelector('.gameboard');

	const _createTiles = () => {
		for (let x = 0; x < 3; x++) {
			for (let y = 0; y < 3; y++) {
				const div = document.createElement("div");
				div.classList.add('game-tile');
				div.dataset.xpos = x;
				div.dataset.ypos = y;
				_gameBoard.append(div);
			}
		}
	}

	const _addListeners = () => {
		const tiles = document.querySelectorAll('.game-tile');
		[...tiles].forEach((tile) => {
			tile.addEventListener('click', (e) => {
				gameController.makeMove(e.target);
			})
		})

		const restart = document.querySelector('header button');
		restart.addEventListener('click', () => gameController.restartGame());

		const newRound = document.querySelector('.new-round button');
		newRound.addEventListener('click', () => gameController.newRound());
	}

	const initModal = () => {
		const modal = document.querySelector('dialog');
		modal.showModal();

		// Add validation and reactivity to forms;
		const playerCountRadios = modal.querySelectorAll('input[name="playerCount"]');
		const multiPlayerWrapper = modal.querySelector('.player-wrapper.multiplayer');
		const multiPlayerInputField = multiPlayerWrapper.querySelector('input');
		[...playerCountRadios].forEach((radioButton) => {
			radioButton.addEventListener('change', (e) => {
				if (e.currentTarget.value == 2) {
					multiPlayerWrapper.classList.remove('hidden');
					multiPlayerInputField.setAttribute('required', '');
				} else {
					multiPlayerWrapper.classList.add('hidden');
					multiPlayerInputField.removeAttribute('required');
				}
			})
		})

		// Validate button
		const form = modal.querySelector('form');
		modal.querySelector('button[type="submit"]').addEventListener('click', (e) => {
			e.preventDefault();
			// Only continue if form is valid;
			if (form.checkValidity()) {
				const data = new FormData(form);
				const playerOneName = data.get('playerOneName');
				const playerTwoName = data.get('playerTwoName');
				gameController.createPlayers(playerOneName, playerTwoName);
				modal.close()
			} 
		})
	}

	const addScoreNames = (playerOne, playerTwo) => {
		const playerOneName = document.querySelector('.player.player-one .name');
		const playerTwoName = document.querySelector('.player.player-two .name');

		playerOneName.textContent = playerOne.getPlayerName();
		playerTwoName.textContent = playerTwo.getPlayerName();
	}

	const renderScore = (score) => {
		document.querySelector('.player-one .score').textContent = score[0];
		document.querySelector('.player-two .score').textContent = score[1];
	}

	const updateGameBoard = (gameBoard) => {
		const tiles = document.querySelectorAll('.game-tile');
		console.log(tiles);
		[...tiles].forEach((tile, i) => {
			tile.textContent = gameBoard[i];
		})
	}

	const updateGameStatus = (string) => {
		const gameStatus = document.querySelector('.game-status p');
		gameStatus.textContent = string;
	}

	const toggleGameBoard = () => {
		const newRound = document.querySelector('.new-round');
		const gameWrapper = document.querySelector('.gameboard');
		const winScreen = document.querySelector('.win-screen');
		newRound.classList.toggle('hidden');
		gameWrapper.classList.toggle('hidden');
		winScreen.classList.toggle('hidden');
	}
	
	const initView = () => {
		_createTiles();
		_addListeners();
	}

	return {initView, 
			initModal,
			renderScore,
			addScoreNames,
			updateGameBoard, 
			updateGameStatus,
			toggleGameBoard}; 
})()

const model = (() => {

	const _gameTiles = ['', '', '', 
						'', '', '',
						'', '', '',
 						];

	let _score = [0, 0];

	const resetScore = () => {
		_score = [0, 0];
	}

	const addScore = (player) => {
		player.getPlayerMarker() == 'X' ? _score[0]++ : _score[1]++;
	}

	const getScore = () => {
		return _score;
	}
	
	const resetGameBoard = () => {
		for(let i = 0; i<_gameTiles.length; i++) {
			_gameTiles[i] = '';
		}
	}

	const getGameBoard = () => {
		return _gameTiles;
	}				
	
	const addMarker = (marker, index) => {
		_gameTiles[index] = marker;
	}

	return {getGameBoard, addMarker, getScore, addScore, resetScore, resetGameBoard};
})()

const gameController = (() => {

	const winConditions = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	]

	let _initDoOnce = false;
	let activePlayer;
	let playerOne;
	let playerTwo;

	const initGame = () => {
		// Only load the gametiles and eventlisteners once.
		view.initView();
		view.initModal();
	}

	const restartGame = () => {
		model.resetScore();
		view.renderScore(model.getScore());
		view.initModal();
	}

	const newRound = () => {
		model.resetGameBoard();
		view.updateGameBoard(model.getGameBoard());
		view.toggleGameBoard();
		view.updateGameStatus(`${activePlayer.getPlayerName()}'s turn`)
	}

	const createPlayers = (playerOneName, playerTwoName) => {
		playerTwoName == '' ? playerTwoName = "Computer" : '' ;
		playerOne = playerFactory(playerOneName, "X");
		playerTwo = playerFactory(playerTwoName, "O");
		view.addScoreNames(playerOne, playerTwo);
		_switchActivePlayer();
		view.updateGameStatus(`${activePlayer.getPlayerName()}'s turn`)
	}


	const _switchActivePlayer = () => {
		activePlayer == playerOne ? activePlayer = playerTwo : activePlayer = playerOne;
		console.log({activePlayer});
	}


	const makeMove = (tile) => {
		const gameBoard = model.getGameBoard();
		const arrayIndex = ((Number(tile.dataset.xpos) * 3) + Number(tile.dataset.ypos));

		if (gameBoard[arrayIndex]) {
			console.log("Invalid move");
			return;
		}

		const activePlayerMarker = activePlayer.getPlayerMarker()
		model.addMarker(activePlayerMarker, arrayIndex);
		view.updateGameBoard(model.getGameBoard());

		switch(_checkWinner()) {
			case 'winner':
				_gameFinished(activePlayer);
				return;
			case 'tie':
				console.log('TIE');
				_gameFinished();
				return;
			default:
			_switchActivePlayer();
			view.updateGameStatus(`${activePlayer.getPlayerName()}'s turn`)
		}
	}

	const _gameFinished = (winningPlayer = undefined) => {
		const winScreen = document.querySelector('.win-screen')
		const winningPlayerName = winScreen.querySelector('.player-name');
		const winningPlayerMarker = winScreen.querySelector('.player-marker');

		if (winningPlayer) {
		winningPlayerName.textContent = winningPlayer.getPlayerName();
		winningPlayerMarker.textContent = winningPlayer.getPlayerMarker();
		view.updateGameStatus('Congratulations!')
		model.addScore(winningPlayer);
		view.renderScore(model.getScore());
		} else {
			winningPlayerName.textContent = 'Nobody';
			winningPlayerMarker.textContent = 'X O'
			view.updateGameStatus('It\'s a tie!')
		}

		view.toggleGameBoard();
	}

	const _checkWinner = () => {
		const gameBoard = model.getGameBoard();
		
		for (let i = 0; i < winConditions.length; i++) {
			if ( gameBoard[winConditions[i][0]] == gameBoard[winConditions[i][1]] && 
			     gameBoard[winConditions[i][1]] == gameBoard[winConditions[i][2]] && 
				 gameBoard[winConditions[i][0]]) 
				{
					return 'winner';
			}
		}
		for (let i = 0; i < gameBoard.length; i++) {
			if (gameBoard[i] == '') {
				return false;
			}
		}
		return 'tie'
	}

	return {initGame, makeMove, createPlayers, restartGame, newRound};
})();

const playerFactory = (nickName, playerMarker) => {
	const _playerName = nickName;
	const _playerMarker = playerMarker

	const getPlayerName = () => {
		return _playerName;
	}

	const getPlayerMarker = () => {
		return _playerMarker;
	}

	return {
		getPlayerName,
		getPlayerMarker
	}
}

gameController.initGame();

