import * as React from "react";
import { Text as TextImpl, useMask } from "@react-three/drei";
import { Color } from "@react-three/fiber";

type Props = {
  characters?: string;
  color?: Color;
  fontSize?: number;
  maxWidth?: number;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: "left" | "right" | "center" | "justify";
  font?: string;
  anchorX?: number | "left" | "center" | "right";
  anchorY?: number | "top" | "top-baseline" | "middle" | "bottom-baseline" | "bottom";
  depthOffset?: number;
  outlineWidth?: number | string;
  outlineOffsetX?: number | string;
  outlineOffsetY?: number | string;
  outlineBlur?: number | string;
  outlineOpacity?: number;
  strokeWidth?: number | string;
  strokeOpacity?: number;
  fillOpacity?: number;
  debugSDF?: boolean;
  onSync?: (troika: unknown) => void;
  text?: string;
} & JSX.IntrinsicElements["mesh"];

const TextareaText = React.forwardRef((props: Props, ref) => {
  const {
    fontSize = 0.07,
    anchorX = "left",
    anchorY = "middle",
    depthOffset = 0.5,
    color = "black",
    text,
    ...restProps
  } = props;

  const stencil = useMask(2);

  return (
    <TextImpl
      ref={ref}
      {...restProps}
      fontSize={fontSize}
      anchorX={anchorX}
      anchorY={anchorY}
      depthOffset={depthOffset}
    >
      {text}
      <meshBasicMaterial color={color} toneMapped={false} {...stencil} />
    </TextImpl>
  );
});

TextareaText.displayName = "TextareaText";

export { TextareaText };
