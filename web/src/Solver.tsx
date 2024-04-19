import { FC } from "react";

import "./Solver.css";
import { SolveRowItem } from "./data/interface";

export type SolverProps = {
  name: string;
  size: "big" | "regular" | "small" | "tiny";
  cellItem?: SolveRowItem;
  onHover?: () => void;
  onLeave?: () => void;
};

const getInitials = (name: string): string => {
  return name
    .toLocaleUpperCase()
    .split(" ")
    .map((word) => word[0])
    .join("");
};

export const Solver: FC<SolverProps> = ({
  name,
  size,
  cellItem,
  onHover,
  onLeave,
}) => {
  const highlightClass =
    cellItem === "G" ? "green" : cellItem === "Y" ? "yellow" : "";
  return (
    <div
      className={`solver ${size} ${highlightClass}`}
      title={name}
      onMouseOver={onHover}
      onFocus={onHover}
      onMouseLeave={onLeave}
      onBlur={onLeave}
    >
      {getInitials(name)}
    </div>
  );
};
