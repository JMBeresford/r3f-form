import React from "react";
import { storiesOf } from "@storybook/react";
import "./index.css";
import { Scene } from "./common";

import { Input, Textarea, Label } from "../../src";
import { Text as InputText } from "../../src/Input";
import { Text as TextareaText } from "../../src/Textarea";
import { Vector2 } from "@react-three/fiber";

const stories = storiesOf("Alignment", module);

stories.add("Vertical Alignment Input/Textarea", () => {
  const padding: Vector2 = [0.01, 0.01];
  const fontSize = 0.1;

  return (
    <Scene lightColor="blue">
      <group position-z={0.25}>
        <mesh position-y={fontSize / 2 + padding[1]}>
          <planeGeometry args={[2, 0.0025]} />
          <meshBasicMaterial color="red" />
        </mesh>

        <mesh position-y={-fontSize / 2}>
          <planeGeometry args={[2, 0.0025]} />
          <meshBasicMaterial color="red" />
        </mesh>

        <group position-x={-0.51}>
          <Label text="label" />
          <Input width={1} padding={padding}>
            <InputText fontSize={fontSize} />
          </Input>
        </group>
        <group position-x={0.51}>
          <Label text="label" />
          <Textarea width={1} rows={6} padding={padding}>
            <TextareaText fontSize={fontSize} />
          </Textarea>
        </group>
      </group>
    </Scene>
  );
});
