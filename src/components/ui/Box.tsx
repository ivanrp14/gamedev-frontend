import { useState } from "react";

export function Box({
  label,
  value,
  color = "blue",
  tooltip,
}: {
  label: string;
  value: string | JSX.Element;
  color?: "green" | "blue" | "red" | "yellow";
  tooltip?: string;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`box ${color}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: "relative" }}
    >
      <h3>{label}</h3>
      <p>{value}</p>
      {hover && tooltip && <div className="tooltip">{tooltip}</div>}
    </div>
  );
}
