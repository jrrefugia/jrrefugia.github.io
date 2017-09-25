//class definitions
function GameObject(name, startCoord, endCoord, width, height, speed, color, movementBehavior){
    this.name = name || "";
    this.position = {x: startCoord ? startCoord.x : 0, y: startCoord ? startCoord.y : 0};
    this.width = width || "";
    this.height = height || "";
    this.speed = speed || "";
	this.color = {r: color ? color.r : 0, g:color ? color.g : 0, b:color ? color.b : 0};
	this.opacity = 1;
	this.radius = 4;
	this.timer = 0; //how long i've been up.
	this.movementBehavior = movementBehavior;
	//movement properties
	this.mousePosOnCreate = {x: 0, y: 0};
	this.waypoint = endCoord;
	this.exist = true;
}

GameObject.prototype.init = function(){
	objectsOnScreen++;
	this.mousePosOnCreate.x = currentMousePos.x;
	this.mousePosOnCreate.y = currentMousePos.y;
	


	if(this.movementBehavior == "wander"){
		this.waypoint.x = Math.floor(Math.random() * (canvas.width - (this.width) - 1)) + 1;
		this.waypoint.y = Math.floor(Math.random() * (canvas.height - (this.width) - 1)) + 1;
	}
	

	
};

GameObject.prototype.act = function(){
	this.timer+=1*globalSpeedModifier;
	this[this.movementBehavior]();
	

};

GameObject.prototype.stay = function(){
   this.position.x;
   this.position.y;
};

GameObject.prototype.follow = function(){
if(this.timer > 20){	
  var newPos = nextPath(this.position.x,this.position.y,currentMousePos.x-(this.width/2),currentMousePos.y-(this.height/2), this.speed * globalSpeedModifier);
  this.position.x = newPos.x;
  this.position.y = newPos.y; 
}
};

GameObject.prototype.move = function(){

if(this.timer > 20){	
  var newPos = nextPath(this.position.x,this.position.y,this.waypoint.x,this.waypoint.y, this.speed * globalSpeedModifier);
  this.position.x = newPos.x;
  this.position.y = newPos.y;

}

};

GameObject.prototype.bullet = function(){
 var newPos = nextPath(this.position.x,this.position.y,this.waypoint.x,this.waypoint.y, this.speed * globalSpeedModifier);
  this.position.x = newPos.x;
  this.position.y = newPos.y; 
};

GameObject.prototype.wander = function(){

if(this.timer > 20){	
  var newPos = nextPath(this.position.x,this.position.y,this.waypoint.x,this.waypoint.y, this.speed * globalSpeedModifier);
  this.position.x = newPos.x;
  this.position.y = newPos.y;

  if(Math.abs(this.position.x - this.waypoint.x) < 15 && Math.abs(this.position.y - this.waypoint.y) < 15){ 
	  this.waypoint.x = Math.floor(Math.random() * (550 - 1)) + 1;
	  this.waypoint.y = Math.floor(Math.random() * (550 - 1)) + 1;
  }  
}

};

GameObject.prototype.exists = function(){
   if(this.position.x >= 0 - this.width &&
		this.position.y >= 0 - this.height &&
		this.position.x <= canvas.width + this.width &&
		this.position.y <= canvas.height + this.height){
		
		return true;
	   
   }else{
		return false;
	   
   }
};







