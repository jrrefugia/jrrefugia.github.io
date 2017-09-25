//disable rightclick
document.oncontextmenu = function(){
	return false;
}

//update global mouse position on mousemove in canvas
$(document).mousemove(function(e) {
	var container = canvas.getBoundingClientRect();
	if(Math.abs(prevMousePos.x - currentMousePos.x) > 10 && Math.abs(prevMousePos.y - currentMousePos.y) > 10 ){
		prevMousePos.x = currentMousePos.x;
		prevMousePos.y = currentMousePos.y;
	}
	currentMousePos.x = e.clientX - container.left;
	currentMousePos.y = e.clientY - container.top;
	
	$("#coords").html("x: "+currentMousePos.x+",y: "+currentMousePos.y);
});

//mouse click states

$(canvas).on("mouseenter",function(e) {
	if(!progress){
		start();
	}
});

$(canvas).on("mouseup",function(e){
    switch (event.which) {
        case 1:
            leftClickPressed = false;
			globalSpeedModifier = middleClickPressed ? 0.1 : 1;
			playerColor = "white";
			playerSize = 5;
            break;
        case 2:
			middleClickPressed = false;
			globalSpeedModifier = 1;
			playerColor = "white";
			playerSize = 5;
			
            break;
        case 3:

            rightClickPressed = false;
			globalSpeedModifier = middleClickPressed ? 0.1 : 1;
			playerColor = "white";
			playerSize = 5;
            break;
        default:
    }
});
$(canvas).on("mousedown",function(e){
    switch (event.which) {
        case 1:
			lastClick.x = e.clientX - canvas.getBoundingClientRect().left;
			lastClick.y = e.clientY - canvas.getBoundingClientRect().top;
            leftClickPressed = true;
            break;
        case 2:
			middleClickPressed = true;
            break;
        case 3:
            rightClickPressed = true;
            break;
        default:
    }
});
$(canvas).on("mouseleave",function(e){
	leftClickPressed = false;
	rightClickPressed = false;
	globalSpeedModifier = 1;
	playerColor = "white";
	playerSize = 5;
});