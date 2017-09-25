function updateUI(){ 
	$("#bulletTimeGauge").progressbar({value: bulletTimeGauge});
	if (bulletTimeGauge == 0) {
		$("#bulletTimeGauge  .ui-widget-header").css({"border-right" : "none"});
	} else if (bulletTimeGauge > 1) {
		$("#bulletTimeGauge  .ui-widget-header").css({"border-right" : "7px dashed #fff"});
	}
	
	$("#playerHealthBar").progressbar({value: playerHealth});
	
	if(playerHealth <= 50) {
		$("#playerHealthBar > div").css({"background": "yellow"});
	}
	
	$("#playerScore").html(playerScore);
}