import React from "react";
import { storiesOf } from "@storybook/react";
import "./index.css";

import { Input } from "../../src/components/Input";
import { Canvas } from "@react-three/fiber";
import { PresentationControls } from "@react-three/drei";

const stories = storiesOf("Input", module);

stories.add("Input", () => (
  <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 1] }}>
    <PresentationControls global={true} snap={true} cursor={false}>
      <Input labelProps={{ label: "Test Input" }} type="text" />
    </PresentationControls>
  </Canvas>
));
