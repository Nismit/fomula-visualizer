const Fragment = `
precision mediump float;
uniform float time;
// uniform vec2  mouse;
uniform vec2  resolution;

// void main() {
// 	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
// 	// vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution.xy;
// 	vec2 color = (vec2(1.0) + p.xy) * 0.5;
// 	gl_FragColor = vec4(color, 0.0, 1.0);
// }

const float PI = 3.1415926;

vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution;
    vec3 line = vec3(0.0);
    for(float fi = 0.0; fi < 50.0; ++fi){
        float offset = fi * PI / 100.0;
        float value = 1.0 + sin(time * fi * 0.15 + 0.1) * 0.5;
        float timer = time * fi * 0.01;
        vec3  color = hsv((fi + time) * 0.0175, 1.0, value);
        line += 0.0025 / abs(p.y + sin(p.x * 1.0 + timer + offset) * 0.75) * color;
    }
    gl_FragColor = vec4(line, 1.0);
}

`;

export default Fragment
