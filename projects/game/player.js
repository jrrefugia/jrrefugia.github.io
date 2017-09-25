function updatePlayer(){
	if(rightClickPressed && leftClickPressed){
		if(bulletTimeGauge > 0){
			globalSpeedModifier = 0.01;
			playerColor = colorElement(progress % 100 / 5);
			playerSize = playerPoweredSize;
			//bulletTimeGauge--;
		}else{
			globalSpeedModifier =1;
			playerColor = "white";
			playerSize = 5;
		}

		
	}else if(rightClickPressed){
		if(bulletTimeGauge > 0){
			playerColor = "rgba(71,157,255,0.25)";
			playerSize = playerPoweredSize;
		
		}else{
			playerColor = "white";
			playerSize = 5;
		}
	}else if(middleClickPressed){
		globalSpeedModifier = 0.01;
		playerSize = 1;			
	}
	
	if(progress%25 == 0){
		bulletTimeGauge++;
	}
	if(bulletTimeGauge > 100){
		bulletTimeGauge = 100;
		
	}else if(bulletTimeGauge < 0){
		bulletTimeGauge = 0;
	}
}