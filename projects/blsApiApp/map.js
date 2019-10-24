$(document).ready(function (){
	





///set up legend box highlighting



$(".legendBox").each(function(index, element) {
    var thisColor = $(this).css("background-color");
	$(this).attr("previousfill",thisColor);
	});
	


//hover
$(".legendElement").hover(function(){
	var thisElement = $(this);
	var thisColor = $(".legendBox", thisElement).attr("previousfill");
	
if($(this).hasClass("on")){		
	$(".legendBox", thisElement).css("background-color", "rgb(56, 65, 255)");
}
		
	$("path, circle").each(function(index, element) {
     if (($(this).attr("enabled")) === "true"){ //if not gray   
		if (($(this).css("fill")) == thisColor){
			$(this).css("fill", "rgb(56, 65, 255)"); //blue
		}
	 }
		
    });
	
},function(){ //mouse out
	var thisElement = $(this);

var boxColor = $(".legendBox", thisElement).attr("previousfill");	
if($(this).hasClass("on")){	
		$(".legendBox", thisElement).css("background-color", boxColor);
}else{ //change box color back to normal color, not blue else change back to gray
	$(".legendBox", thisElement).css("background-color", "rgba(248, 245, 245, 0.20)");
}


$("path, circle").each(function(index, element) {
	if (($(this).attr("enabled")) === "true"){ //if not gray
			$(this).css("fill", $(this).attr("previousfill"));	
		}
   
    });
	
});



///set up legend clicking
$(".legendElement").toggle(function(){
	$(this).removeClass("on");
	var thisElement = $(this);
	
	
	$(".key", thisElement).css("color","#ccc");
	
	var thisColor = $(".legendBox", thisElement).attr("previousfill");
	$(".legendBox", thisElement).css("background-color", "rgba(248, 245, 245, 0.20)");
		
	$("path, circle").each(function(index, element) {
        if (($(this).attr("previousfill")) == thisColor){
			$(this).css("fill", "rgba(248, 245, 245, 0.20)");	//gray
			$(this).attr("enabled","false");
		}
    });
	
},function(){
	$(this).addClass("on");
		var thisElement = $(this);
		var thisColor = $(".legendBox", thisElement).attr("previousfill");
	$(".legendBox", thisElement).css("background-color", "rgb(56, 65, 255)");
	$(".key", thisElement).css("color","#000");
	
	
	$("path, circle").each(function(index, element) {
		 if (($(this).attr("previousfill")) == thisColor){
			$(this).css("fill", 'rgb(56, 65, 255)');	
			$(this).attr("enabled","true");	
		}
			
    });
});


	
	


	

function supportsSVG() {
    return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect;
  }
if(!supportsSVG()){
	$("#mapHeader").text("Please use a newer browser to see the interactive map");
}

///add commas formatter
function addCommas(val) {

    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}

//map tooltip formatter
var mapToolTipFormat = function(val, formatThis){
	
	var stateDataValue = Number(val.replace(/,/g, "").replace("$", "").replace("%", ""));
	
		if (formatThis){
		 if (false == false){
			 
		stateDataValue = " " + addCommas(Number(stateDataValue))+ "%";
	}else{
		stateDataValue = " " + addCommas(Number(stateDataValue).toFixed(false)) + "%";
	}
		}else{//if formatThis is false, don't format.
		
		
		if(isNaN(stateDataValue)){ //if value is text, not number, dont add commas
			stateDataValue = val; 	
		}
	
	}
return stateDataValue;	
}
 	
	
///set up if state clicked, go to eag page
$('#empbystate path, #empbystate circle').css("cursor","pointer")
	.click(function(){

if (typeof inMapEditor === 'undefined'){
	var thisID = $(this).attr("id");
	window.open("http://www.bls.gov/eag/eag."+thisID+".htm", '_blank');
}else{
////////////add states to list by clicking on map
	var thisState = $(this).attr("statename");
	var toRemove = false;
	///look to see if its already on list, if so, remove
	$("#includedStatesList p").each(function(){
		if ($(this).text() == thisState){
			$(this).remove();
			toRemove = true;	
		}
	});
///add if not on list
if (toRemove === false){
	$("#includedStatesList").append("<p onclick='removeStateFromList($(this))'>"+thisState+"</p>");
}
}
	

});
	
	
///set up hover highlighting and tooltip	
var stateName="";

$('#empbystate path[id], #empbystate circle').hover(function(event){
var displayName = 'showStates';

///assign previous colors
	
		SVGfill = $(this).css("fill");

if (displayName == "showDivisions"){
	stateName = $(this).attr("divisionname");
	$("#empbystate path[divisionname = '"+stateName+"']").css({"fill": "#ff0088"});//highlight
}else if (displayName == "showRegions"){
	stateName = $(this).attr("regionname");
	$("#empbystate path[regionname = '"+stateName+"']").css({"fill": "#ff0088"});//highlight
} else{
	stateName = $(this).attr("statename");
	$(this).css({"fill": "#ff0088"});  //highlight
}



//highlight	
	
	 
	
////show tooltip




if ($(this).attr("statevalue")){

if ($(this).attr("statevalue") == "N/A"){
	var stateDataValue = "N/A";
	}else{
	var stateDataValue = mapToolTipFormat($(this).attr("statevalue"),true); ///true to enable formatter
	}
}else{ //if not attr found
var stateDataValue = "";	
}


///add extra values if present

$("#mapToolTip_empbystate #extraDataSpan").text("");
if 	($(this).attr("extradatanames")){
		var extraDataNames = $(this).attr("extradatanames").split(";");
		var extraDataValues = $(this).attr("extradatavalues").split(";")
	
	for(i=0; i<extraDataNames.length; i++){

	$("#mapToolTip_empbystate #extraDataSpan").append(extraDataNames[i] + ': <span style="font-weight: bold">' + extraDataValues[i] +"</span><br>");
	}

}
	
	
	
	$("#mapToolTip_empbystate #stateName").text(stateName);
//	$("#dataText").html(selectedDate);
	$("#mapToolTip_empbystate #dataValue").text(stateDataValue);
	
	


	
	
	
	$("#mapToolTip_empbystate").css("display","block"); 
	
	},
	function(){
		var displayName = 'showStates';
		//console.log(SVGfill);
	$("#empbystate path[divisionname = '"+stateName+"']").css({"fill": SVGfill});//highlight
	
	
		if (displayName == "showDivisions"){
			$("#empbystate path[divisionname = '"+stateName+"']").css({"fill": SVGfill});//highlight
		}else if (displayName == "showRegions"){
			$("#empbystate path[regionname = '"+stateName+"']").css({"fill": SVGfill});//highlight
		} else{
			$(this).css({"fill": SVGfill});  //highlight
		}
		
	$("#mapToolTip_empbystate").css("display","none");
	
	});
});