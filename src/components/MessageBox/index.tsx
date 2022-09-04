import React from "react";

export const MessageBox: React.FC = React.memo(() => (
  <div className="assignedParams">
    <p>
      Assigned Parameters:
      <br />
      float time - Count up the elapsed time (0.000)
      <br />
      float PI - (3.1415926);
      <br />
      <br />
      Functions:
      <br />
      <a
        href="https://github.com/Nismit/fomula-visualizer/blob/master/src/fragment.ts#L33-L79"
        target="_blank"
        rel="noopener noreferrer"
      >
        float snoise(vec2 v)
      </a>
      <br />
      <a
        href="https://github.com/Nismit/fomula-visualizer/blob/master/src/fragment.ts#L112-L149"
        target="_blank"
        rel="noopener noreferrer"
      >
        float cnoise(vec2 P)
      </a>
      <br />
      <a
        href="https://github.com/Nismit/fomula-visualizer/blob/master/src/fragment.ts#L152-L189"
        target="_blank"
        rel="noopener noreferrer"
      >
        float pnoise(vec2 P, vec2 rep)
      </a>
      <br />
    </p>
  </div>
));
