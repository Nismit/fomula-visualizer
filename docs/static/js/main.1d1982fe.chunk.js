(this["webpackJsonpfomula-visualizer"]=this["webpackJsonpfomula-visualizer"]||[]).push([[0],{15:function(e,n,t){},16:function(e,n,t){"use strict";t.r(n);var i=t(0),r=t(1),o=t.n(r),a=t(4),c=t.n(a),s=(t(15),t(5)),l=t(6),x=t(2),v=t(9),g=t(8),f=t(7);function h(e){return'\nprecision mediump float;\nconst float PI = 3.1415926;\nconst vec2 offset = vec2(0.5);\nuniform float time;\nuniform vec2  resolution;\n\n// Ref: https://github.com/ashima/webgl-noise/blob/master/src/noise2D.glsl\n//\n// Description : Array and textureless GLSL 2D simplex noise function.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : stegu\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//               https://github.com/stegu/webgl-noise\n//\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec2 mod289(vec2 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec3 permute(vec3 x) {\n  return mod289(((x*34.0)+1.0)*x);\n}\n\nfloat snoise(vec2 v) {\n  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0\n                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)\n                     -0.577350269189626,  // -1.0 + 2.0 * C.x\n                      0.024390243902439); // 1.0 / 41.0\n\t// First corner\n  vec2 i  = floor(v + dot(v, C.yy) );\n  vec2 x0 = v -   i + dot(i, C.xx);\n\n\t// Other corners\n  vec2 i1;\n  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0\n  //i1.y = 1.0 - i1.x;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  // x0 = x0 - 0.0 + 0.0 * C.xx ;\n  // x1 = x0 - i1 + 1.0 * C.xx ;\n  // x2 = x0 - 1.0 + 2.0 * C.xx ;\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n\n\t// Permutations\n  i = mod289(i); // Avoid truncation effects in permutation\n  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))\n\t\t+ i.x + vec3(0.0, i1.x, 1.0 ));\n\n  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n  m = m*m ;\n  m = m*m ;\n\n\t// Gradients: 41 points uniformly over a line, mapped onto a diamond.\n\t// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\n\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n\n\t// Normalise gradients implicitly by scaling m\n\t// Approximation of: m *= inversesqrt( a0*a0 + h*h );\n  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n\n\t// Compute final noise value at P\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n\n// https://github.com/ashima/webgl-noise/blob/master/src/classicnoise2D.glsl\n//\n// GLSL textureless classic 2D noise "cnoise",\n// with an RSL-style periodic variant "pnoise".\n// Author:  Stefan Gustavson (stefan.gustavson@liu.se)\n// Version: 2011-08-22\n//\n// Many thanks to Ian McEwan of Ashima Arts for the\n// ideas for permutation and gradient selection.\n//\n// Copyright (c) 2011 Stefan Gustavson. All rights reserved.\n// Distributed under the MIT license. See LICENSE file.\n// https://github.com/stegu/webgl-noise\n//\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\n  return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r) {\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec2 fade(vec2 t) {\n  return t*t*t*(t*(t*6.0-15.0)+10.0);\n}\n\n// Classic Perlin noise\nfloat cnoise(vec2 P) {\n  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);\n  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);\n  Pi = mod289(Pi); // To avoid truncation effects in permutation\n  vec4 ix = Pi.xzxz;\n  vec4 iy = Pi.yyww;\n  vec4 fx = Pf.xzxz;\n  vec4 fy = Pf.yyww;\n\n  vec4 i = permute(permute(ix) + iy);\n\n  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;\n  vec4 gy = abs(gx) - 0.5 ;\n  vec4 tx = floor(gx + 0.5);\n  gx = gx - tx;\n\n  vec2 g00 = vec2(gx.x,gy.x);\n  vec2 g10 = vec2(gx.y,gy.y);\n  vec2 g01 = vec2(gx.z,gy.z);\n  vec2 g11 = vec2(gx.w,gy.w);\n\n  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));\n  g00 *= norm.x;\n  g01 *= norm.y;\n  g10 *= norm.z;\n  g11 *= norm.w;\n\n  float n00 = dot(g00, vec2(fx.x, fy.x));\n  float n10 = dot(g10, vec2(fx.y, fy.y));\n  float n01 = dot(g01, vec2(fx.z, fy.z));\n  float n11 = dot(g11, vec2(fx.w, fy.w));\n\n  vec2 fade_xy = fade(Pf.xy);\n  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);\n  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);\n  return 2.3 * n_xy;\n}\n\n// Classic Perlin noise, periodic variant\nfloat pnoise(vec2 P, vec2 rep) {\n  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);\n  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);\n  Pi = mod(Pi, rep.xyxy); // To create noise with explicit period\n  Pi = mod289(Pi);        // To avoid truncation effects in permutation\n  vec4 ix = Pi.xzxz;\n  vec4 iy = Pi.yyww;\n  vec4 fx = Pf.xzxz;\n  vec4 fy = Pf.yyww;\n\n  vec4 i = permute(permute(ix) + iy);\n\n  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;\n  vec4 gy = abs(gx) - 0.5 ;\n  vec4 tx = floor(gx + 0.5);\n  gx = gx - tx;\n\n  vec2 g00 = vec2(gx.x,gy.x);\n  vec2 g10 = vec2(gx.y,gy.y);\n  vec2 g01 = vec2(gx.z,gy.z);\n  vec2 g11 = vec2(gx.w,gy.w);\n\n  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));\n  g00 *= norm.x;\n  g01 *= norm.y;\n  g10 *= norm.z;\n  g11 *= norm.w;\n\n  float n00 = dot(g00, vec2(fx.x, fy.x));\n  float n10 = dot(g10, vec2(fx.y, fy.y));\n  float n01 = dot(g01, vec2(fx.z, fy.z));\n  float n11 = dot(g11, vec2(fx.w, fy.w));\n\n  vec2 fade_xy = fade(Pf.xy);\n  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);\n  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);\n  return 2.3 * n_xy;\n}\n\nvec3 hsv(float h, float s, float v){\n\tvec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n\tvec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));\n\treturn v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);\n}\n\n// Ref: http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl\nvec3 hsv2rgb(vec3 c) {\n\tvec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\n\n// Ref: https://thebookofshaders.com/05/\nfloat plot(vec2 st, float pct){\n  return  smoothstep( pct-0.02, pct, st.y) -\n          smoothstep( pct, pct+0.02, st.y);\n}\n\n// Ref: https://thebookofshaders.com/10/\nfloat random (vec2 st) {\n\treturn fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);\n}\n\nfloat function(in float x, in vec2 uv) {\n\tfloat y = 0.;\n\t'.concat(e,"\n\treturn y;\n}\n\nvoid main() {\n\tvec2 uv = (gl_FragCoord.xy / resolution.xy) - offset;\n\tuv *= 2.5;\n\n\tvec3 color = vec3(0.0);\n\tvec3 white = vec3(1.0);\n\n\t// Plot\n\tfloat line = plot(uv, function(uv.x, uv));\n\tcolor = (1.0 - line) * color + line * white;\n\n\tgl_FragColor = vec4(color, 1.0);\n}")}var m=function(e){Object(v.a)(t,e);var n=Object(g.a)(t);function t(e){var i;return Object(s.a)(this,t),(i=n.call(this,e)).canvasRef=o.a.createRef(),i.nisgl=void 0,i.program=void 0,i.vartexShader=void 0,i.fragmentShader=void 0,i.startTime=0,i.time=0,i.state={fomula:""},i.draw=i.draw.bind(Object(x.a)(i)),i.resize=i.resize.bind(Object(x.a)(i)),i.handleChangeText=i.handleChangeText.bind(Object(x.a)(i)),i}return Object(l.a)(t,[{key:"componentDidMount",value:function(){var e,n=this.canvasRef.current;null!==n&&(this.canvasRef.current.width=n.clientWidth,this.canvasRef.current.height=n.clientHeight);var t=null===(e=this.canvasRef.current)||void 0===e?void 0:e.getContext("webgl");if(null!==t){if(this.nisgl=new f.NISGL(t),this.nisgl.clear(),this.vartexShader=this.nisgl.createShader(this.nisgl.context.VERTEX_SHADER),this.vartexShader.compile("\nattribute vec3 position;\n\nvoid main() {\n\tgl_Position = vec4(position, 1.0);\n}"),this.fragmentShader=this.nisgl.createShader(this.nisgl.context.FRAGMENT_SHADER),this.fragmentShader.compile(h("")),this.program=this.nisgl.createProgram(),null!==this.vartexShader&&null!==this.fragmentShader&&null!==this.program){this.program.linkProgram([this.vartexShader,this.fragmentShader]),this.nisgl.useProgram(this.program);var i=this.nisgl.createBuffer(),r=this.nisgl.createBuffer();i.createVertexPosition(new Float32Array([-1,1,0,1,1,0,-1,-1,0,1,-1,0])),r.createVertexIndex(new Int16Array([0,2,1,1,2,3])),null!==i&&null!==r&&(this.program.setAttribute("position",3,i),r.bindBuffer("index"),this.startTime=(new Date).getTime(),this.draw())}}else console.warn("Canvas did'nt  initalized or Something went wrong.")}},{key:"handleChangeText",value:function(e){var n=this;e.persist(),this.setState((function(n){return{fomula:e.target.value}}),(function(){try{var t,i,r=null===(t=n.nisgl)||void 0===t?void 0:t.context,o=null===(i=n.nisgl)||void 0===i?void 0:i.createShader(r.FRAGMENT_SHADER);null===o||void 0===o||o.compile(h(n.state.fomula)),(null===o||void 0===o?void 0:o.isCompiled)&&(r.detachShader(n.program.getProgram,n.fragmentShader.getShader()),n.fragmentShader=o,n.program.linkProgram([n.fragmentShader]),n.nisgl.useProgram(n.program))}catch(e){}}))}},{key:"resize",value:function(){var e=this.canvasRef.current.clientWidth,n=this.canvasRef.current.clientHeight;null!==e&&null!==n&&(this.canvasRef.current.width=e,this.canvasRef.current.height=n)}},{key:"draw",value:function(){var e,n,t,i,r,o,a=this.canvasRef.current,c=new Float32Array([1*a.clientWidth,1*a.clientHeight]);this.time=.001*((new Date).getTime()-this.startTime),null===(e=this.nisgl)||void 0===e||e.clear(),null===(n=this.nisgl)||void 0===n||n.context.viewport(0,0,a.clientWidth,a.clientHeight),null===(t=this.program)||void 0===t||t.setUniform("1f","time",this.time),null===(i=this.program)||void 0===i||i.setUniform("2fv","resolution",c),null===(r=this.nisgl)||void 0===r||r.context.drawElements(this.nisgl.context.TRIANGLES,6,this.nisgl.context.UNSIGNED_SHORT,0),null===(o=this.nisgl)||void 0===o||o.context.flush(),requestAnimationFrame(this.draw)}},{key:"render",value:function(){return Object(i.jsxs)("div",{className:"App",children:[Object(i.jsx)("canvas",{id:"webgl",ref:this.canvasRef}),Object(i.jsx)("div",{className:"params",children:Object(i.jsx)("textarea",{rows:4,cols:50,name:"fomula",placeholder:"y = sin(x);",onChange:this.handleChangeText,value:this.state.fomula})}),Object(i.jsx)("div",{className:"assignedParams",children:Object(i.jsxs)("p",{children:["Assigned Parameters:",Object(i.jsx)("br",{}),"float time - Count up the elapsed time (0.000)",Object(i.jsx)("br",{}),"float PI - (3.1415926);",Object(i.jsx)("br",{}),"vec2 uv - By default, it has been multiplied by 2.5",Object(i.jsx)("br",{}),Object(i.jsx)("br",{}),"Functions:",Object(i.jsx)("br",{}),Object(i.jsx)("a",{href:"https://github.com/Nismit/fomula-visualizer/blob/master/src/fragment.js#L33-L79",target:"_blank",rel:"noopener noreferrer",children:"float snoise(vec2 v)"}),Object(i.jsx)("br",{}),Object(i.jsx)("a",{href:"https://github.com/Nismit/fomula-visualizer/blob/master/src/fragment.js#L112-L149",target:"_blank",rel:"noopener noreferrer",children:"float cnoise(vec2 P)"}),Object(i.jsx)("br",{}),Object(i.jsx)("a",{href:"https://github.com/Nismit/fomula-visualizer/blob/master/src/fragment.js#L152-L189",target:"_blank",rel:"noopener noreferrer",children:"float pnoise(vec2 P, vec2 rep)"}),Object(i.jsx)("br",{})]})}),Object(i.jsxs)("footer",{children:["\xa9 Fomula Visualizer | Made by ",Object(i.jsx)("a",{href:"https://github.com/Nismit",target:"_blank",rel:"noopener noreferrer",children:"Nismit"})]})]})}}]),t}(o.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(Object(i.jsx)(m,{}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[16,1,2]]]);
//# sourceMappingURL=main.1d1982fe.chunk.js.map