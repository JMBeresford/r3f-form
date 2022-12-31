import React from "react";
import { storiesOf } from "@storybook/react";
import "./index.css";

import { Input } from "../../src/components/Input";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, PresentationControls, Sphere } from "@react-three/drei";
import { clamp, damp } from "three/src/math/MathUtils";

const stories = storiesOf("Input", module);

export const parameters = {
  options: {
    showPanel: false,
  },
};

const Rig = () => {
  const camera = useThree((s) => s.camera);
  const viewport = useThree((s) => s.viewport);

  useFrame(({ mouse }, delta) => {
    let { x, y } = mouse;
    let [rx, ry] = [camera.rotation.x, camera.rotation.y];
    let lambda = 12;

    if (camera) {
      camera.rotation.x = damp(rx, y * 0.05, lambda, delta);
      camera.rotation.y = damp(ry, -x * 0.05, lambda, delta);

      if (viewport.width) {
        let w = clamp(viewport.width, 0.75, 3);
        camera.position.z = 3 / w;
      }
    }
  });

  return <></>;
};

const Scene = ({ sphereColor = "red", children }) => (
  <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 1.5], fov: 65 }}>
    <PresentationControls
      global={true}
      snap={true}
      cursor={false}
      rotation={[0, 0.125, 0]}
    >
      <pointLight position={[0, 2, 0]} intensity={2} />
      <ambientLight intensity={0.35} />
      <Float>
        <Sphere args={[0.2, 20, 20]} position={[0.2, 0, -0.3]}>
          <meshPhongMaterial color={sphereColor} />
        </Sphere>
      </Float>
      <Rig />

      {children}
    </PresentationControls>
  </Canvas>
);

stories.add("Text Input", () => (
  <Scene sphereColor="blue">
    <Input labelProps={{ label: "Text Input:" }} />
  </Scene>
));

stories.add("Password Input", () => (
  <Scene sphereColor="orange">
    <Input position-y={0.1} labelProps={{ label: "Username:" }} />
    <Input
      position-y={-0.2}
      type="password"
      labelProps={{ label: "Password:" }}
    />
  </Scene>
));

stories.add("Custom Padding", () => (
  <Scene sphereColor="yellow">
    <Input padding={[0.1, 1]} labelProps={{ label: "Label:" }} />
  </Scene>
));

stories.add("Custom Color/Opacity", () => (
  <Scene>
    <Input
      backgroundOpacity={0.6}
      backgroundColor="black"
      textProps={{ color: "#cfcfff" }}
      labelProps={{ label: "Test Color/Opacity" }}
    />
  </Scene>
));

stories.add("Adjustable Width", () => (
  <Scene sphereColor="white">
    <Input
      position={[-0.75 / 2, 0.1, 0]}
      width={1}
      labelProps={{ label: "Smol:" }}
    />

    <Input
      position={[0, -0.2, 0]}
      width={1.75}
      labelProps={{ label: "Grande:" }}
    />
  </Scene>
));
