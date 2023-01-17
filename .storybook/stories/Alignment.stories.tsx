import React from "react";
import { storiesOf } from "@storybook/react";
import "./index.css";
import { Scene } from "./common";

import { Input } from "../../src/components/Input";
import { Textarea } from "../../src/components/Textarea";
import { Vector2 } from "@react-three/fiber";

const stories = storiesOf("Alignment", module);

stories.add("Vertical Alignment Input/Textarea", () => {
  const padding: Vector2 = [0.01, 0.01];
  const fontSize = 0.1;

  return (
    <Scene lightColor="blue">
      <mesh position-y={fontSize / 2 + padding[1]}>
        <planeGeometry args={[2, 0.001]} />
        <meshBasicMaterial color="red" />
      </mesh>

      <mesh position-y={-fontSize / 2}>
        <planeGeometry args={[2, 0.001]} />
        <meshBasicMaterial color="red" />
      </mesh>

      <Input
        label="Text Input:"
        width={1}
        position-x={-0.51}
        padding={padding}
        textProps={{ fontSize: fontSize }}
      />
      <Textarea
        label="Text Input:"
        width={1}
        rows={6}
        position-x={0.51}
        padding={padding}
        textProps={{ fontSize: fontSize }}
      />
    </Scene>
  );
});
