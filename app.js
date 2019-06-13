var speed=10000;
var Sx = 1.0, Sy = 1.0, Sz = 1.0;
var count = 0;
var ang = 45;
var sunintenx=0.5;
var suninteny=0.5;
var sunintenz=0.5;
var ambr=0.5;
var ambg=0.5;
var ambb=0.5;

var InitDemo = function () {
	loadTextResource('./shader.vs.glsl', function (vsErr, vsText) {
		if (vsErr) {
			alert('Fatal error getting vertex shader (see console)');
			console.error(vsErr);
		} else {
			loadTextResource('./shader.fs.glsl', function (fsErr, fsText) {
				if (fsErr) {
					alert('Fatal error getting fragment shader (see console)');
					console.error(fsErr);
                    
				} else {
					loadJSONResource('./s2.json', function (modelErr, modelObj) {
						if (modelErr) {
							alert('Fatal error getting Susan model (see console)');
							console.error(fsErr);
                            console.log('This is working');
						} else {
							loadImage('./white.jpg', function (imgErr, img) {
								if (imgErr) {
									alert('Fatal error getting Susan texture (see console)');
									console.error(imgErr);
                                    console.log('This is working');
								} else { 
									RunDemo(vsText, fsText, img, modelObj);
								}
							});
						}
					});
				}
			});
		}
	});
};

function initCallbacks(){
	state.canvas.onmousedown=mousedown;
	state.canvas.onmouseup=mouseup;
	state.canvas.onmousemove=mousemove;
}

var RunDemo = function (vertexShaderText, fragmentShaderText, SusanImage, SusanModel) {
	console.log('This is working');
	model=SusanModel;


	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	//gl.clearColor(0.7, 1.0, 0.7, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	//
	// Create shaders
	// 
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	//
	// Create buffer
	//
	var susanVertices = SusanModel.meshes[0].vertices;
	var susanIndices = [].concat.apply([], SusanModel.meshes[0].faces);
    
  
    
   
	var susanTexCoords = SusanModel.meshes[0].texturecoords[0];
	var susanNormals=SusanModel.meshes[0].normals;

	var susanPosVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, susanPosVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanVertices), gl.STATIC_DRAW);

	var susanTexCoordVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanTexCoords), gl.STATIC_DRAW);

	var susanIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, susanIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(susanIndices), gl.STATIC_DRAW);

	var susanNormalBufferObject=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,susanNormalBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanNormals),gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, susanPosVertexBufferObject);
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		4, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.enableVertexAttribArray(positionAttribLocation);

	gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordVertexBufferObject);
	var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
	gl.vertexAttribPointer(
		texCoordAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0
	);
	gl.enableVertexAttribArray(texCoordAttribLocation);


	gl.bindBuffer(gl.ARRAY_BUFFER, susanNormalBufferObject);
	var normalAttribLocation=gl.getAttribLocation(program,'vertNormal');
	gl.vertexAttribPointer(
		normalAttribLocation,
		3,gl.FLOAT,
		gl.TRUE,
		3*Float32Array.BYTES_PER_ELEMENT,
		0
		);
	gl.enableVertexAttribArray(normalAttribLocation);
	//
	// Create texture
	//
	var susanTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, susanTexture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		SusanImage
	);
	gl.bindTexture(gl.TEXTURE_2D, null);

	// Tell OpenGL state machine which program should be active.
	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var u_xformMatrix = gl.getUniformLocation(program, 'u_xformMatrix');
	
         var xformMatrix = new Float32Array([
            Sx,   0.0,  0.0,  0.0,
            0.0,  Sy,   0.0,  0.0,
            0.0,  0.0,  Sz,   0.0,
            0.0,  0.0,  0.0,  1.0  
         ]);


	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix, [0,-90, 10], [0, 0, 0], [0, 1, 0]);
	mat4.perspective(projMatrix, glMatrix.toRadian(15), canvas.clientWidth/ canvas.clientHeight, 0.1, 1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);
	var deg = gl.getUniformLocation(program, "angle");
	///lighting info
	gl.useProgram(program);
	var ambientUniformLocation=gl.getUniformLocation(program,'ambientLightIntensity');
	var sunLightDirUniformLocation=gl.getUniformLocation(program,'sunLightDirection');
	var sunLightIntUniformLocation=gl.getUniformLocation(program,'sunLightIntensity');

	gl.uniform3f(ambientUniformLocation,ambr,ambg,ambb);///ambient
	gl.uniform3f(sunLightDirUniformLocation,1.0,-4.0,0.0);///direction
	gl.uniform3f(sunLightIntUniformLocation,sunintenx,suninteny,sunintenz);//intensity

	//
	// Main render loop
	//
	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	var angle =    0;
	//var speed=10000;

	var loop = function () {////DRAW
           angle = performance.now() / speed;
		mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 0, 1]);
		mat4.rotate(xRotationMatrix, identityMatrix, angle , [0, 0, 1]);
		mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		//gl.clearColor(0.7, 0.8, 0.7, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

		gl.bindTexture(gl.TEXTURE_2D, susanTexture);
		gl.activeTexture(gl.TEXTURE0);

		gl.drawElements(gl.TRIANGLES, susanIndices.length, gl.UNSIGNED_SHORT, 0);

		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
	///////////////LOOK AT CHANGE//////////////////////////
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
			mat4.lookAt(viewMatrix, [0, -65,10], [0, 0, 0], [0, 1, 0]);
			gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
			flag= 0;
		}
	}
	
	///////////////////////////////////KEYEBOARD
	window.addEventListener("keydown", keyBoardEvents, false);
	function keyBoardEvents(e) {
    switch(e.keyCode) {
        case 37:          
			var angle = count*5;
			gl.uniform1f(deg, angle);	
			count++;
	 // Attach vertex shader source code

            break;        
        case 39:
            var angle = count*5;
			gl.uniform1f(deg, angle);
	
			count--;
            break;
        case 67:
            ang = ang+50;
			
            break;  
		case 99:
            ang = ang+50;
			
            break;  
		}   
	}



};
