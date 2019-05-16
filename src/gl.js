// https://webglfundamentals.org/webgl/lessons/ja/webgl-shaders-and-glsl.html

class NISGL {
  constructor(gl) {
    this._gl = gl;
  }

  getGLContext() {
    return this._gl;
  }

  createShader(type, source) {
    const gl = this._gl;
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      return null;
    }
  }

  createProgram(shaders) {
    const gl = this._gl;
    const program = gl.createProgram();

    shaders.forEach(shader => {
      gl.attachShader(program, shader);
    });

    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.useProgram(program);
      return program;
    } else {
      return null;
    }
  }

  createBuffer(type, data) {
    const gl = this._gl;
    const buffer = gl.createBuffer();

    // param = new Float32Array(data)
    // param = new Int16Array(data)

    gl.bindBuffer(type, buffer);
    gl.bufferData(type, data, gl.STATIC_DRAW);
    gl.bindBuffer(type, null);

    return buffer;
  }
}

export default NISGL;
