function Particle(name, startCoord, endCoord, width, height, speed, color, movementBehavior) {
	GameObject.call(this, name, startCoord, endCoord, width, height, speed, color, movementBehavior);
	this.random = Math.floor(Math.random() * (20 - 1));
}
Particle.prototype = new GameObject();

Particle.prototype.init = function() {
	GameObject.prototype.init.call(this); 

}

Particle.prototype.act = function() {
	GameObject.prototype.act.call(this); 
	
}


Particle.prototype.eject = function(){

	
	 
	 this.opacity-=0.08;


};


Particle.prototype.exists = function(){
	if(this.timer < 10){
		this.exist = true;
		return true;
	}else{
		this.exist = false;
		return false;
		
	}
	
};


