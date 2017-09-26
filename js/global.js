$(document).ready(function(){
var rainbowHoverInterval, rainbowHoverCounter = 0, rainbowHoverToggle = false;
$("#logo-container").hover(function(){
if(!rainbowHoverToggle){
rainbowHoverInterval = setInterval(function(){colorElement("#logo-container",rainbowHoverCounter)
colorElement("#banner p",rainbowHoverCounter);rainbowHoverCounter = rainbowHoverCounter <= 600 ? rainbowHoverCounter+1 : 0;},100);
}
$("#logo-container").click(function(){
//rainbowHoverToggle = rainbowHoverToggle == true ? false : true;
window.location = "/index.html";
});

}, function(){
if(!rainbowHoverToggle){
$(this).css("color","#fff");
$("#banner p").css("color","#d3d3d3");

clearInterval(rainbowHoverInterval);
rainbowHoverCounter = 0;
}
$("#logo-container").unbind("click");
});
<!-- stupid rainbow thing adapted from http://krazydad.com/tutorials/makecolors.php -->
function colorElement(selector,modifier){
  center = 128;
  width = 255;
  frequency = Math.PI*2  + modifier;
  red   = Math.sin(frequency+2) * width + center;
  green = Math.sin(frequency+0) * width + center;
  blue  = Math.sin(frequency+4) * width + center;
  $(selector).css("color",RGB2Color(red,green,blue));	
}
function RGB2Color(r,g,b){
    return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
}



});



  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-24324630-2', 'auto');
  ga('send', 'pageview');

  