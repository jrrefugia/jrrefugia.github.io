function Bullet(name, startCoord, endCoord, width, height, speed, color, movementBehavior){
	GameObject.call(this, name, startCoord, endCoord, width, height, speed, color, movementBehavior);

}
Bullet.prototype = new GameObject();

Bullet.prototype.init = function() {
	GameObject.prototype.init.call(this); 

	if(!this.waypoint.x){
	var newPos = findStraightEndpoint(this.position.x,this.position.y,this.mousePosOnCreate.x-(this.width/2),this.mousePosOnCreate.y-(this.height/2), this.speed * globalSpeedModifier);
	
	this.waypoint.x = newPos.x;
	this.waypoint.y = newPos.y;

	}else{
		
		//good for bomb spread
		//this.waypoint.x = Math.floor(Math.random() * (canvas.width - (this.width) - 1)) + 1;
		//this.waypoint.y = Math.floor(Math.random() * (canvas.height - (this.width) - 1)) + 1;
		
		
	}

}

Bullet.prototype.act = function() {
	GameObject.prototype.act.call(this); 
	
	//collision detect	
	var player = {x:currentMousePos.x,y:currentMousePos.y,r:playerSize+3};
	var bullet = {x:this.position.x,y:this.position.y,r:this.radius};	
	this.exist = !pointIntersectsCircle(player,bullet);
		
	if(!rightClickPressed && !this.exist){	
		playerHealth--;
		ctx.globalAlpha = 0.08;
		ctx.fillStyle="#FF0000";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.globalAlpha = 1.0;
		
	}else if(!this.exist){
		//cool effect on shield when hit.
		ctx.beginPath();
		ctx.arc(currentMousePos.x,currentMousePos.y,playerPoweredSize,getAngle(0),getAngle(1));
		ctx.strokeStyle = "red";
		var grd=ctx.createRadialGradient(currentMousePos.x,currentMousePos.y,playerSize+10,this.position.x,this.position.y,0);
		grd.addColorStop(0,"transparent");
		grd.addColorStop(0.50,"transparent");
		grd.addColorStop(0.99,'rgba(11,204,149,.5)');
		grd.addColorStop(1,'rgba(255,255,255,.1)');
		ctx.strokeStyle = "#5695CC";
		ctx.fillStyle=grd;
		ctx.fill();
		ctx.stroke();
	}
	
	
	
	
	
	
	
	if(this.name == "bullet"){
		if(this.radius > 75){
			this.exist = false;
			
		}else{
			this.throb();
			
		}

	}else if(this.name == "homing"){
		if(this.timer < 20){
		 var newPos = nextPath(this.position.x+(this.width/2),this.position.y+(this.height/2),this.waypoint.x,this.waypoint.y, this.speed * globalSpeedModifier);
			  this.position.x = newPos.x;
			  this.position.y = newPos.y; 
			this.speed+=0.20;
		}else if(this.timer < 60){
			var newPos = nextPath(this.position.x+3,this.position.y+3,currentMousePos.x-(this.width/2),currentMousePos.y-(this.height/2), this.speed * globalSpeedModifier);				
			var newPos = findStraightEndpoint(this.position.x,this.position.y,newPos.x,newPos.y, this.speed * globalSpeedModifier);
			
			
			var particle = new Particle("particle", {x: this.position.x, y: this.position.y }, {x:null,y:null}, 10, 1, 3, {r:240,g:240,b:240}, "eject");
			particle.init();
			particleRegister["particle"+objectsOnScreen] = particle;
			particle = null;

			
			
			
			ctx.beginPath();
			ctx.moveTo(this.position.x,this.position.y);
			ctx.lineTo(currentMousePos.x,currentMousePos.y);
			ctx.strokeStyle = "red";
			ctx.stroke();

			this.waypoint.x = newPos.x;
			this.waypoint.y = newPos.y;
			this.speed+=0.20;
		}else{

			var particle = new Particle("particle", {x: this.position.x, y: this.position.y }, {x:null,y:null}, 10, 1, 3, {r:240,g:240,b:240}, "eject");
			particle.init();
			particleRegister["particle"+objectsOnScreen] = particle;
			particle = null;
		
		
			this.speed+=0.10;
		
			
		}
		
		
		
		//hit detection is weird here.

	}else if(this.name == "bomb"){
		
		ctx.save();
			if(this.timer >50){
				ctx.globalAlpha-=0.1;
			}




			ctx.beginPath();
			ctx.arc(this.position.x,this.position.y,this.timer*4,getAngle(0),getAngle(1));
			ctx.fillStyle = "yellow";
			ctx.strokeStyle = "yellow";
			ctx.fill();
			ctx.stroke();
ctx.restore();			

			if(this.timer > 100){
				this.exist = false;
				
			}
			
	}
	
	


	
	
	
	
	
}

Bullet.prototype.throb = function(){
	if(this.timer % 1 < 1){
		this.radius+=0.2*globalSpeedModifier;
		this.height+=0.2*globalSpeedModifier;
		this.width+=0.2*globalSpeedModifier;
	}
};

