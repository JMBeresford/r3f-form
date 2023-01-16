import { Color } from "@react-three/fiber";

export type TroikaTextProps = {
  color?: Color;
  fontSize?: number;
  letterSpacing?: number;
  font?: string;
  depthOffset?: number;
  outlineWidth?: number | string;
  outlineOffsetX?: number | string;
  outlineOffsetY?: number | string;
  outlineBlur?: number | string;
  outlineColor?: Color;
  outlineOpacity?: number;
  strokeWidth?: number | string;
  strokeColor?: Color;
  strokeOpacity?: number;
  fillOpacity?: number;
  fillColor?: Color;
  onSync?: (troika: any) => void;
} & Omit<JSX.IntrinsicElements["mesh"], "ref" | "type">;
