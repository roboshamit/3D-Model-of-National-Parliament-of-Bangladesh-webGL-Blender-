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
  var button = document.getElementById("lightbt");
  //canvas.addEventListener("click", switchColor, false);
  button.addEventListener("click", changeLight, false);

  // A variable to hold the WebGLRenderingContext.
 

  // The click event handler.
  
  function changeLight() {

  if(flag==0){
  window.ambr=0.5;
  window.ambg=0.5;
  window.ambb=0.5;
   flag=1;
  }else{
  window.ambr=0.0;
  window.ambg=0.0;
  window.ambb=1.0;
    flag=0;
  }
  }

}, false);
