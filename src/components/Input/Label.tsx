import * as React from "react";
import { Text } from "@react-three/drei";
import { TroikaTextProps } from "types";

const Label = (props: TroikaTextProps) => {
  const { children, position, ...restProps } = props;
  return (
    <group position={position}>
      <Text anchorX="left" anchorY="bottom" {...restProps}>
        {children}
      </Text>
    </group>
  );
};

export default Label;
