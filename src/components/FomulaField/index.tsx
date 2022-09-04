import React from "react";

type Props = {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const FomulaField: React.FC<Props> = ({ value, onChange }) => (
  <div className="params">
    <textarea
      rows={4}
      cols={50}
      name="fomula"
      placeholder="y = sin(x);"
      onChange={onChange}
      value={value}
    />
  </div>
);
