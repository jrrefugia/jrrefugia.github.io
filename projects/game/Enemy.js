function Enemy(name, startCoord, endCoord, width, height, speed, color, movementBehavior, shootBehavior) {
	this.shootFrequency = 1;
	this.shootCooldown = 30;
	this.shootCooldownTimer = -50;
	GameObject.call(this, name, startCoord, endCoord, width, height, speed, color, movementBehavior);
	this.shootBehavior = shootBehavior;

	this.beamDegree = randomIntBetween(0,360);
	this.lockedPosition = {x: 0, y:0};
}
Enemy.prototype = new GameObject();

Enemy.prototype.init = function() {
	GameObject.prototype.init.call(this); 
	var that = this;
	var fadeInCounter = 0;
	var fadeInterval = setInterval(function(){
	if(fadeInCounter % 2 == 0 && fadeInCounter < 6){
			that.opacity = 0.75;
		}else if(fadeInCounter < 6){
			that.opacity = 0;
		}else{
			that.opacity = 1;
		}
		fadeInCounter++;
		if(that.opacity >= 1){
			clearInterval(fadeInterval);
		}
	},100);


	
}

Enemy.prototype.act = function() {
	
	GameObject.prototype.act.call(this); //aka super calls functions of parent class
	
	this.shootCooldownTimer++;
	this[this.shootBehavior]();
	
	var rect = {x:this.position.x,y:this.position.y,w:this.width,h:this.height};	
	
	if((rightClickPressed && leftClickPressed && bulletTimeGauge > 0)){
		var circle = {x:currentMousePos.x-16,y:currentMousePos.y-16,r:playerSize/2};
		this.exist = !intersects(circle,rect);
	}

	var circle = {x:lastClick.x-16,y:lastClick.y-16,r:playerSize/2};
	if(intersects(circle,rect)){
		this.exist = false;
		playerScore++;
		lastClick.x = 0;
		lastClick.y = 0;
	}
	
		
}

Enemy.prototype.shoot = function(){
	//prevent shooting if close to player
	var circle = {x:currentMousePos.x,y:currentMousePos.y,r:playerSize+30};
	var rect = {x:this.position.x+(this.width/2),y:this.position.y+(this.width/2),w:this.width,h:this.height};	
	
	//cool debug to see hitbox
	/*
	ctx.arc(circle.x,circle.y,circle.r,getAngle(0),getAngle(1));
	ctx.stroke();
	ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
	ctx.stroke();
	*/

	
	if(this.timer  % this.shootFrequency < 1 && this.shootCooldownTimer < 10 && this.shootCooldownTimer <= this.shootCooldown && this.shootCooldownTimer > 0 && !intersects(circle,rect)){

		var startCoord = {x: this.position.x+(this.width/2), y: this.position.y+(this.height/2)};
		var bullet = new Bullet("bullet", startCoord, {x: 0, y: 0}, 5, 5, 10, {r:255,g:255,b:55}, "bullet");
		bullet.init();
		bulletRegister["bullet"+objectsOnScreen] = bullet;
		bullet = null;
		//color while shooting
		this.color.r = 255;
		this.color.g = 255;
		this.color.b = 55;


	}else if(!intersects(circle,rect)){
		//color when about to shoot
		this.color.r = 255;
		this.color.g = 52;
		this.color.b = 133;
				
		
	}
	if(this.shootCooldownTimer > this.shootCooldown){
		
		this.shootCooldownTimer = 0 - this.shootCooldown * 10;

	}
	if(Math.abs(this.shootCooldown - this.shootCooldownTimer) > 100){//default color
	
		this.color.r = 102;
		this.color.g = 27;
		this.color.b = 153;
		
	}

	
};







Enemy.prototype.homing = function(){
	//prevent shooting if close to player
	var circle = {x:currentMousePos.x,y:currentMousePos.y,r:playerSize+30};
	var rect = {x:this.position.x+(this.width/2),y:this.position.y+(this.width/2),w:this.width,h:this.height};	
	
if(this.timer % 100 == 0){
		var startCoord = {x: this.position.x+(this.width/2), y: this.position.y+(this.height/2)};
		var newCoord = {};		
		newCoord.x = this.position.x + (this.width/2) + 50 * Math.cos(randomFloatBetween(0, Math.PI * 2));
		newCoord.y = this.position.y + (this.height/2) + 50 * Math.sin(randomFloatBetween(0, Math.PI * 2));
	
		var bullet = new Bullet("homing", startCoord, newCoord, 15, 15, 5, {r:255,g:255,b:55}, "bullet");
		bullet.init();
		bulletRegister["bullet"+objectsOnScreen] = bullet;
		bullet = null;
}
};


Enemy.prototype.bomb = function(){

	var newCoord = {};		
	newCoord.x = currentMousePos.x +  100 * Math.cos(randomFloatBetween(0, Math.PI * 2));
	newCoord.y = currentMousePos.y +  100 * Math.sin(randomFloatBetween(0, Math.PI * 2));
	
				
	if(this.timer % 100 > 70){	
ctx.save();	
		ctx.globalAlpha-=0.1;
			ctx.beginPath();
			ctx.arc(newCoord.x,newCoord.y,5,getAngle(0),getAngle(1));
			ctx.fillStyle="red";
			ctx.fill();

ctx.restore();
	}
	
	
	if(this.timer % 100 == 0){

			var bullet = new Bullet("bomb", newCoord, newCoord, 15, 15, 5, {r:255,g:255,b:55}, "bullet");
			bullet.init();
			bulletRegister["bullet"+objectsOnScreen] = bullet;
			bullet = null;
	}
};



Enemy.prototype.cluster = function(){

	var newCoord = {};		
	newCoord.x = currentMousePos.x +  100 * Math.cos(randomFloatBetween(0, Math.PI * 2));
	newCoord.y = currentMousePos.y +  100 * Math.sin(randomFloatBetween(0, Math.PI * 2));
	






if(this.timer < 100){
	var degreeDestination = radiansTo360Degrees(getRadiansBetweeenPoints(this.position.x +(this.width/2) , this.position.y +(this.height/2), currentMousePos.x, currentMousePos.y));

var modifier =  (this.timer % 100) / 6;
var triangleAngleWidth = 90 - modifier;
triangleAngleWidth =  triangleAngleWidth - 360;
//ctx.globalAlpha = 0.033;

console.log("charging");


this.lockedPosition.x = currentMousePos.x;
this.lockedPosition.y = currentMousePos.y;
ctx.strokeStyle = "red";
	ctx.fillStyle = "red";		
}else{
	
	
	var degreeDestination = radiansTo360Degrees(getRadiansBetweeenPoints(this.position.x +(this.width/2) , this.position.y +(this.height/2), this.lockedPosition.x, this.lockedPosition.y));

var triangleAngleWidth = 73;
triangleAngleWidth =  triangleAngleWidth - 360;
	
	
	this.shootCooldownTimer = this.shootCooldownTimer < this.shootCooldown ? this.shootCooldownTimer : -50;
	console.log("shooting at locked position");
	ctx.strokeStyle = "yellow";
	ctx.fillStyle = "yellow";		
}


var endX   = this.position.x+ (this.width/2) + 2000 * Math.sin(degrees360ToRadians(degreeDestination  - triangleAngleWidth));
var endY   = this.position.y+ (this.height/2) + 2000 * Math.cos(degrees360ToRadians(degreeDestination - triangleAngleWidth));
var endX2   = this.position.x+ (this.width/2) + 2000 * Math.sin(degreesToRadians(degreeDestination + triangleAngleWidth));
var endY2   = this.position.y+ (this.height/2) + 2000 * Math.cos(degreesToRadians(degreeDestination + triangleAngleWidth));

	ctx.save();	

ctx.beginPath();
	ctx.moveTo(this.position.x+ (this.width/2),this.position.y+ (this.height/2));
	ctx.lineTo(endX , endY);
			ctx.stroke();			
		ctx.moveTo(this.position.x+ (this.width/2),this.position.y+ (this.height/2));
	ctx.lineTo(endX2 , endY2);
ctx.lineTo(endX , endY);
			ctx.strokeStyle = "red";	

ctx.fill();	
				ctx.stroke();
		


			
ctx.restore();	












	
	if(this.timer % 100 == 0){
/*
			var bullet = new Bullet("cluster", newCoord, newCoord, 15, 15, 5, {r:255,g:255,b:55}, "stay");
			bullet.init();
			bulletRegister["bullet"+objectsOnScreen] = bullet;
			bullet = null;
	*/
	}
};


Enemy.prototype.beam = function(){
	if(this.timer > 30){
		ctx.save(); // only modify newly created rectangle

		var rectHeight = 2;
		var rectWidth = 1000;
		var degreeDestination = radiansTo360Degrees(getRadiansBetweeenPoints(this.position.x +(this.width/2) , this.position.y +(this.height/2), currentMousePos.x, currentMousePos.y));
		ctx.translate(this.position.x+(this.width/2),this.position.y+(this.width/2),rectWidth,rectHeight);

		var localglobalSpeedModifier = globalSpeedModifier < 1 ? globalSpeedModifier * 10 : globalSpeedModifier;
		
		var degree = (this.beamDegree % 360); 
		var angle = degreesToRadians(-degree);
		var beamHit = null;

		rectWidth +=  progress * 5;
		rectWidth = rectWidth > 2000 ? 2000 : rectWidth;
		ctx.fillStyle = "red" ;

		if(Math.abs(degree - degreeDestination) < 2){ // hit from beam
			angle =  degreesToRadians(-degreeDestination);
			rectHeight += progress * localglobalSpeedModifier %10;
			ctx.fillStyle = "yellow" ;
			if(!rightClickPressed){playerHealth-=1;}
			this.beamDegree =  degreeDestination;
			ctx.rotate(getRadiansBetweeenPoints(this.position.x +(this.width/2) , this.position.y +(this.height/2), currentMousePos.x, currentMousePos.y));

			var rectWidth = distance(currentMousePos.x , currentMousePos.y, this.position.x + (this.width / 2), this.position.y + (this.height / 2)) - playerSize;

			rectWidth += progress  % 10;
			rectWidth = rectWidth > 0 ? rectWidth :0;

			beamHit = angle;

		}else{
			this.beamDegree  += 1 * localglobalSpeedModifier;
			ctx.rotate(angle);
		}


		//ctx.rotate(progress*10 * globalSpeedModifier *Math.PI/180);
		//double lines yo. dont delete!
		//ctx.fillRect( -rectWidth/2, -rectHeight/2, rectWidth ,rectHeight );
		
		ctx.fillRect( -100/20, -rectHeight/2, rectWidth ,rectHeight );
		
		
		ctx.restore(); // only modify newly created rectangle

		if(beamHit && rightClickPressed){  
			var beamhitAngle = -radiansTo360Degrees(beamHit) + 180;
			beamhitAngle = (beamhitAngle);
			var newPoint = findNewPoint(currentMousePos.x,currentMousePos.y,beamhitAngle, playerSize+2);

			ctx.beginPath();
			ctx.arc(currentMousePos.x,currentMousePos.y,playerPoweredSize,getAngle(0),getAngle(1));
			ctx.strokeStyle = "red";
			var grd=ctx.createRadialGradient(currentMousePos.x,currentMousePos.y,80,newPoint.x,newPoint.y,0);
			grd.addColorStop(0,"transparent");
			grd.addColorStop(0.50,"transparent");
			grd.addColorStop(0.99,'rgba(11,204,149,.5)');
			grd.addColorStop(1,'rgba(255,255,255,.1)');
			ctx.strokeStyle = "#5695CC";
			ctx.fillStyle=grd;
			ctx.fill();
			ctx.stroke();

		}

	
	}	
};


