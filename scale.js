
///////////CLICK scale CHANGE/////////
var gl = canvas.getContext('webgl');
var canvas = document.getElementById('game-surface');
 var u_xformMatrix = gl.getUniformLocation(program, 'u_xformMatrix');
	
         var xformMatrix = new Float32Array([
            Sx,   0.0,  0.0,  0.0,
            0.0,  Sy,   0.0,  0.0,
            0.0,  0.0,  Sz,   0.0,
            0.0,  0.0,  0.0,  1.0  
         ]);
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
  var button = document.getElementById("Scale");
  //canvas.addEventListener("click", switchColor, false);
  button.addEventListener("click", click, false);
  canvas.onmousedown = function (ev) { click(gl); };
  var flag = 0;
  function click(gl)
  {
     if(flag ==0)
     {
       mat4.lookAt(viewMatrix, [0, -90,10], [0, 0, 0], [0, 1, 0]);
       gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
      flag= 1;
    }
    else{
      mat4.lookAt(viewMatrix, [0, -70,10], [0, 0, 0], [0, 1, 0]);
      gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
      flag= 0;
    }
  }
  // A variable to hold the WebGLRenderingContext.
 


 

}, false);
