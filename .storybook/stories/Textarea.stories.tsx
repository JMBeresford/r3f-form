import React from "react";
import { storiesOf } from "@storybook/react";
import "./index.css";
import { Scene } from "./common";

import { Textarea, Label } from "../../src/";
import { Text } from "../../src/Textarea";

const stories = storiesOf("Textarea", module);

stories.add("Default Textarea", () => (
  <Scene>
    <Label text="Default Textarea:" />
    <Textarea />
  </Scene>
));

stories.add("Custom Fonts", () => (
  <Scene lightColor="blue">
    <Label text="Custom Fonts" font="fonts/MajorMonoDisplay.ttf" />
    <Textarea>
      <Text font="fonts/PlayfairDisplay-Regular.ttf" />
    </Textarea>
  </Scene>
));

stories.add("Custom Cursor Width", () => (
  <Scene lightColor="blue">
    <Label text="Cursor Width" />
    <Textarea cursorWidth={0.025} />
  </Scene>
));

stories.add("More rows", () => (
  <Scene lightColor="blue">
    <Label text="More Rows" />
    <Textarea rows={6} />
  </Scene>
));
