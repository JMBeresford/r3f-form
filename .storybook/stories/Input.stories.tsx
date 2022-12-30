import React from "react";
import { storiesOf } from "@storybook/react";
import "./index.css";

import { Input } from "../../src/components/Input";
import { Canvas } from "@react-three/fiber";
import { Float, PresentationControls, Sphere } from "@react-three/drei";

const stories = storiesOf("Input", module);

stories.add("Text Input", () => (
  <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 1] }}>
    <PresentationControls global={true} snap={true} cursor={false}>
      <Input labelProps={{ label: "Test Input" }} />
    </PresentationControls>
  </Canvas>
));

stories.add("Password Input", () => (
  <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 1] }}>
    <PresentationControls global={true} snap={true} cursor={false}>
      <Input type="password" labelProps={{ label: "Test Password" }} />
    </PresentationControls>
  </Canvas>
));

stories.add("Custom Padding", () => (
  <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 1] }}>
    <PresentationControls global={true} snap={true} cursor={false}>
      <Input padding={[0.05, 0.5]} labelProps={{ label: "Test Padding" }} />
    </PresentationControls>
  </Canvas>
));

stories.add("Custom Color/Opacity", () => (
  <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 1] }}>
    <PresentationControls
      global={true}
      snap={true}
      cursor={false}
      rotation={[0, 0.25, 0]}
    >
      <pointLight position={[0, 2, 0]} intensity={2} />
      <ambientLight intensity={0.35} />
      <Float>
        <Sphere args={[0.2, 20, 20]} position={[0.2, 0, -0.3]}>
          <meshPhongMaterial color="red" />
        </Sphere>
      </Float>
      <Input
        backgroundOpacity={0.6}
        backgroundColor="black"
        textProps={{ color: "#cfcfff" }}
        labelProps={{ label: "Test Color/Opacity" }}
      />
    </PresentationControls>
  </Canvas>
));
