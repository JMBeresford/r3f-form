import React from "react";
import { storiesOf } from "@storybook/react";
import "./index.css";
import { Scene } from "./common";

import { Input } from "../../src/components/Input";

const stories = storiesOf("Input", module);

stories.add("Text Input", () => (
  <Scene lightColor="blue">
    <Input label="Text Input:" />
  </Scene>
));

stories.add("Password Input", () => (
  <Scene lightColor="orange">
    <Input position-y={0.1} label="Username:" />
    <Input position-y={-0.2} type="password" label="Password:" />
  </Scene>
));

stories.add("Custom Padding", () => (
  <Scene lightColor="yellow">
    <Input padding={[0.1, 0.1]} label="Label:" />
  </Scene>
));

stories.add("Custom Color/Opacity", () => (
  <Scene>
    <Input
      backgroundOpacity={0.6}
      backgroundColor="black"
      textProps={{ color: "#cfcfff" }}
      label="Test Color/Opacity"
    />
  </Scene>
));

stories.add("Adjustable Width", () => (
  <Scene lightColor="white">
    <Input position={[-0.75 / 2, 0.1, 0]} width={1} label="Smol:" />

    <Input position={[0, -0.2, 0]} width={1.75} label="Grande:" />
  </Scene>
));
