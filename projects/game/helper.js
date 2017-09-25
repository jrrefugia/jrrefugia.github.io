//params: circle{x:,y:,r:}, rectangle{x:,y:,w:,h:}
//usage: intersects(circle,rectange);
function intersects(circle, rect){
	var circleDistance = {x:"",y:""};
    circleDistance.x = Math.abs(circle.x - rect.x);
    circleDistance.y = Math.abs(circle.y - rect.y);

    if (circleDistance.x > (rect.w/2 + circle.r)) { return false; }
    if (circleDistance.y > (rect.h/2 + circle.r)) { return false; }

    if (circleDistance.x <= (rect.w/2)) { return true; } 
    if (circleDistance.y <= (rect.h/2)) { return true; }

    cornerDistance_sq = (circleDistance.x - rect.w/2)^2 + (circleDistance.y - rect.h/2)^2;

    return (cornerDistance_sq <= (circle.r^2));
}

function distance(x1, y1, x2, y2){
	return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
}

function pointIntersectsCircle(point, circle){
	var distance = Math.sqrt( (circle.x-=point.x)*circle.x + (circle.y-=point.y)*circle.y );
	if(distance < point.r + circle.r){
		return true;
	}else{
		return false;
	}
}

function circleIntersects(circle, anotherCircle) {
 
	var x0 = circle.x;
	var y0 = circle.y;
	var r0 = circle.r;
	
	var x1 = anotherCircle.x;
	var y1 = anotherCircle.y;
	var r1 = anotherCircle.r;

	var a, dx, dy, d, h, rx, ry;
	var x2, y2;

	dx = x1 - x0;
	dy = y1 - y0;
	d = Math.sqrt((dy*dy) + (dx*dx));

	var intersect = true;
	
	if (d > (r0 + r1)) {
		intersect = false;
	}
	if (d < Math.abs(r0 - r1)) {
		intersect = false;
	}
	
	return intersect;
	
}

function findStraightEndpoint(x1,y1,x2,y2, speed){
	var coef = determineCoef(x1,y1,x2,y2);
	var coefX = coef.coefX * 1000;
	var coefY = coef.coefY * 1000;		
	if(x1 <= x2){
		x2 -= coefX;
	}else if(x1 > x2){
		x2 -= coefX;
	}
	if(y1 <= y2){
		y2 -= coefY;
	}else if(y1 > y2){
		y2 -= coefY;
	}
	return {x:x2 , y: y2};
}

function nextPath(x1,y1,x2,y2, speed){
	var coef = determineCoef(x1,y1,x2,y2);
	var coefX = coef.coefX;
	var coefY = coef.coefY;
	if(Math.round(x1) < (x2 - speed) || Math.round(x1) > (x2 + speed)){
		x1 -= coefX * speed;
	}
	if(Math.round(y1) < (y2 - speed) || Math.round(y1) > (y2 + speed)){
		y1 -= coefY * speed;
	}
	return {x: x1,y: y1};
};


function determineCoef(x1,y1,x2,y2){
	var slopeY = (y1 - y2); 
	var slopeX = (x1 - x2);
	var slope = -(slopeY / slopeX);
	var coef = 0;
	if(Math.abs(slopeY) > Math.abs(slopeX)){
		coef = Math.abs(slopeY);
	}else{
		coef = Math.abs(slopeX);
	}
	coefX = coef != 0 ? (slopeX / coef) : slopeX;
	coefY = coef != 0 ? (slopeY / coef) : slopeY;
	return {coefX:coefX,coefY:coefY};
}

function colorElement(modifier){
  center = 128;
  width = 255;
  frequency = Math.PI*2  + modifier;
  red   = Math.sin(frequency+2) * width + center;
  green = Math.sin(frequency+0) * width + center;
  blue  = Math.sin(frequency+4) * width + center;
  opacity = (rightClickPressed && leftClickPressed) ? 0.20 : 0.25;
  return 'rgba(' + Math.round(red) + ',' + Math.round(green) + ',' + Math.round(blue) + ','+ opacity +')';
}

function getAngle(radians){
	return (radians * 180)/Math.PI;
}

function getAngleBetweenPoints(x1, y1, x2, y2){
	return  ((Math.atan2(y2 -y1, x2 -x1) * 180 / Math.PI) + 180) * Math.PI/180;
}

function getRadiansBetweeenPoints(x1, y1, x2, y2){
	return Math.atan2(y2 -y1, x2 -x1);
}


function radiansToDegrees(radians){
	return radians * 180 / Math.PI;
	
}

function radiansTo360Degrees(radians){
	var degrees = -(radians * 180 / Math.PI);
	return degrees < 0 ? 360 + degrees : degrees;
	
}

function degreesToRadians(degrees){
	return degrees*Math.PI/180;
	
}

function degrees360ToRadians(degrees){
	return (degrees - 180) *Math.PI/180;
	
}

function findNewPoint(x, y, angle, distance) {
    var result = {};

    result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + x);
    result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + y);

    return result;
}

function findNewAngle(x, y, angle, distance) {
    var result = {};

    result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + x);
    result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + y);

    return result;
}

function randomIntBetween(a, b){
	return Math.floor(Math.random() * (b + 1)) + a;
}

function randomFloatBetween(a, b){
	return Math.random() * (b + 1) + a;
}