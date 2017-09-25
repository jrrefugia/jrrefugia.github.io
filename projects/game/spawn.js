function spawn() {
	if(enemyOnScreen < enemyMaxOnScreen && enemyThisRound <= enemyMaxThisRound){
		
		var newEnemyWidth = 30;
		var newEnemyHeight = 30;
		var canvasCoords = {x: Math.floor(Math.random() * ((canvas.width - newEnemyWidth) - 1)) + 1, y: Math.floor(Math.random() * ((canvas.height - newEnemyHeight) - 1)) + 1};
		var endCoord = {};
		endCoord.x = canvasCoords.x;
		endCoord.y = canvasCoords.y;
		
	
		enemyOnScreen++;
		enemyThisRound++;
		//var enemy = enemyType("debug");
		enemy = new Enemy("enemy", canvasCoords, endCoord, newEnemyWidth, newEnemyHeight, 2, {r:0,g:0,b:255}, "wander", "homing");
		enemy.init();
		enemyRegister["enemy"+objectsOnScreen] = enemy;
		
		enemyOnScreen++;
		enemyThisRound++;
		enemy = new Enemy("enemy", canvasCoords, endCoord, newEnemyWidth, newEnemyHeight, 2, {r:0,g:0,b:255}, "stay", "beam");
		enemy.init();
		enemyRegister["enemy"+objectsOnScreen] = enemy;
				
		enemyOnScreen++;
		enemyThisRound++;
		enemy = new Enemy("enemy", canvasCoords, endCoord, newEnemyWidth, newEnemyHeight, 2, {r:0,g:0,b:255}, "follow", "shoot");
		
		enemy.init();
		enemyRegister["enemy"+objectsOnScreen] = enemy;
		/* todo:
		enemyOnScreen++;
		enemyThisRound++;
		enemy = new Enemy("enemy", canvasCoords, endCoord, newEnemyWidth, newEnemyHeight, 2, {r:0,g:0,b:255}, "stay", "bomb");
		enemy.init();
		enemyRegister["enemy"+objectsOnScreen] = enemy;
	
		
		enemyOnScreen++;
		enemyThisRound++;
		enemy = new Enemy("enemy", {x: 500, y: 500}, endCoord, newEnemyWidth, newEnemyHeight, 2, {r:0,g:0,b:255}, "stay", "cluster");
		enemy.init();
		enemyRegister["enemy"+objectsOnScreen] = enemy;
		*/	
		
		enemy = null;
	}
	
}


var spawnPathObject = {"smileyFace":[]};

var spawnPath = [[97, 63],[115, 90],[111, 65],[102, 71],[97, 74],[84, 62],[84, 80],[88, 68],[121, 81],[85, 55],[82, 60],[111, 83],[83, 76],[94, 87],[306, 71],[306, 71],[322, 80],[299, 72],[313, 65],[314, 64],[327, 52],[344, 71],[306, 64],[314, 67],[337, 62],[319, 82],[322, 58],[331, 67],[58, 228],[93, 237],[110, 249],[134, 258],[156, 263],[177, 267],[204, 267],[242, 268],[267, 267],[300, 264],[336, 257],[360, 250],[380, 236],[373, 242],[346, 260],[328, 265],[278, 271],[216, 273],[184, 271],[145, 264],[100, 246]];
var spawnPathCounter = 0;


//todo. randomly selects some preset values based on a specified enemy type to spawn on screen.
function enemyType(type){

	var newEnemyWidth = 30;
	var newEnemyHeight = 30;

	
	var canvasCoords = {x: Math.floor(Math.random() * ((canvas.width - newEnemyWidth) - 1)) + 1, y: Math.floor(Math.random() * ((canvas.height - newEnemyHeight) - 1)) + 1};

	var test = Math.floor(Math.random() * (5 - 1));
	var moveIndex = "";
	switch(test){
		case 0: moveIndex = "move";
		break;
		case 1: moveIndex = "wander";
		break;
		case 2: moveIndex = "follow";
		break;
		case 3: moveIndex = "bullet";
		break;
		default: moveIndex = "move";
		break;		
	}
	var endCoord = {};

	if(spawnPathCounter  < spawnPath.length - 1 ){
		
		endCoord.x = spawnPath[spawnPathCounter][0];
		endCoord.y = spawnPath[spawnPathCounter][1];
	}else{
		endCoord = canvasCoords;
		
	}
	var enemy;
	switch(type){
		case "crazy":
			enemy = new Enemy("enemy", canvasCoords, endCoord, newEnemyWidth, newEnemyHeight, 2, {r:0,g:0,b:255}, "wander", "homing");
			//enemy = new Enemy("enemy", canvasCoords, endCoord, newEnemyWidth, newEnemyHeight, 2, {r:0,g:0,b:255}, "move", "beam");
			//enemy = new Enemy("enemy", canvasCoords, endCoord, newEnemyWidth, newEnemyHeight, 2, {r:0,g:0,b:255}, "wander", "shoot");
			break;
		case "debug":
			enemy = new Enemy("enemy", {x:450, y:450}, {x:0,y:0}, newEnemyWidth, newEnemyHeight, 2, {r:0,g:0,b:255}, "stay", "homing");
			//enemy = new Enemy("enemy", {x:450, y:450}, {x:0,y:0}, newEnemyWidth, newEnemyHeight, 2, {r:0,g:0,b:255}, "move", "shoot");
			break;
	}
	
	spawnPathCounter++;
	
	return enemy;
}

function deleteRegistryIndex(register,key){
	switch(register){
		case "bulletRegister":
			delete bulletRegister[key];
			break;
		case "enemyRegister":
			delete enemyRegister[key];
			enemyThisRound--;
			enemyOnScreen--;
			break;
		case "particleRegister":
			delete particleRegister[key];
			break;
	}
}
