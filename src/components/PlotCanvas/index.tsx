import React from "react";

export const PlotCanvas = React.forwardRef<HTMLCanvasElement>((_, ref) => (
  <canvas id="webgl" ref={ref}></canvas>
));
