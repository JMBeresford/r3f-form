import * as React from "react";
import { Color } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Input } from "../Input";

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
  anchorY?:
    | number
    | "top"
    | "top-baseline"
    | "middle"
    | "bottom-baseline"
    | "bottom";
  depthOffset?: number;
  overflowWrap?: "normal" | "break-word";
  whiteSpace?: "normal" | "overflowWrap" | "nowrap";
  outlineWidth?: number | string;
  outlineOffsetX?: number | string;
  outlineOffsetY?: number | string;
  outlineBlur?: number | string;
  outlineOpacity?: number;
  strokeWidth?: number | string;
  strokeOpacity?: number;
  fillOpacity?: number;
  debugSDF?: boolean;
  text?: string;
} & JSX.IntrinsicElements["mesh"];

const Label = (props: Props) => {
  const {
    color = "black",
    text,
    anchorX = "center",
    anchorY = "bottom-baseline",
    fontSize = 0.07,
    ...restProps
  } = props;

  const [offsetY, setOffsetY] = React.useState<number>(0);

  return (
    <>
      <group position-y={offsetY}>
        <Text
          anchorX={anchorX}
          anchorY={anchorY}
          fontSize={fontSize}
          {...restProps}
          onSync={({ textRenderInfo }) => {
            if (textRenderInfo) {
              setOffsetY(textRenderInfo.lineHeight * 1.2);
            }
          }}
        >
          {text}
          <meshBasicMaterial color={color} />
        </Text>
      </group>
    </>
  );
};

export { Label };
