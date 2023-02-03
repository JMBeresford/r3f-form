import React from "react";
import { storiesOf } from "@storybook/react";
import "./index.css";
import { Scene } from "./common";

import { Input, Label } from "../../src/";
import { Text } from "../../src/Input";

const stories = storiesOf("Input", module);

stories.add("Text Input", () => (
  <Scene lightColor="blue">
    <Label text="Label" />
    <Input />
  </Scene>
));

stories.add("Password Input", () => (
  <Scene lightColor="orange">
    <Label text="Password" />
    <Input type="password" />
  </Scene>
));

stories.add("Custom Padding", () => (
  <Scene lightColor="yellow">
    <Label position={[0, 0.1, 0]} text="Label" />
    <Input padding={[0.1, 0.1]} />
  </Scene>
));

stories.add("Custom Color/Opacity", () => (
  <Scene>
    <Label text="Custom Color/Opacity" />
    <Input backgroundOpacity={0.6} backgroundColor="black">
      <Text color="red" />
    </Input>
  </Scene>
));

stories.add("Adjustable Width", () => (
  <Scene lightColor="white">
    <group position={[-0.75 / 2, 0.1, 0]}>
      <Label text="Smol" />
      <Input width={1} />
    </group>

    <group position={[0, -0.2, 0]}>
      <Label text="Grande" />
      <Input width={1.75} />
    </group>
  </Scene>
));

stories.add("Initial Value", () => (
  <Scene>
    <Label text="Initial Value" />
    <Input defaultValue="Some placeholder text" />
  </Scene>
));

stories.add("Custom Font", () => (
  <Scene lightColor="red">
    <Label text="Custom Font" font="fonts/MajorMonoDisplay.ttf" />
    <Input>
      <Text font="fonts/PlayfairDisplay-Regular.ttf" />
    </Input>
  </Scene>
));

stories.add("Custom Cursor Width", () => (
  <Scene lightColor="grey">
    <group position-y={0.1}>
      <Label text="Regular" />
      <Input width={1.75} />
    </group>

    <group position-y={-0.2}>
      <Label text="Larger" />
      <Input width={1.75} cursorWidth={0.035} />
    </group>
  </Scene>
));
