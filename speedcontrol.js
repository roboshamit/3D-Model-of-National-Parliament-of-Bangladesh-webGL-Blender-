///////////CLICK COLOR CHANGE/////////
var flag = 0;
  window.addEventListener("load", function setupWebGL (evt) {
  "use strict"

  // Cleaning after ourselves. The event handler removes
  // itself, because it only needs to run once.
  window.removeEventListener(evt.type, setupWebGL, false);

  // Adding the same click event handler to both canvas and
  // button.
  var canvas = document.getElementById('game-surface');
  var gl = canvas.getContext('webgl');
  //var canvas = document.querySelector("#canvas-view");
  var button = document.getElementById("speed");
  //canvas.addEventListener("click", switchColor, false);
  button.addEventListener("click", changeSpeed, false);

  // A variable to hold the WebGLRenderingContext.
 

  // The click event handler.
  
  function changeSpeed() {
  if(flag==0){
   window.speed=2000;
   flag=1;
  }else{
    window.speed=10000;
    flag=0;
  }
  }

}, false);
