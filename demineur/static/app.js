/**********************************************************
 * Page
 **********************************************************/
 
var page = {};
page.data = {};

page.config = {
	i18n: {
		'Game Over': 'Game Over',
		'You won!': 'You won!'
	},
	area: {
		main: "global-container"
	}
};

page.initialize = function() {
	game.init();
};

page.destroy = function() {
	game.stopTimer();
};

/**********************************************************/
var game = {};
game.mines = 0;

game.init = function() {
	board.init();
	this.level = 1;
	this.mines = MINES;
	this.setMines(this.mines);
	this.fillBoard();
};

game.addMines = function(nb) {
	this.mines += nb;
	this.setMines(this.mines);
};

game.setMines = function(value) {
	document.getElementById('mines').innerHTML = value + '';
};

game.setTimer = function(value) {
	document.getElementById('timer').innerHTML = value + '';
};

game.startTimer = function() {
	this.startTime = Date.now();
	this.timer = window.setInterval(function() {
		let elapsed = Math.round((Date.now() - game.startTime) / 1000);
		game.setTimer(elapsed);
	}, 1000);
};

game.stopTimer = function() {
	if (this.timer) {
		window.clearInterval(this.timer);
		this.timer = null;
	}
};

game.setLevel = function(level, item) {
	let old = document.querySelector('#menu-container .active');
	if (old) old.className = ''
	this.level = level;
	item.className = 'active';
};

game.fromTarget = function(target) {
	return target.id.split('-').slice(1).map(v => +v);
};

game.start = function(x0, y0) {
	board.randomize(x0, y0);
	this.fillBoard();
	this.running = true;
	this.startTimer();
};

game.stop = function(won) {
	this.running = false;
	this.finished = true;
	this.stopTimer();
	if (!won) {
		this.showMines();
		this.showStatus(page.config.i18n['Game Over'], 'fail');
	} else {
		this.showStatus(page.config.i18n['You won!'], 'success');
	}
};

game.click = function(target, action) {
	if (this.finished) return false;
	let [x, y] = game.fromTarget(target);
	if (!this.running) this.start(x, y);
	let cell = board.get(x, y);
	if (!cell.open) {
		cell = action(x, y);
		this.updateCell(x, y, cell);
		if (cell.open && cell.mine) {
			this.stop(false);
			return false;
		}
		if (cell.open && !cell.around) {
			this.openAllNeighbours(board.getPos(x, y));
		}
		let closed = board.data.filter(cell => !cell.open).length
		if (closed === MINES) {
			this.stop(true);
			return false;
		}
	}
};

game.openAllNeighbours = function(pos) {
	board.getNeighbours(pos).forEach(n => {
		let cell = board.data[n];
		if (!cell.open) {
			let [x, y] = board.getXY(n);
			cell = board.open(x, y);
			this.updateCell(x, y, cell);
			if (!cell.around) this.openAllNeighbours(n);
		}
	});
};

game.debugBoard = function() {
	board.data.forEach((cell, i) => {
		let [x, y] = board.getXY(i);
		let elem = document.getElementById('minesweeper-' + x + '-' + y);
		if (cell.mine) {
			elem.className = 'minesweeper-mine';
			elem.innerHTML = '';
		} else {
			elem.className = 'minesweeper-nb minesweeper-nb-' + cell.around;
			elem.innerHTML = (cell.around || '') + '';
		}
	});
};

game.showStatus = function(text, className) {
	let status = document.getElementById('status');
	status.innerHTML = text;
	status.className = className;
};

game.showMines = function() {
	board.mines.forEach((pos) => {
		let cell = board.data[pos];
		if (!cell.open) {
			let [x, y] = board.getXY(pos);
			let elem = document.getElementById('minesweeper-' + x + '-' + y);
			elem.className = 'minesweeper-mine';
			elem.innerHTML = '';
		}
	});
};

game.fillBoard = function() {
	board.data.forEach((cell, i) => {
		let [x, y] = board.getXY(i);
		this.updateCell(x, y, cell);
	});
};

game.updateCell = function(x, y, cell) {
	let elem = document.getElementById('minesweeper-' + x + '-' + y);
	if (cell.open) {
		if (cell.mine) {
			elem.className = 'minesweeper-mine-clicked';
			elem.innerHTML = '';
		} else {
			elem.className = 'minesweeper-nb minesweeper-nb-' + (cell.around || 0);
			elem.innerHTML = (cell.around || '') + '';
		}
	} else if (cell.flag === 1) {
		elem.className = 'minesweeper-flag';
		elem.innerHTML = '';
	} else if (cell.flag === 2) {
		elem.className = 'minesweeper-mark';
		elem.innerHTML = '?';
	} else {
		elem.className = 'minesweeper-unknown';
		elem.innerHTML = '';
	}
};

/**********************************************************
 * SIZE * SIZE with each cell containing a status:
 *   null: unknown (still covered)
 *   [object]:
 *     open: true/false
 *     mine: true/false
 *     flag: 0 (no flag) / 1 (flag) / 2 (question mark)
 *     around: 0..8 (number of neighbour mines)
 **********************************************************/
const SIZE = 9;
const MINES = 10;
var board = {};

board.init = function() {
	this.data = new Array(SIZE*SIZE).fill(null);
	this.data.forEach(function(value, i, data) {
		data[i] = {
			flag: 0,
			around: 0
		};
	});
	this.mines = [];
};

board.randomize = function(x0, y0) {
	// fill with random mines - except on safe position
	let length = SIZE*SIZE;
	let m = MINES;
	let safe = this.getPos(x0, y0);
	while (m > 0) {
		let pos = Math.round(Math.random()*length);
		let cell = this.data[pos];
		if (pos !== safe && !cell.mine) {
			cell.mine = true;
			this.mines.push(pos);
			m--;
		}
	}
	
	// compute mines around
	for (let pos of this.mines) {
		let neighbours = this.getNeighbours(pos);
		for (let n of neighbours) {
			this.data[n].around++;
		}
	}
};

board.getNeighbours = function(pos) {
	const length = SIZE*SIZE;
	const dirs = [ -SIZE-1, -SIZE, -SIZE+1, -1, +1, SIZE-1, SIZE, SIZE+1 ];
	let neighbours = [];
	let col = pos % SIZE;
	for (let dir of dirs) {
		let n = pos + dir;
		let nCol = n % SIZE;
		if (n >= 0 && n < length && Math.abs(nCol - col) <= 1) {
			neighbours.push(n);
		}
	}
	return neighbours;
};

board.open = function(x, y) {
	let cell = this.get(x, y);
	if (cell.flag !== 1) {
		cell.open = true;
	}
	return cell;
};

board.flag = function(x, y) {
	let cell = this.get(x, y);
	cell.flag = (cell.flag + 1) % 3;
	if (cell.flag === 1) {
		game.addMines(-1);
	} else if (cell.flag === 2) {
		game.addMines(+1);
	}
	return cell;
};

board.getXY = function(pos) {
	let x = pos % SIZE;
	let y = Math.floor(pos / SIZE);
	return [x, y];
};

board.getPos = function(x, y) {
	return (x + y*SIZE);
};

board.get = function(x, y) {
	return this.data[x + y*SIZE];
};

/**********************************************************/

window.addEventListener("load", page.initialize);
window.addEventListener("unload", page.destroy);
