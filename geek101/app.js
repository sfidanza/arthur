
function init() {
	drawGrid(10, 10);
	putBombs(10, 10, 20);
	countAdjacentBombs(10, 10);
}

function drawGrid(nb_rows, nb_cols) {
	var grid = $('#grid');
	for (var x = 0; x < nb_rows; x++) {
		var row = $('<tr></tr>');
		for (var y = 0; y < nb_cols; y++) {
			var cell = $('<td></td>');
			
			// classes de lignes et de colonnes
			cell.addClass('row' + x); // lignes
			cell.addClass('col' + y); // colonnes
			cell.addClass('paint');

			row.append(cell);
		}
		grid.append(row);
	}
}

function putBombs(nb_rows, nb_cols, percentage) {
    var nbBombes = Math.round((nb_rows * nb_cols) * percentage / 100); // notre sac de bombes
    // on place des bombes TANT QU'il est en reste
    while (nbBombes > 0) {
        var x = Math.floor(Math.random() * nb_rows); // x random
        var y = Math.floor(Math.random() * nb_cols); // y random
        var cell = $('.row' + x + '.col' + y); // sélection de notre cellule (x;y) random
        if (!cell.hasClass('bomb')) { // si ce n’est pas déjà une bombe
            cell.addClass('bomb'); // elle devient une bombe
            nbBombes--; // on enlève une bombe de notre sac
        }
    }
}

//fonction qui met les chiffres
function countAdjacentBombs(nb_rows, nb_cols) {
	for (x=0; x < nb_rows; x++) {
	  for (y=0; y < nb_cols; y++) {
		// si la case sur laquelle on est (x;y) n'est pas une bombe, alors...
		if (!hasBomb(x, y)) {
			var count = 0; // compteur de bombes
			if (hasBomb(x-1, y-1)) { count++; }
			if (hasBomb(x-1, y)) { count++; }
			if (hasBomb(x-1, y+1)) { count++; }
			if (hasBomb(x, y-1)) { count++; }
			if (hasBomb(x, y+1)) { count++; }
			if (hasBomb(x+1, y-1)) { count++; }
			if (hasBomb(x+1, y)) { count++; }
			if (hasBomb(x+1, y+1)) { count++; }

			// on met la valeur du compteur dans la case (x;y)
			let cell = $('.row'+x+'.col'+y);
			cell.text(count);
			switch (count) {
				case 0:
					cell.css('color', 'white'); break;
				case 1:
					cell.css('color', 'gray'); break;
			}
		}
	  }
	}
  }

function hasBomb(x, y) {
	return $('.row'+x+'.col'+y).hasClass('bomb');
}