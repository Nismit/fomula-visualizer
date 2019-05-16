import React from 'react';
import NISGL from './gl';
import Vertex from './vertex';
import Fragment from './fragment';
import './App.css';


const glPosition = new Float32Array(
  [
    -1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0
  ]
);
const glIndex = new Int16Array(
  [
    0, 2, 1,
    1, 2, 3
  ]
);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fomula: ''
    }

    this.canvas = React.createRef();
    this.nisgl = null;
    this.program = null;
    this.uniform = [];
    this.shaders = [];
    this.time = 0;
    this.startTime = 0;

    this.handleChangeText = this.handleChangeText.bind(this);
    this.resize = this.resize.bind(this);
    this.draw = this.draw.bind(this);
  }

  // Ref: https://stackoverflow.com/questions/49500255/warning-this-synthetic-event-is-reused-for-performance-reasons-happening-with
  handleChangeText(e) {
    e.persist();
    this.setState(prevState => ({
      fomula: e.target.value
    }), () => {

      const gl = this.nisgl.getGLContext();

      const tempVertex = this.nisgl.createShader(gl.VERTEX_SHADER, Vertex);
      const tempFragment = this.nisgl.createShader(gl.FRAGMENT_SHADER, Fragment(this.state.fomula));

      if (tempVertex && tempFragment) {
        this.shaders.forEach(shader => {
          gl.detachShader(this.program, shader);
        });

        this.shaders = [];
        this.shaders.push(tempVertex);
        this.shaders.push(tempFragment);

        this.program = this.nisgl.createProgram(this.shaders);

        this.uniform = [];
        this.uniform.push(gl.getUniformLocation(this.program, 'time'));
        this.uniform.push(gl.getUniformLocation(this.program, 'resolution'));

        const vertexPosition = this.nisgl.createBuffer(gl.ARRAY_BUFFER, glPosition);
        const vertexIndex = this.nisgl.createBuffer(gl.ELEMENT_ARRAY_BUFFER, glIndex);
        const vertexAttrLocation = gl.getAttribLocation(this.program, 'position');
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosition);
        gl.enableVertexAttribArray(vertexAttrLocation);
        gl.vertexAttribPointer(vertexAttrLocation, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndex);
        // console.log(gl.getParameter(gl.ARRAY_BUFFER_BINDING));
        // console.log(gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING));
      }

    });
  }

  componentDidMount() {
    const gl = this.canvas.current.getContext('webgl');
    this.nisgl = new NISGL(gl);

    this.shaders.push(this.nisgl.createShader(gl.VERTEX_SHADER, Vertex));
    this.shaders.push(this.nisgl.createShader(gl.FRAGMENT_SHADER, Fragment('')));

    this.program = this.nisgl.createProgram(this.shaders);

    this.uniform.push(gl.getUniformLocation(this.program, 'time'));
    this.uniform.push(gl.getUniformLocation(this.program, 'resolution'));

    const vertexPosition = this.nisgl.createBuffer(gl.ARRAY_BUFFER, glPosition);
    const vertexIndex = this.nisgl.createBuffer(gl.ELEMENT_ARRAY_BUFFER, glIndex);
    const vertexAttrLocation = gl.getAttribLocation(this.program, 'position');
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosition);
    gl.enableVertexAttribArray(vertexAttrLocation);
    gl.vertexAttribPointer(vertexAttrLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndex);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.startTime = new Date().getTime();
    this.resize();
    this.draw();
  }

  resize() {
    const displayWidth = this.canvas.current.clientWidth;
    const displayHeight = this.canvas.current.clientHeight;

    this.canvas.current.width = displayWidth;
    this.canvas.current.height = displayHeight;
  }

  draw() {
    const element = this.canvas.current;
    const height = element.clientHeight;
    const width = element.clientWidth;
    const gl = this.nisgl.getGLContext();

    this.time = (new Date().getTime() - this.startTime) * 0.001;

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, width, height);

    gl.uniform1f(this.uniform[0], this.time);
    gl.uniform2fv(this.uniform[1], [width, height]);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    gl.flush();

    requestAnimationFrame(this.draw);
  }

  render() {
    return (
      <div className="App">
        <canvas id="webgl" ref={this.canvas}></canvas>

        <div className="params">
          <textarea rows="4" cols="50" name="fomula" placeholder="y = sin(x);" onChange={this.handleChangeText} value={this.state.fomula} />
        </div>

        <div className="assignedParams">
          <p>
            Assigned Parameters:<br />
            float time - Count up the elapsed time (0.000)<br />
            float PI - (3.1415926);<br />
            vec2 uv - By default, it has been multiplied by 2.5<br />
            <br />
            Functions:<br />
            <a href="https://github.com/Nismit/fomula-visualizer/blob/master/src/fragment.js#L33-L79" target="_blank" rel="noopener noreferrer">float snoise(vec2 v)</a><br />
            <a href="https://github.com/Nismit/fomula-visualizer/blob/master/src/fragment.js#L112-L149" target="_blank" rel="noopener noreferrer">float cnoise(vec2 P)</a><br />
            <a href="https://github.com/Nismit/fomula-visualizer/blob/master/src/fragment.js#L152-L189" target="_blank" rel="noopener noreferrer">float pnoise(vec2 P, vec2 rep)</a><br />
          </p>
        </div>

        <footer>
          &copy; Fomula Visualizer | Made by <a href="https://github.com/Nismit" target="_blank" rel="noopener noreferrer">Nismit</a>
        </footer>
      </div>
    );
  }
}

export default App;
