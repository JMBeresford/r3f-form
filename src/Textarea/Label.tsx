import { Text } from "@react-three/drei";
import * as React from "react";
import { TroikaTextProps } from "types";

const Label = (props: TroikaTextProps) => {
  const { children, fontSize = 0.07, color = "black", ...restProps } = props;
  return (
    <Text
      fontSize={fontSize}
      color={color}
      anchorX="left"
      anchorY="bottom"
      {...restProps}
    >
      {children}
    </Text>
  );
};

export default Label;
