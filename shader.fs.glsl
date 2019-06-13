precision mediump float;

varying vec2 fragTexCoord;
varying vec3 fragNormal;
uniform vec3 ambientLightIntensity;
uniform vec3 sunLightIntensity;
uniform vec3 sunLightDirection;

uniform sampler2D sampler;

void main()
{
	//vec3 ambientLightIntensity=vec3(0.1,0.1,0.2);
	//vec3 sunLightIntensity=vec3(0.9,0.9,0.9);
	//vec3 sunLightDirection=normalize(vec3(1.0,-4.0,10.0));
	vec3 surfaceNormal=normalize(fragNormal);
	vec3 normSunDir=normalize(sunLightDirection);
	vec4 texel=texture2D(sampler,fragTexCoord);

	vec3 lightIntensity=ambientLightIntensity+
	sunLightIntensity*max(dot(fragNormal,sunLightDirection),0.0);

	gl_FragColor=vec4(texel.rgb*lightIntensity,texel.a);
	//gl_FragColor=vec4(fragNormal,1.0);
    //gl_FragColor = texture2D(sampler, fragTexCoord);
}