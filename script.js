//TODO: lots of things:
//-need to separate things between the objects 
//-some hacky elements
//-separate into modules
//-more...


//Change it so that the fade action must pass through the changeGrid.
//This is to ensure that 


//Game manager
//>Activated when you click on palette
//>Is sent the value of the colour, which if allowed, it stores
//>Also activated when you click on grid
//>Is sent position of tile
//Store in this form
//var grid = {1:{1: [element], 2: [element],...}, ...}

function GameView(grid,palette,manager){
	//this.paints = document.getElementsByClassName('paint');
	//this.tiles = document.getElementsByClassName('tile');
	this.manager = manager;
	this.grid = grid;
	this.palette = palette;
	this.container;
	this.tiles;
	this.paints;
	this.board;
	this.score;
	this.paletteContainer;
	 //this will be passed by reference
	//console.log('A new instance of GameView was created');
}

GameView.prototype.reset = function(){
	this.renderPaints();
	var mgr = this.manager;
	var view = this;
	this.grid.array.forEach(function(row){
		row.forEach(function(tile){
			view.renderTile(tile.getPosition(),mgr.blankColour);
		})
	})
	document.getElementById('timer').classList.remove('time-over');
	this.renderScore(0);
	this.renderTime(30);
}

GameView.prototype.setup = function(){
	//could use apply here
	//console.log('GameView.setup was called');
	this.container = document.getElementById('container');
	this.minutes = document.getElementById('minutes');
	this.seconds = document.getElementById('seconds');
	this.drawPalette();
	this.renderPaints();
	this.drawGrid();
	this.score = document.getElementById('score-value');
}


GameView.prototype.renderTile = function(position,colour){
	this.tiles[position.y][position.x].style.backgroundColor = colour;
}

GameView.prototype.renderPaints = function(){
	var view  = this;
	this.palette.colours.forEach(function(colour,i){
		view.paints[i].style.backgroundColor = colour;

	});

}

GameView.prototype.renderScore= function(score){
	this.score.innerHTML = score;
	if(score == 16){
		this.score.parentNode.className = 'win';
	}
}

GameView.prototype.drawGrid = function(){
	//Creates and inserts tile elements 
	//Stores these elements in a grid
	console.log('drawGrid was called')
	var board = document.createElement('div');
	board.className = 'board';
	this.tiles = this.grid.array.map(function(row){
		var newRow = row.map(function(tile){
		var tileEl = document.createElement('div');
		var position = tile.getPosition()
		tileEl.className = 'tile';
		tileEl.id = position.y + '-' + position.x
		board.appendChild(tileEl);
		return tileEl;
	})
		return newRow;
	})
	this.container.appendChild(board);
	this.board = board;
}


GameView.prototype.drawPalette = function(){
	var paletteContainer = document.createElement('div');
	paletteContainer.className = 'palette';
	this.paints = this.palette.colours.map(function(paint,i){
		var paintEl = document.createElement('div');
		paintEl.className = 'paint';
		paintEl.id = i;
		paletteContainer.appendChild(paintEl);
		return paintEl;
	})
	this.container.appendChild(paletteContainer);
	this.paletteContainer = paletteContainer
}

GameView.prototype.renderTime = function(time){
	var mins = Math.floor(time/60);
	var secs = time%60;
	this.minutes.innerHTML = mins>9?mins:'0' + mins;
	this.seconds.innerHTML = secs>9?secs:'0' + secs;
	if(mins == 0 && secs == 0){
		document.getElementById('timer').className = 'time-over'
	}
}


GameView.prototype.display= function(){
	//could use apply here
	console.log('GameView.display was called');
}


GameView.prototype.update = function(){
	//could use apply here
	console.log('GameView.update was called');
}

/*GameView.prototype.setup = function(){
	//Should render the grid 
}*/

GameView.prototype.activate = function(){
	console.log('GameView.activate was called');
	this.activateGrid(this);
	this.activatePalette(this);



}

GameView.prototype.deactivate = function(){
	this.board.onclick = null;
	this.paletteContainer.onclick = null;
	console.log('GameView.deactivate was called');
}

GameView.prototype.activateGrid = function(view){
	this.board.onclick = function(e){
		if(e.target.className == 'tile'){
		var position = e.target.id.split('-');
		view.manager.gridClick({x:Number(position[1]),y:Number(position[0])});
		}
	}

	//this.board.addEventListener('click',callback)



	/*this.grid.array.forEach(function(row,j){
	row.forEach(function(tile,i){
		view.tiles[j][i].addEventListener('click', callback
				function(){
				console.log(tile.getPosition())
				view.manager.gridClick(tile.getPosition());
				}
				);
			});
		});*/
	};



GameView.prototype.activatePalette = function(view){
	this.paletteContainer .onclick = function(e){
		if(e.target.className == 'paint'){
			view.manager.paletteClick((e.target.id));
		}
	}
	//this.palette.toggleActive();

	//this.paletteContainer.addEventListener('click',callback);

	/*this.palette.colours.forEach(function(ind, i){
		view.paints[i].addEventListener('click', function(){
			view.manager.paletteClick(i)
		});
	});*/
}

GameView.prototype.makeTimer = function(){

}





function GameManager(colours,blankColour){
	this.size = [4,4]; //default
	this.blankColour = '#ffffff'; //default
	this.colours = colours;
	this.previousGames = [];
	this.game;
	this.time;
	this.timer;
	this.view;
};

GameManager.prototype.newGame = function(){
	if(this.game){
		this.endGame();
	}
	this.setup();
	this.startGame();
}

GameManager.prototype.setup = function(){
	this.grid = new Grid(this.size,this.blankColour);
	this.palette = new Palette(this.colours);
	this.grid.init();
	this.view = new GameView(this.grid,this.palette,this);
	this.view.setup();

}

GameManager.prototype.fakeFunction = function(variable){
	alert(variable);

}

GameManager.prototype.startGame = function(){
	if(this.game ){
		if(!this.game.over){this.endGame()}
		this.grid.reset();
		this.palette.reset();
		this.view.reset();
	}//If you restart in middle of game
	this.game = new Game(this.grid,this);
	this.time = 30;
	var mgr = this;
	this.view.activate();
	//this.palette.toggleActive();
	this.game.start();
	this.timer = setInterval(function(){
		mgr.clock(mgr);
	},1000);
	this.fader = setInterval(function(){
		mgr.game.fadeRandomTile(mgr.game);
		//console.log('\nTile faded');
		//mgr.palette.showMe();
		//mgr.game.grid.showMe();
	},5000);

}

GameManager.prototype.clock = function(mgr){
	mgr.time -= 1;
	this.view.renderTime(mgr.time)
	//console.log(mgr.time);
	if(mgr.time == 0){
		console.log('Game ended as time over');
		mgr.game.stop(); 
		clearInterval(mgr.timer);
		mgr.endGame();
	};
}

GameManager.prototype.paletteClick = function(choiceInd){
	//console.log('PaletteClick was called');
	//console.log( this.palette.colours);
	//console.log('colour: ' + this.palette.colours[choiceInd] + ', isActive: ' + this.palette.isActive())
	//if(this.palette.isActive() && !this.palette.sameColour(choiceInd)){
	console.log(choiceInd);
	if(!this.palette.sameColour(choiceInd)){
		this.palette.showMe()
		this.palette.selectColour(choiceInd);
		this.palette.shuffle();
		//this.palette.toggleActive();
		this.view.renderPaints();
		//console.log('isActive: ' +this.palette.isActive())
	};
}

GameManager.prototype.gridClick = function(position){
	var choice = this.palette.getSelected();
	if(choice){
		if(this.game.changeGrid(position, choice)){
				this.game.grid.showMe();
				this.view.renderTile(position,choice);
				this.palette.recordColour();
				//this.palette.toggleActive();
				if(this.game.won){
					console.log('Win!!!');
					this.endGame();
				};
			};
		}
}

GameManager.prototype.endGame = function(){
	this.game.stop();
	clearInterval(this.fader);
	clearInterval(this.timer);
	this.view.deactivate();
	this.storeGame();
}

GameManager.prototype.storeGame = function(){
	console.log('storeGame was called');
}

GameManager.prototype.getPreviousGames = function(){
	//Should get these from local storage
}



function Game(grid,mgr){
	this.over;
	this.won;
	this.score;
	this.mgr = mgr;
	//this.fader;
	this.grid = grid;
	this.winScore = (this.grid.getWidth() * this.grid.getHeight());
	this.coloured = [];
}
//Suppose later the option exists to resize the grid, then you would call setup

Game.prototype.start = function(){
	//this.grid.init();
	this.score = 0;
	this.won = false;
	this.over = false;
	var game = this;
	//this.fader = setInterval(function(){game.fadeRandomTile(game);},10000);
}

Game.prototype.fadeRandomTile = function(game){
	//Ensures no fading after win has been declared;
	//Unlike filling, don't need to confirm tile was faded as only coloured ones are considered
	//console.log(game.coloured.length);
	if(!game.won && game.coloured.length){
		var pos = Math.floor(game.coloured.length*Math.random());
		var randPos = game.coloured.splice(pos,1)[0];
		game.grid.fadeTile(randPos);
		//TODO: this should happen through GameManager
		this.mgr.view.renderTile(randPos,'#ffffff');
		game.updateScore();
	};
}

Game.prototype.updateScore = function(){
	this.score = this.coloured.length;
	this.mgr.view.renderScore(this.score);
	if(this.score == this.winScore){
		this.won = true;
	};
}

Game.prototype.changeGrid = function(position,colour){
	//Only updates score and stores position if colour was been changed
	if(!this.grid.neighbourColourMatch(position, colour) && this.grid.setTileColour(position,colour)){
			this.coloured.push(position);
			this.updateScore();
			
			return true;
	}
	return false;
}

Game.prototype.stop = function(){
	//
	this.over = true;
}


function Palette(colours){
	this.originalColours = colours.slice(0);;
	this.colours = colours;
	this.number = colours.length;
	this.previous  = null;
	this.selected = null;
	this.active = false;
};

/*Palette.prototype.newState = function(position){
	this.recordColour();
	this.selectColour(position);
	this.shuffle();
}*/

Palette.prototype.reset = function(){
	this.colours = this.originalColours.slice(0);
	this.previous = null;
}

Palette.prototype.shuffle = function(){
var palette = this;
this.colours.forEach(function(colour,i){
	if(i<(palette.number-1)){
		var swap = palette.colours.slice(i+1)[Math.floor((palette.number-i-1)*Math.random())];
		palette.colours[palette.colours.indexOf(swap)] = colour;
		palette.colours[i] = swap;
	};
	});

};

Palette.prototype.toggleActive = function(){
	this.active = !this.active;
}

Palette.prototype.isActive = function(){
	return this.active;
}

Palette.prototype.recordColour = function(){
	this.previous = this.selected;
	this.selected = null;
};

Palette.prototype.selectColour = function(position){
	this.selected = this.colours[position];
};

Palette.prototype.getSelected = function(){
	return this.selected;
}

Palette.prototype.sameColour = function(position){
	return this.colours[position] == this.previous;
}

Palette.prototype.showMe = function(){
	console.log(this.colours);
}


//We will assume that only non-zero dimensions will be set

function Grid(size,blankColour){
	this.array = [];
	this.width = size[0]; //number of tiles in a row
	this.height = size[1]; //number of tiles in a column
	this.coloured = 0;
	this.directions = ['up','down','left','right'];
	this.blank = blankColour;
};

Grid.prototype.getWidth = function(){
	return this.width;
};

Grid.prototype.getHeight = function(){
	return this.height;
};


Grid.prototype.init = function(){
	for(var j = 0; j < this.height; j++){
		var  row = [];
		for(var i = 0; i < this.width; i++){
			row.push(new Tile({x:i,y:j},this.blank)); //x,y will be same as array indices
		};
		this.array.push(row);
	};
};

Grid.prototype.reset = function(){
	var grid = this;
	this.array.forEach(function(row){
		row.forEach(function(tile){
			grid.fadeTile(tile.getPosition());
		});
	});
};

Grid.prototype.getTile = function(position){
	var posX = position.x;
	var posY = position.y;
	//onsole.log(posX);
	//console.log(posY);
	if(posX < this.getWidth() && posY < this.getHeight()){
		return this.array[posY][posX];
	};
};


Grid.prototype.fadeTile = function(position){
	var tile = this.getTile(position);
	if(tile.getColour() != this.blank){
		tile.setColour(this.blank);
		this.updateNumColoured(false);
		return true;
	};
	return false 
};

Grid.prototype.setTileColour = function(position,colour){
	var tile = this.getTile(position);
	if(tile.getColour() == this.blank){
		tile.setColour(colour);
		this.updateNumColoured(true);
		return true;
	};
	return false
};


Grid.prototype.getTileColour = function(position){
	return this.getTile(position).getColour();
};


Grid.prototype.getNumColoured = function(){
	return this.coloured;
};

Grid.prototype.updateNumColoured = function(coloured){
	this.coloured += (2*coloured - 1); 
};

Grid.prototype.getNeighbourVector= function(direction){
	var map = {'up': {x:0,y:-1},
				'right': {x:1,y:0},
				'down': {x:0,y:1},
				'left':{x:-1,y:0}}
	return map[direction];
};

Grid.prototype.getNeighbour = function(position, direction){
	var vector = this.getNeighbourVector(direction);
	var neighbourX = position.x + vector.x;
	var neighbourY = position.y + vector.y;
	if(neighbourY < this.getHeight() && neighbourY >= 0)
	{ // As 2-d array, ensures that first in bounds and if second isn't you would return undefined
	  //It does rely on the fact that JS returns undefined for negative values unlike Python for instance where negative values mean counting back from end of array
		return this.getTile({x:neighbourX,y:neighbourY})
	};
};

Grid.prototype.getAllNeighbours = function(position){
	var neighbours = [];
	var grid = this;
	this.directions.forEach(function(direction){
		var neighbour;

		if(neighbour = grid.getNeighbour(position,direction)){
			neighbours.push(neighbour);
		};
	}
	);
	return neighbours;
};


Grid.prototype.neighbourColourMatch = function(position,colour){
	return (this.getAllNeighbours(position).filter(
		function(neighbour){
			return neighbour.getColour() == colour;
		})).length > 0 ;
};


Grid.prototype.showMe = function(){
	this.array.forEach(function(row){
		var colourRow = row.map(function(tile){
			return tile.getColour();
		});
		console.log(colourRow);
	});
};




function Tile(position,colour){
	this.x = position.x;
	this.y = position.y;
	this.colour = colour;
};

Tile.prototype.getColour = function(){
	return this.colour;
};

Tile.prototype.getX = function(){
	return this.x;
};

Tile.prototype.getY = function(){
	return this.y;
};

Tile.prototype.getPosition = function(){
	return {x: this.getX(), y: this.getY()};
};

Tile.prototype.setColour = function(colour){
	this.colour = colour;
};



function loseGame(){
	var colours = ['red','blue','green','orange','yellow','violet','indigo'];
	var paints = colours.slice(0);
	var mgr = new GameManager(paints,'#ffffff');
	mgr.setup();
	mgr.startGame();
	var choice = colours.shift();
	var choiceInd = mgr.palette.colours.indexOf(choice);
	console.log(choice)
	console.log(choiceInd);
	console.log(mgr.game.grid);
	/*for(var j = 0; j < 3; j ++){
		for(var i = 0; i <3; i++){
			var click = window.prompt("Please click");
			if(click != null){
			
			var position = {x:i, y:j};
			console.log('\nFor i = ' + i + ' and j = ' + j);
			console.log('For the position ' + JSON.stringify(position) + ' the colours and grid are as follows:');
			
			//console.log(colours);
			//console.log(choice);
			
			mgr.paletteClick(choiceInd);
			mgr.gridClick({x:i,y:j});
			
			colours.push(choice);
			var choice = colours.shift();
			var choiceInd = mgr.palette.colours.indexOf(choice);
			mgr.palette.showMe();
			mgr.game.grid.showMe();
			console.log('\n')
				};
		}
	}*/
	console.log('\nInitial grid configuration');
	mgr.game.grid.showMe();
	var x = [0,1,2,0,1,2,0,1,2]
	var y = [0,0,0,1,1,1,2,2,2];


	var positions = x.map(function(i,ind){
		return {x:i,y:y[ind]};
	});



	var click = setInterval(function(){



	var position = positions.pop();
	console.log('\nGame move.\nFor x = ' + position.x + ' and y = ' + position.y);
	console.log(positions);
	console.log('For the position ' + JSON.stringify(position) + ' the colours and grid are as follows:');


	//console.log(colours);
	//console.log(choice);

	mgr.paletteClick(choiceInd);
	mgr.gridClick(position);
	colours.push(choice);
	choice = colours.shift();
	choiceInd = mgr.palette.colours.indexOf(choice);
	mgr.palette.showMe();
	mgr.game.grid.showMe();
	console.log('\n')

		if(positions.length == 0){
		clearInterval(click);
	};

		}, 3000)













	var wait = setTimeout(function(){
	console.log('Game should now be over and have been lost');
	console.log('Score: ' + mgr.game.score);
	console.log('Win: ' + mgr.game.won);
	console.log('Over: ' + mgr.game.over);
	console.log('Number of coloured tiles: ' + mgr.game.coloured.length);
	clearTimeout(wait);
},65000);
};


//loseGame();




function winGame(){
	var colours = ['red','blue','green','orange','yellow','violet','indigo'];
	var paints = colours.slice(0);
	var mgr = new GameManager(paints,'#ffffff');
	mgr.setup();
	mgr.startGame();
	var choice = colours.shift();
	var choiceInd = mgr.palette.colours.indexOf(choice);
	console.log(mgr.game.grid);
	for(var j = 0; j < 4; j ++){
		for(var i = 0; i <4; i++){
			var position = {x:i, y:j};
			console.log('\nFor i = ' + i + ' and j = ' + j);
			console.log('For the position ' + JSON.stringify(position) + ' the colours and grid are as follows:');
			

			//console.log(colours);
			//console.log(choice);
			
			mgr.paletteClick(choiceInd);
			mgr.gridClick({x:i,y:j});
			

			colours.push(choice);
			var choice = colours.shift();
			var choiceInd = mgr.palette.colours.indexOf(choice);
			mgr.palette.showMe();
			mgr.game.grid.showMe();
			console.log('\n')
			
		}
	}
	console.log('Game should now be over and have been won');
	console.log('Score: ' + mgr.game.score);
	console.log('Win: ' + mgr.game.won);
	console.log('Over: ' + mgr.game.over);
	console.log('Number of coloured tiles: ' + mgr.game.coloured.length);
};








/*We need to:
>Find tiles in the available directions
>Find if any tiles have the same colour
*/

//Note that since objects are passed by reference, should ensure that a new grid is created 
//each time
function testGame(){

	//No tests regarding tile and grid status as Game relies on the already tested tile and grid functions 

	var grid = new Grid([4,4],'#ffffff');
	var game = new Game(grid);
	game.start();
	console.log('Game score should be 0 and is: ' + game.score);
	console.log('Game over should be false and is: ' + game.over);
	game.changeGrid({x:0,y:0},'blue');
	game.changeGrid({x:2,y:3},'green');
	console.log('Two tiles have now been coloured. Game score should be 2 (as this the time taken up to this point will almost certainly have have been less than the time interval for fade) and is: ' + game.score);
	game.changeGrid({x:2,y:3},'green');
	console.log('Tried to change colour already coloured tile. This should not have changed the score: ' + game.score);
	game.changeGrid({x:2,y:3},'green');
	console.log('Tried to change colour neighbour with same colour. This should not have changed the score: ' + game.score);
	//game.score = 16;
	fillGrid(game,true);
	console.log('All but one of the squares has now been filled and the score is right now: ' + game.score);
	console.log('The array of coloured tiles should have a length of 15 before fading and it is: ' + game.coloured.length);
	/*console.log(game.coloured.length);
	console.log(game.coloured);*/
	game.fadeRandomTile(game);
	console.log('The array of coloured tiles after fading should have a length of 14 after fading: ' + game.coloured.length);
	var t = setTimeout(function(){
		console.log('After waiting a few seconds, some of the colours should have faded. The score is now: ' + game.score);
			console.log('Game should not be over and the over property is: ' + game.over);
	game.stop();
	console.log('Game should now be over and the over property is: ' + game.over + ' and the score is: ' + game.score + ' and as this is not the win score the win state should be false and is: ' + game.won);
	var grid2 = new Grid([4,4],'#ffffff');
	var game2 = new Game(grid2);
	game2.start();
	fillGrid(game2,false);
	console.log('A new game was created and all its squares filled. Now win state should be true and is: ' + game2.won + ' and the score should be 16 and is: ' + game2.score);
	console.log('As the Game Manager stops the game, need to call game.stop() to register an over state. Before that, though the game has been won, the over state should be false and is ' + game2.over);
	game2.stop();
	console.log('Now game2.stop() has been called and the over state should be true and is: ' + game2.over);

	clearTimeout(t);},5000);


	//Have tested all the functions except for stop
	
};

function fillGrid(game,allbutone){
	game.grid.array.forEach(function(row,i){
		row.forEach(function(tile,j){
			if(allbutone && i==0 && j==0){ game.grid.fadeTile(tile.getPosition()); 
											game.coloured.splice(game.coloured.indexOf(tile),1);
											game.updateScore();

											console.log(tile);}
			else{game.changeGrid(tile.getPosition(),String(i)+String(j));};
		});
	});
}

function testPalette(colours){
	console.log('New palette created with the following colours: #ff0000, #00ff00, #0000ff');
	var pal = new Palette(['#ff0000', '#00ff00', '#0000ff']);
	console.log("The colours array should be ['#ff0000', '#00ff00', '#0000ff'] and is " + pal.colours)

	console.log("To start with no colours have been selected so both selected and previous should be undefined are: " + pal.selected + ", " + pal.previous);

	pal.selectColour(2);
	
	console.log("The colour at position 2 was selected so the value of the selected property should be the colour at position 2 i.e. '#0000ff' and it is " + pal.getSelected());

	console.log("The value of previous should be undefined until a second colour is selected and recorded. It is: " + pal.previous);

	pal.shuffle();

	console.log("The palette was shuffled so hopefully the colour positions changed and the arrangement is now " + pal.colours);





	pal.recordColour(pal.colours.indexOf('#0000ff'));
	pal.selectColour(pal.colours.indexOf('#ff0000'));
	console.log('Have selected #ff0000 so the selected colour should now be:' + pal.getSelected());
	console.log('Now the previous colour should be #0000ff: ' + pal.previous);
	var choice = pal.colours.indexOf(pal.previous);
	console.log('Calling sameColour with a choice that is the same as the previous (should be true): ' + pal.sameColour(choice));
	console.log('Calling sameColour with the different choice (should be false): ' + pal.sameColour(pal.colours.indexOf(pal.getSelected())));
}

//testPalette();



function testGridSetup(){
	grid1 = new Grid([4,4],'#ffffff');
	console.log('width should be 4 and is ' + grid1.getWidth());
	console.log('width should be 4 and is ' + grid1.getHeight());
	console.log('blankColour should be #ffffff and is ' + grid1.blank);
	grid2= new Grid([1,1],'#ffffff');
	console.log('width should be 1 and is ' + grid2.getWidth());
	console.log('width should be 1 and is ' + grid2.getHeight());
	console.log('blankColour should be #ffffff and is ' + grid2.blank);
	grid3= new Grid([3,5],'#ffffff');
	console.log('width should be 3 and is ' + grid3.getWidth());
	console.log('width should be 5 and is ' + grid3.getHeight());
	console.log('blankColour should be #ffffff and is ' + grid3.blank);
	grid1.init();
	grid2.init();
	grid3.init();
	console.log(grid1);



	console.log('grid1 should have 4 row elements and has ' + grid1.array[0].length);
	console.log('grid1 should have 4 column elements and has ' + grid1.array.length);
	console.log('grid1 should have 16 tiles and has ' + countTiles(grid1.array));

	console.log('grid2 should have 1 row tiles and has ' + grid2.array[0] != undefined);
	console.log('grid2 should have 1 column tiles and has ' + grid2.array.length);
	console.log('grid2 should have 1 tile and has ' + countTiles(grid2.array));

	console.log('grid3 should have 3 row elements and has ' + grid3.array[0].length);
	console.log('grid3 should have 5 column elements and has ' + grid3.array.length);
	console.log('grid3 should have 15 tiles and has ' + countTiles(grid3.array));

	console.log('')

	testGridTileChange(grid1,{x:1,y:2}, '#ff0000');

	testNeighbours(grid1,{x:1,y:2});
	testNeighbours(grid1,{x:3,y:2});
	testNeighbours(grid1,{x:3,y:3});
	testNeighbours(grid1,{x:0,y:0});

	grid1.reset();

	console.log('Grid had coloured tiles but now it has been reset so that the number of white tiles should be 16 and is ' + isReset(grid1.array) + ' and thus the number of coloured should be 0 and is ' + grid1.getNumColoured());


};

function countTiles(TwoDimArray){
	var numTiles = 0;
	TwoDimArray.forEach(function(row){
		row.forEach(function(tile){
			numTiles += (tile instanceof Tile);
		});
	});
	return numTiles;

};


function isReset(TwoDimArray){
	var numTiles = 0;
	TwoDimArray.forEach(function(row){
		row.forEach(function(tile){
			numTiles += (tile.getColour() == '#ffffff');
		});
	});
	return numTiles;

};


function testGridTileChange(grid,position, colour){
	var tile = grid.getTile(position);
	console.log('getTile should return a value of type Tile and asking if the result is an instance of Tile returns: ' + (tile instanceof Tile));
	var outside = {x: grid.getWidth(),y: grid.getHeight()-1};
	console.log('getTile should return undefined where the x and/or y position is greater or equal to the corresponding grid dimension. For a grid of dimensions width = ' + grid.getWidth() + ' and height = ' +
		grid.getHeight() + ' asking for a tile at x = ' + grid.getWidth() + ' (outside range) and y = '
		+ (grid.getHeight()-1) + ' (within range) returns: ' + grid.getTile(outside));
	console.log('The default colour is #ffffff and getTileColour returns ' + grid.getTileColour(position));
	console.log('The position variable refers to the grid position and positions of the tile should correspond to the grid indices and should be x = ' + position.x + ' y = ' + position.y + ' and are x = ' + tile.getX() + ' y = ' + tile.getY());
	console.log('The number of coloured tiles should be 0 and is ' + grid.getNumColoured());

	console.log('\nChanging colours:')
	console.log('Colour has been set to ' + colour + ' which means setTileColour should return true and returns: ' + grid.setTileColour(position,colour) + ' and the resulting colour is: ' + grid.getTileColour(position));
	console.log('The number of coloured tiles should 1 and is ' + grid.getNumColoured());
	console.log('\nChanging colour of coloured tile:')
	
	console.log('Tried to set colour of the same tile to a different colour. The setTileColour function should return false  and returns: ' + grid.setTileColour(position,'hi') + ' Tile should not have changed as it is coloured. The colour is: ' + grid.getTileColour(position));
	console.log('The number of coloured tiles should still be 1 and is ' + grid.getNumColoured());
	

	console.log('\nChanging colours of other tiles:')
	var firstPos = {x:0,y:0};
	var firstTile = grid.getTile(firstPos.x, firstPos.y);
	grid.setTileColour(firstPos,colour); // All grids will have this tile
	if (!(tile.x == firstPos.x && tile.y == firstPos.y)){
		console.log('Two different tiles have been coloured so the total number of coloured tiles should be 2 and is: ' + grid.getNumColoured());
	};

	console.log('\nFading:')
	console.log('Number of coloured tiles before a tile is faded: ' + grid.getNumColoured());
	console.log('Colour of tile before fading should be other than #ffffff and is: ' + grid.getTileColour(position));
	console.log('fadeTile should return true for coloured tile and returns: ' + grid.fadeTile(position));
	console.log('Number of coloured tiles after a tile is faded - should be 1 less than previous: ' + grid.getNumColoured());
	console.log('Colour of tile after fading should be #ffffff and is: ' + grid.getTileColour(position));

	console.log('\nFading blank tiles:')
	console.log('Number of coloured tiles before attempting this: ' + grid.getNumColoured());
	console.log('Colour of blank tile should be #ffffff and is: ' + grid.getTileColour({x:1,y:1}));
	grid.fadeTile({x:1,y:1});
	console.log('fadeTile should return false for blank tile and returns: ' + grid.fadeTile(position));
	console.log('Colour of tile should not have changed: ' + grid.getTileColour({x:1,y:1}));
	console.log('Number of coloured tiles should not have changed: ' + grid.getNumColoured());
	
};


function testNeighbours(grid,tilePosition){
	console.log ('Now testing the neighbour functions');
	var tile = grid.getTile(tilePosition);
	console.log('A tile at position x = ' + tile.x + ' y = ' + tile.y);
	var directions =['up','down','left','right'];
	var map = {'up': {x:0,y:-1},
			'right': {x:1,y:0},
			'down': {x:0,y:1},
			'left':{x:-1,y:0}}
	directions.forEach(function(i){
		console.log('Since the direction is ' + i +' neighbour vector should be ' + JSON.stringify(map[i]) + ' and is: ' +  JSON.stringify(grid.getNeighbourVector(i)));
		/*var next = getNeighbour(tilePosition, direction);
		if(tile.x < grid.getWidth() && tile.y < grid.getHeight()){
			console.log('')
		};*/
	});

	console.log ('\nNow trying to get neighbours');
	directions.forEach(function(i){
		var next = grid.getNeighbour(tilePosition,i);
		var vector = grid.getNeighbourVector(i);
		var nextX = vector.x + tile.x;
		var nextY = vector.y + tile.y;
		console.log('Recall that we have a tile at position x = ' + tile.x + ' y = ' + tile.y + ' that the grid has width = ' + grid.getWidth() + ' and height = ' + grid.getHeight());
		if(nextX < grid.getWidth() && nextX >= 0 && nextY < grid.getHeight() && nextY >= 0){
			
			console.log('The direction ' + i + ' is within bounds so there should be a neighbour which will have position ' + JSON.stringify({x:next.x,y:next.y}) + ' and we have for next instanceof Tile: ' + (next instanceof Tile) +  '. It has  position: ' + JSON.stringify({x:next.getX(), y:next.getY()}));
		}
		else{
			console.log('The direction ' + i + ' is out of bounds so the result of calling getNeighbour should be undefined and is ' + next);
			};
		}
	);

	console.log('getAllNeighbours should return all the allowed neighbours considered above and it returns: ');
	var allNext = grid.getAllNeighbours(tilePosition);
	allNext.forEach(function(i){
		console.log(JSON.stringify(i) + '\n');
	});



	allNext.forEach(function(t){
		grid.fadeTile(t.getPosition());
	});

	grid.setTileColour(tile.getPosition(),'#00ff00');

	console.log('The tile should have no matching neighbours and the result of neighbourColourMatch is : ' 
		+ grid.neighbourColourMatch(tile.getPosition(),tile.getColour()));

	allNext.forEach(function(t){
		grid.setTileColour(t.getPosition(),'#00ff00');
	});

	console.log('The tile should now have matching neighbours and the result of neighbourColourMatch is : ' 
		+ grid.neighbourColourMatch(tile.getPosition(),tile.getColour()));
};

//testGridSetup();


function testTile(){
	t = new Tile({x:1,y:2},'#ffffff');
	console.log('x position should be 1 and is ' + t.getX());
	console.log('y position should be 2 and is ' + t.getY());
	console.log('position vector should be {x: 1, y: 2} and is ' 
		+ JSON.stringify(t.getPosition()));
	console.log('colour should initially be #ffffff and is ' + t.getColour());
	t.setColour('#ff0000');
	console.log('colour should now be #ff0000 and is ' + t.getColour());
};

//testTile();

//When you click on a colour, program should determine if colour is valid 
//If it is valid, then it will respond to clicks on the board
//Otherwise it will not respond
//If it is valid and you click on a tile, program will determine whether the tile is blank
//If it is then it will determine whether there are neighbours with matching colours
//If yes, it will not do anything
//If no, it will modify the tile's colour
//A regular intervals a random tile's colour will fade 
//As soon as you pick a colour, the position of the colours in the palette will change randomly

//testGame();
//winGame();

function testGameView(){
	var grid = new Grid([4,4],'#ffffff');
	console.log(grid);
	var pal = new Palette(['#ff0000','#00ff00','#0000ff','#ffff00','#00ffff','#ff00ff'])
	var mgr = new GameManager()
	var view = new GameView(grid,pal,mgr);
	view.grid.init();
	console.log(view.grid);
	view.start();
	var numShuffles = 0;
	var allTiles = []
	view.grid.array.forEach(function(row){
		row.forEach(function(t){
			allTiles.push(t);
		});
	});
	var positions = [{x:1,y:1},{x:0,y:2},{x:3,y:1}];
	view.activate();

	var start = 10;
	var clock = setInterval(function(){
		view.renderTime(start);
	  start -= 1;
	  if(start < 0){
	  clearInterval(clock);
	  };
	},1000);


	var shuffles = setInterval(function(){
		if(numShuffles < 16){
		view.palette.shuffle();
		view.renderPaints();
		view.renderTile(allTiles[numShuffles].getPosition(),view.palette.colours[0]);
		numShuffles +=1;
		}
		else{
			clearInterval(shuffles);
		};
	},2000);
	view.tiles[0][0].click();
	view.tiles[3][3].click();

}

//testGameView();
//mgr.setup()

var mgr = new GameManager(['#ff0000','#ffff00','#00ff00','#00ffff','#0000ff','#ff00ff'],'#ffffff');
mgr.setup();
function startNewGame(){
	mgr.startGame();
}
