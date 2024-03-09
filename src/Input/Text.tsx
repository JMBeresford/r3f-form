import * as React from "react";
import { Text as TextImpl, useMask } from "@react-three/drei";
import { Color } from "@react-three/fiber";
import { TextRenderInfo } from "troika-three-text";

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
  overflowWrap?: "normal" | "break-word";
  outlineWidth?: number | string;
  outlineOffsetX?: number | string;
  outlineOffsetY?: number | string;
  outlineBlur?: number | string;
  outlineOpacity?: number;
  strokeWidth?: number | string;
  strokeOpacity?: number;
  fillOpacity?: number;
  debugSDF?: boolean;
  onSync?: (troika: { textRenderInfo: TextRenderInfo }) => void;
  text?: string;
} & JSX.IntrinsicElements["mesh"];

const InputText = React.forwardRef((props: Props, ref) => {
  const {
    fontSize = 0.07,
    anchorX = "left",
    anchorY = "middle",
    depthOffset = 0.5,
    color = "black",
    text,
    children,
    ...restProps
  } = props;

  const localRef = React.useRef<typeof TextImpl>(null);
  React.useImperativeHandle(ref, () => localRef.current);
  const stencil = useMask(1);

  return (
    <TextImpl
      ref={localRef}
      {...restProps}
      fontSize={fontSize}
      anchorX={anchorX}
      anchorY={anchorY}
      depthOffset={depthOffset}
      whiteSpace="nowrap"
    >
      <meshBasicMaterial color={color} toneMapped={false} {...stencil} />
      {children}
      {text}
    </TextImpl>
  );
});

InputText.displayName = "InputText";

export { InputText };
