var nb_rows = 7;  //nb lignes
var nb_cols = 10; //nb col

newGame();
$('#msgPerdu').click(function(){
    $('#msgPerdu').fadeOut(800);
});
$('#msgGagne').click(function(){
    $('#msgGagne').fadeOut(800);
});

$('#btn_facile').click(function(){
    nb_rows = 5;
    nb_cols = 5;
    newGame();
});
$('#btn_moyen').click(function(){
    nb_rows = 10;
    nb_cols = 10;
    newGame();
});
$('#btn_dur').click(function(){
    nb_rows = 20;
    nb_cols = 20;
    newGame();
});

function newGame(){
    var grid = $("#grid"); //le tableau
    grid.empty(); //vide le tableau

    drawGrid(grid); //dessine le tableau
    putBombs(); //place les bombes
    countAdjacentBombs(); //les chiffres
}//newGame

//fonction qui dessine le tableau
function drawGrid(grid){
    var continuegame = true;	
    for(var x = 0;x<nb_rows;x++) {
        //nouvelle ligne
        var newRow=$('<tr></tr>');
        for(var y=0;y<nb_cols;y++){ 
            //nouvelle cellule
            var newCell=$('<td></td>');
            //ajout d'un systemde coordonnées
            newCell.addClass("row"+x);
            newCell.addClass("col"+y);
        
            //ajout d'une couche de peinture
            newCell.addClass("paint");
            
            newCell.click(function(){
                if(!continuegame){
                    return;
                }
                // Clic gauche
                $(this).removeClass('paint');
                
                if($(this).hasClass('bomb')){
                    continuegame = false;
                    // Ton chat meurt!Maudit chien!
                    $('#msgPerdu').fadeIn(800);			    
                } else if($(this).text()=='0'){
                    explodeZeros($(this));
                }
            
                if($('.paint').length== $('.bomb').length &&!$(this).hasClass('bomb')){
                    //Ton chat est rentré de sa balade
                    $('#msgGagne').fadeIn(800); 
                }
            });
            
            newCell.contextmenu(function(e){
                e.preventDefault();
                $(this).toggleClass('flag');
            });
            //attache la cellule à la ligne
            newRow.append(newCell);
            
        }//for y
        //attache la ligne à la grille
        grid.append(newRow);

    }//for x

}//drawGrid

function putBombs() {
    var percentage = 20;
    var nbBombes = Math.round((nb_rows * nb_cols) * percentage / 100); // notre sac de bombes
    // on place des bombes TANT QU'il est en reste
    while (nbBombes > 0) {
        var x = Math.floor(Math.random() * nb_rows); // x random
        var y = Math.floor(Math.random() * nb_cols); // y random
        var cell = $('.row' + x + '.col' + y); // sélection de notre cellule (x;y) random
        if (!cell.hasClass('bomb')) { // si ce n’est pas déjà une bombe
            cell.addClass('bomb'); // elle devient une bombe
            nbBombes--; // on enlève une bombe de notre sac
        }//if
    }//while
}//putBombs

//fonction qui met les chiffres
function countAdjacentBombs(){
    for(x=0; x < nb_rows; x++){
        for(y=0; y < nb_cols; y++){
        // si la case sur laquelle on est (x;y) n'est pas une bombe, alors...
        if(!$('.row'+x+'.col'+y).hasClass('bomb')) {
            var count = 0; // compteur de bombes
            if($('.row'+(x-1)+'.col'+(y-1)).hasClass('bomb')) { count++; }
            if($('.row'+(x-1)+'.col'+y).hasClass('bomb')) { count++; }
            if($('.row'+(x-1)+'.col'+(y+1)).hasClass('bomb')) { count++; }
            if($('.row'+x+'.col'+(y+1)).hasClass('bomb')) { count++;}
            if($('.row'+x+'.col'+(y-1)).hasClass('bomb')) { count++; }
            if($('.row'+(x+1)+'.col'+(y-1)).hasClass('bomb')) { count++; }
            if($('.row'+(x+1)+'.col'+y).hasClass('bomb')) { count++; }
            if($('.row'+(x+1)+'.col'+(y+1)).hasClass('bomb')) { count++; }

            // on met la valeur du compteur dans la case (x;y)
            var cell=	$('.row'+x+'.col'+y);
            cell.text(count);
            switch(count){
                case 1:
                    cell.css("color",'blue');
                break;
                case 0:
                    cell.css("color",'red');
                break;
                case 2:
                    cell.css("color",'green');
                    break;
                    case 3:
                    cell.css("color",'purple');	
                    break;
                    case 4:
                    cell.css("color",'pink');
                    break;
                    case 5:
                    cell.css("color",'yellow');
                    break;
                    case 6:
                    cell.css("color",'blue');
                    break;
                    case 7:
                    cell.css("color",'white');
                    break;
                case 8:
                cell.css("color",'green');
                break;
                }         
        } 	//if
        }//for y
    }//forx
} // fin de la fonction countAdjacentBombs

function explodeZeros(cell){
    var col = parseInt(cell.attr('class').match(/\bcol(\d+)\b/)[1]);
    var row = parseInt(cell.attr('class').match(/\brow(\d+)\b/)[1]);
    var selectors = [
        '.col'+(col-1)+'.row'+(row-1),
        '.col'+col+'.row'+(row-1),
        '.col'+(col+1)+'.row'+(row-1),
        '.col'+(col-1)+'.row'+row,
        '.col'+(col+1)+'.row'+row,
        '.col'+(col-1)+'.row'+(row+1),
        '.col'+col+'.row'+(row+1),
        '.col'+(col+1)+'.row'+(row+1)
    ];
    
    $.each(selectors, function(key, value){
        var current_cell = $(selectors[key]);
        if(current_cell.text() == "0" && current_cell.hasClass('paint')){
            current_cell.removeClass('paint');
            explodeZeros(current_cell);
        } else {
            current_cell.removeClass('paint');		
        }		
    });
}
