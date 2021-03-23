import React from 'react';
import { NISGL, NISGLProgram, NISGLShader } from 'nisgl-ts';
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
  private vartexShader?: NISGLShader | null;
  private fragmentShader?: NISGLShader | null;
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
    this.vartexShader = this.nisgl.createShader(this.nisgl.context.VERTEX_SHADER)!;
    this.vartexShader.compile(Vertex);
    this.fragmentShader = this.nisgl.createShader(this.nisgl.context.FRAGMENT_SHADER)!;
    this.fragmentShader.compile(Fragment(''));

    this.program = this.nisgl.createProgram();

    if(this.vartexShader === null || this.fragmentShader === null || this.program === null) {
      return;
    }

    this.program.linkProgram([this.vartexShader, this.fragmentShader]);
    this.nisgl.useProgram(this.program);

    const positionBuffer = this.nisgl.createBuffer()!;
    const indexBuffer = this.nisgl.createBuffer()!;
    positionBuffer.createVertexPosition(
      new Float32Array([
        -1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0
      ])
    );

    indexBuffer.createVertexIndex(
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

    this.program.setAttribute('position', 3, positionBuffer);
    indexBuffer.bindBuffer('index');

    this.startTime = new Date().getTime();
    this.draw();
  }

  // Ref: https://stackoverflow.com/questions/49500255/warning-this-synthetic-event-is-reused-for-performance-reasons-happening-with
  handleChangeText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.persist();
    this.setState(prevState => ({
      fomula: e.target.value
    }), () => {
      try {
        const gl = this.nisgl?.context;
        const tempFragment = this.nisgl?.createShader(gl!.FRAGMENT_SHADER);
        tempFragment?.compile(Fragment(this.state.fomula));

        if(tempFragment?.isCompiled) {
          gl!.detachShader(this.program!.getProgram, this.fragmentShader!.getShader());
          this.fragmentShader = tempFragment;
          this.program!.linkProgram([this.fragmentShader]);
          this.nisgl!.useProgram(this.program!);
        }
      } catch(e) {
        // console.log(e.message);
      }
    });
  }

  resize() {
    const displayWidth = this.canvasRef.current!.clientWidth;
    const displayHeight = this.canvasRef.current!.clientHeight;

    if(displayWidth !== null && displayHeight !== null) {
      this.canvasRef.current!.width = displayWidth;
      this.canvasRef.current!.height = displayHeight;
    }
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
            <a href="https://github.com/Nismit/fomula-visualizer/blob/master/src/fragment.ts#L33-L79" target="_blank" rel="noopener noreferrer">float snoise(vec2 v)</a><br />
            <a href="https://github.com/Nismit/fomula-visualizer/blob/master/src/fragment.ts#L112-L149" target="_blank" rel="noopener noreferrer">float cnoise(vec2 P)</a><br />
            <a href="https://github.com/Nismit/fomula-visualizer/blob/master/src/fragment.ts#L152-L189" target="_blank" rel="noopener noreferrer">float pnoise(vec2 P, vec2 rep)</a><br />
          </p>
        </div>

        <footer>
          &copy; Fomula Visualizer | Made by <a href="https://github.com/Nismit" target="_blank" rel="noopener noreferrer">Nismit</a>
        </footer>
      </div>
    );
  }
}
