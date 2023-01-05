import * as React from "react";
import { Color } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";

type Props = {
  width: number;
  height: number;
  backgroundColor: Color;
  backgroundOpacity: number;
} & JSX.IntrinsicElements["mesh"];

const Container = (props: Props) => {
  const { width, height, backgroundColor, backgroundOpacity, ...restProps } =
    props;

  const [hovered, setHovered] = React.useState(false);
  useCursor(hovered, "text");

  return (
    <mesh
      {...restProps}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      renderOrder={1}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        color={backgroundColor}
        transparent
        opacity={backgroundOpacity}
        depthWrite={false}
      />
    </mesh>
  );
};

export default Container;
