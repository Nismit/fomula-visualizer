import React from 'react';
import { NISGL, NISGLProgram } from 'nisgl-ts';
import Vertex from './vertex';
import Fragment from './fragment';

type Props = {}
interface State {
  fomula: string;
}

export default class App extends React.Component<Props, State> {
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private nisgl?: NISGL;
  private program?: NISGLProgram | null;
  private startTime: number = 0;
  private time: number = 0;

  constructor(props: Props) {
    super(props);

    this.draw = this.draw.bind(this);
    this.resize = this.resize.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
  }

  state: State = {
    fomula: ''
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    if(canvas !== null) {
      this.canvasRef.current!.width = canvas.clientWidth;
      this.canvasRef.current!.height = canvas.clientHeight;
    }

    const gl: any = this.canvasRef.current?.getContext('webgl');

    if(gl === null) {
      console.warn(`Canvas did'nt  initalized or Something went wrong.`);
      return;
    }

    this.nisgl = new NISGL(gl);
    this.nisgl.clear();
    const vertexShader = this.nisgl.createShader(this.nisgl.context.VERTEX_SHADER);
    vertexShader?.compile(Vertex);
    const fragmentShader = this.nisgl.createShader(this.nisgl.context.FRAGMENT_SHADER);
    fragmentShader?.compile(Fragment(''));

    this.program = this.nisgl.createProgram();

    if(vertexShader === null || fragmentShader === null || this.program === null) {
      return;
    }

    this.program.linkProgram([vertexShader, fragmentShader]);
    this.nisgl.useProgram(this.program);

    const positionBuffer = this.nisgl.createBuffer();
    const indexBuffer = this.nisgl.createBuffer();
    positionBuffer?.createVertexPosition(
      new Float32Array([
        -1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0
      ])
    );

    indexBuffer?.createVertexIndex(
      new Int16Array(
        [
          0, 2, 1,
          1, 2, 3
        ]
      )
    );

    if(positionBuffer === null || indexBuffer === null) {
      return;
    }

    this.program?.setAttribute('position', 3, positionBuffer);
    indexBuffer.bindBuffer('index');

    this.startTime = new Date().getTime();
    this.draw();
  }

  // Ref: https://stackoverflow.com/questions/49500255/warning-this-synthetic-event-is-reused-for-performance-reasons-happening-with
  handleChangeText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    console.log(value);

    // e.persist();
    // this.setState(prevState => ({
    //   fomula: e.target.value
    // }), () => {

    //   const gl = this.nisgl.getGLContext();

    //   const tempVertex = this.nisgl.createShader(gl.VERTEX_SHADER, Vertex);
    //   const tempFragment = this.nisgl.createShader(gl.FRAGMENT_SHADER, Fragment(this.state.fomula));

    //   if (tempVertex && tempFragment) {
    //     this.shaders.forEach(shader => {
    //       gl.detachShader(this.program, shader);
    //     });

    //     this.shaders = [];
    //     this.shaders.push(tempVertex);
    //     this.shaders.push(tempFragment);

    //     this.program = this.nisgl.createProgram(this.shaders);

    //     this.uniform = [];
    //     this.uniform.push(gl.getUniformLocation(this.program, 'time'));
    //     this.uniform.push(gl.getUniformLocation(this.program, 'resolution'));

    //     const vertexPosition = this.nisgl.createBuffer(gl.ARRAY_BUFFER, glPosition);
    //     const vertexIndex = this.nisgl.createBuffer(gl.ELEMENT_ARRAY_BUFFER, glIndex);
    //     const vertexAttrLocation = gl.getAttribLocation(this.program, 'position');
    //     gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosition);
    //     gl.enableVertexAttribArray(vertexAttrLocation);
    //     gl.vertexAttribPointer(vertexAttrLocation, 3, gl.FLOAT, false, 0, 0);
    //     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndex);
    //     // console.log(gl.getParameter(gl.ARRAY_BUFFER_BINDING));
    //     // console.log(gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING));
    //   }

    // });
  }

  resize() {
    // const displayWidth = this.canvasRef.current?.clientWidth;
    // const displayHeight = this.canvasRef.current?.clientHeight;

    // if(displayWidth !== null && displayHeight !== null) {
    //   this.canvasRef.current.width = displayWidth;
    //   this.canvasRef.current.height = displayHeight;
    // }
  }

  draw() {
    const canvas: any = this.canvasRef.current;
    const resolution:any = new Float32Array([canvas.clientWidth * 1.0, canvas.clientHeight * 1.0]);
    
    this.time = (new Date().getTime() - this.startTime) * 0.001;

    this.nisgl?.clear();
    this.nisgl?.context.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

    this.program?.setUniform('1f', 'time', this.time);
    this.program?.setUniform('2fv', 'resolution', resolution);

    this.nisgl?.context.drawElements(this.nisgl.context.TRIANGLES, 6, this.nisgl.context.UNSIGNED_SHORT, 0);
    this.nisgl?.context.flush();

    requestAnimationFrame(this.draw);
  }

  render() {
    return (
      <div className="App">
        <canvas id="webgl" ref={this.canvasRef}></canvas>

        <div className="params">
          <textarea rows={4} cols={50} name="fomula" placeholder="y = sin(x);" onChange={this.handleChangeText}  value={this.state.fomula} />
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
