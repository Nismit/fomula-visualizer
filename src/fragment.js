const Fragment = `
precision mediump float;
const float PI = 3.1415926;
const vec2 offset = vec2(0.5);
uniform float time;
uniform vec2  resolution;

vec3 hsv(float h, float s, float v){
	vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
	return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

// Ref: http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 hsv2rgb(vec3 c) {
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Ref: https://thebookofshaders.com/05/
float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

float function(in float x) {
	float y = 0.;

	return y;
}

void main() {
	vec2 uv = (gl_FragCoord.xy / resolution.xy) - offset;
	uv *= 2.5;

	vec3 color = vec3(0.0);
	vec3 white = vec3(1.0);

	// Function
	float y = sin(uv.x * PI + time);

	// Plot
	float line = plot(uv, function(uv.x));
	color = (1.0 - line) * color + line * white;

	gl_FragColor = vec4(color, 1.0);
}`;

export default Fragment
