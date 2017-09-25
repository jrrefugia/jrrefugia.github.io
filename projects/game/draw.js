function drawPlayer(){
	ctx.beginPath();
	ctx.arc(currentMousePos.x,currentMousePos.y,5,getAngle(0),getAngle(1));
	ctx.strokeStyle = "white";
	ctx.fillStyle = "white"; 
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

function drawPlayerShields(progress){

	if(rightClickPressed && !leftClickPressed){
		ctx.beginPath();
		ctx.arc(currentMousePos.x,currentMousePos.y,playerSize,getAngle(0),getAngle(1));
		ctx.strokeStyle = "white";
		var grd=ctx.createRadialGradient(currentMousePos.x,currentMousePos.y,playerSize+45,currentMousePos.x,currentMousePos.y,0);
		grd.addColorStop(0,"#2471CC");
		grd.addColorStop(1,'rgba(0,0,0,0.05)');
		ctx.strokeStyle = "#5695CC";
		ctx.fillStyle=grd;
		ctx.fill();
		ctx.stroke();
	}
	if(leftClickPressed && rightClickPressed){
		playerColor = colorElement(progress % 100 / 5);
		ctx.beginPath();
		ctx.arc(currentMousePos.x,currentMousePos.y,(progress%20) + 40,getAngle(0),getAngle(1));
		ctx.strokeStyle = "white";
		ctx.fillStyle = playerColor; 
		ctx.fill();
		ctx.stroke();
		
		ctx.beginPath();
		ctx.arc(currentMousePos.x,currentMousePos.y,(progress%20) + 20,getAngle(0),getAngle(1));
		ctx.strokeStyle = "white";
		ctx.fillStyle = playerColor; 
		ctx.fill();
		ctx.stroke();
	
		ctx.beginPath();
		ctx.arc(currentMousePos.x,currentMousePos.y,progress%20,getAngle(0),getAngle(1));
		ctx.strokeStyle = "white";
		ctx.fillStyle = playerColor; 
		ctx.fill();
		ctx.stroke();
	}
}


function drawPlayerTrail(progress){
	//if(prevMousePos.x != currentMousePos.x || prevMousePos.y != currentMousePos.y){

	var angle = getAngleBetweenPoints(prevMousePos.x, prevMousePos.y, currentMousePos.x, currentMousePos.y);

		playerColor = colorElement(progress % 100 / 5);

		/*
		ctx.beginPath();
		ctx.moveTo(currentMousePos.x,currentMousePos.y);
		ctx.arc(currentMousePos.x,currentMousePos.y,(progress%10) + 5 + 2,angle-Math.PI*.1,angle+Math.PI*.1);
		ctx.lineTo(currentMousePos.x,currentMousePos.y);
		ctx.arc(currentMousePos.x,currentMousePos.y,(progress%10) + 5 + 6,angle-Math.PI*.1,angle+Math.PI*.1);
		ctx.arc(currentMousePos.x,currentMousePos.y,(progress%10) + 5 + 2,angle-Math.PI*.1,angle+Math.PI*.1);
		ctx.arc(currentMousePos.x,currentMousePos.y,(progress%5) + 5 + 0,angle-Math.PI*.1,angle+Math.PI*.1);
		ctx.strokeStyle = "black";
		ctx.fillStyle = 'rgba(255, 100, 100, 0.75)'; 
		ctx.fill();
		ctx.stroke();
		*/
		
		

		


		var particle = new Particle("particle", {x:currentMousePos.x ,y:currentMousePos.y}, {x:null,y:null}, 10, 1, 3, {r:240,g:240,b:240}, "eject");
		particle.init();
		particleRegister["particle"+objectsOnScreen] = particle;
		particle = null;
		



}


function drawLandscape(){
	var img=document.getElementById("landscape");

	if(!rightClickPressed || !leftClickPressed){
		ctx.drawImage(img,0,backgroundImageStart1);
		ctx.drawImage(img,0,backgroundImageStart2-1920);	
	}
	
	ctx.filter = 'none';
	
	
	if (backgroundImageStart1 >= 1920) {
		backgroundImageStart1 = 0;
	}
	if (backgroundImageStart2 >= 1920) {
		backgroundImageStart2 = 0;
	}
	backgroundImageStart1 += 1 * globalSpeedModifier;
	backgroundImageStart2 += 1 * globalSpeedModifier;
}

function drawRegisterObject(gameObj) {
	//draw squares / rectangles
	if(gameObj.name == "enemy"){	
		ctx.fillStyle = "rgba("+gameObj.color.r+", "+gameObj.color.g+", "+gameObj.color.b+", "+gameObj.opacity+")";	
		ctx.fillRect(gameObj.position.x, gameObj.position.y, gameObj.width, gameObj.height);
		//drawing circle in enemies
		ctx.beginPath();
		ctx.fillStyle = "black";
		ctx.arc(gameObj.position.x+(gameObj.width/2),gameObj.position.y+(gameObj.height/2),gameObj.radius,getAngle(0),getAngle(1));
		ctx.stroke();
	}
	//draw circles

	if(gameObj.name == "particle" || gameObj.name == "bullet" || gameObj.name == "homing"){
		ctx.beginPath();
		ctx.arc(gameObj.position.x,gameObj.position.y,gameObj.radius,getAngle(0),getAngle(1));
		//ctx.strokeStyle = "black";

		ctx.fillStyle = "rgba("+gameObj.color.r+", "+gameObj.color.g+", "+gameObj.color.b+", "+gameObj.opacity+")"; 
		ctx.fill();
		//ctx.stroke();
	}
}

function drawRegisterObjects() {
	for(var j = 0; j < registers.length; j++){
		var register = registers[j];
		for(key in this[register]){
			var gameObj = this[register][key];
			if(gameObj.exists() && gameObj.exist){
				gameObj.act();
				drawRegisterObject(gameObj);
			}else if(!gameObj.exists() || !gameObj.exist){
				deleteRegistryIndex(register,key);
							
			}
		}
	}
}
