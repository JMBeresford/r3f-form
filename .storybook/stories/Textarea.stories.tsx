import React from "react";
import { storiesOf } from "@storybook/react";
import "./index.css";
import { Scene } from "./common";

import { Textarea } from "../../src/components/Textarea";

const stories = storiesOf("Textarea", module);

stories.add("Default Textarea", () => (
  <Scene>
    <Textarea label="Default Textarea:" />
  </Scene>
));

stories.add("Custom Fonts", () => (
  <Scene lightColor="blue">
    <Textarea
      label="Custom Fonts:"
      textProps={{ font: "fonts/PlayfairDisplay-Regular.ttf" }}
      labelProps={{ font: "fonts/MajorMonoDisplay.ttf" }}
    />
  </Scene>
));
