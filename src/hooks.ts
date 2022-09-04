import { useEffect, useRef, useState } from "react";
import { NISGL, NISGLProgram, NISGLShader } from "nisgl-ts";
import Vertex from "./vertex";
import Fragment from "./fragment";
import { useEventListener } from "./useEventListener";

export const usePlot = () => {
  const nisgl = useRef<NISGL>();
  const vartexShader = useRef<NISGLShader>();
  const fragmentShader = useRef<NISGLShader>();
  const program = useRef<NISGLProgram | null>();
  const startTime = useRef(0);
  const time = useRef(0);
  const [fomula, setFomula] = useState<string>("y = x;");
  const [isCompiling, setIsCompiling] = useState(false);
  const [status, setStatus] = useState<string | undefined>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const resize = () => {
    if (!canvasRef.current) {
      return;
    }

    let devicePixelRatio = 1;

    if (window.devicePixelRatio > 1) {
      devicePixelRatio = window.devicePixelRatio;
    }

    canvasRef.current.width = canvasRef.current.clientWidth * devicePixelRatio;
    canvasRef.current.height =
      canvasRef.current.clientHeight * devicePixelRatio;
  };

  const onCompile = () => {
    if (!nisgl.current || !program.current || !fragmentShader.current) {
      return;
    }

    setIsCompiling(true);

    try {
      const gl = nisgl.current.context;
      const tempFragment = nisgl.current.createShader(gl.FRAGMENT_SHADER);
      tempFragment?.compile(Fragment(fomula));

      if (tempFragment?.isCompiled) {
        gl!.detachShader(
          program.current.getProgram,
          fragmentShader.current.getShader()
        );
        fragmentShader.current = tempFragment;
        program.current.linkProgram([fragmentShader.current]);
        nisgl.current.useProgram(program.current);

        setIsCompiling(false);
        setStatus("Compile Succeeded");
        setTimeout(() => {
          setStatus(undefined);
        }, 3000);
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }

      setIsCompiling(false);
      setStatus("Compile Error");
      setTimeout(() => {
        setStatus(undefined);
      }, 3000);
    }
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.persist();
    setFomula(e.currentTarget.value);
  };

  const draw = () => {
    if (canvasRef.current === null || !nisgl.current || !program.current) {
      console.warn("null or undefined");
      return;
    }

    const resolution: any = new Float32Array([
      canvasRef.current.width,
      canvasRef.current.height,
    ]);

    time.current = (new Date().getTime() - startTime.current) * 0.001;

    nisgl.current.clear();
    nisgl.current.context.viewport(0, 0, resolution[0], resolution[1]);

    const toFloatPixelRatio = window.devicePixelRatio * 1.0;

    program.current.setUniform(
      "1f",
      "pixelRatio",
      parseFloat(toFloatPixelRatio.toString())
    );
    program.current.setUniform("1f", "time", time.current);
    program.current.setUniform("2fv", "resolution", resolution);

    nisgl.current.context.drawElements(
      nisgl.current.context.TRIANGLES,
      6,
      nisgl.current.context.UNSIGNED_SHORT,
      0
    );
    nisgl.current.context.flush();

    requestAnimationFrame(draw);
  };

  useEffect(() => {
    if (canvasRef.current === null) {
      console.warn("canvasRef is null");
      return;
    }

    const gl: any = canvasRef.current?.getContext("webgl");

    if (gl === null) {
      console.warn(`Canvas didn't initalized or Something went wrong.`);
      return;
    }

    if (
      nisgl.current ||
      vartexShader.current ||
      fragmentShader.current ||
      program.current
    ) {
      return;
    }

    nisgl.current = new NISGL(gl);
    nisgl.current.clear();
    vartexShader.current = nisgl.current.createShader(
      nisgl.current.context.VERTEX_SHADER
    )!;
    vartexShader.current.compile(Vertex);
    fragmentShader.current = nisgl.current.createShader(
      nisgl.current.context.FRAGMENT_SHADER
    )!;
    fragmentShader.current.compile(Fragment(fomula));

    program.current = nisgl.current.createProgram();

    if (
      vartexShader.current === null ||
      fragmentShader.current === null ||
      program.current === null
    ) {
      console.warn("Vertex/Fragment or Program is something wrong");
      return;
    }

    program.current.linkProgram([vartexShader.current, fragmentShader.current]);
    nisgl.current.useProgram(program.current);

    const positionBuffer = nisgl.current.createBuffer()!;
    const indexBuffer = nisgl.current.createBuffer()!;
    positionBuffer.createVertexPosition(
      new Float32Array([
        -1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0,
      ])
    );

    indexBuffer.createVertexIndex(new Int16Array([0, 2, 1, 1, 2, 3]));

    if (positionBuffer === null || indexBuffer === null) {
      console.warn("position or index buffer is null");
      return;
    }

    program.current.setAttribute("position", 3, positionBuffer);
    indexBuffer.bindBuffer("index");

    startTime.current = new Date().getTime();
    draw();
    resize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef]);

  useEventListener("resize", resize);

  return {
    fomula,
    canvasRef,
    isCompiling,
    status,
    handleChangeText,
    onCompile,
  };
};
