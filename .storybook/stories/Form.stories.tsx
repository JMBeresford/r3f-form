import React, { FormEvent } from "react";
import { storiesOf } from "@storybook/react";
import "./index.css";
import { Scene } from "./common";

import { Form, Input, Textarea, Label, Submit } from "../../src/";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { damp } from "three/src/math/MathUtils";
import { Group } from "three";

const stories = storiesOf("Form", module);

const handleSubmit = (e: FormEvent, ref) => {
  e.preventDefault();
  if (ref.current) {
    const data = new FormData(ref.current);

    let res = "";

    for (let [k, v] of data.entries()) {
      res += `${k}: ${v}\n`;
    }

    window.alert(res);
  }
};

stories.add("Default Submit Button", () => {
  const ref = React.useRef<HTMLFormElement>(null);

  return (
    <Scene lightColor="blue">
      <group position-y={0.2}>
        <Form ref={ref} onSubmit={(e) => handleSubmit(e, ref)}>
          <Label text="username" />
          <Input name="username" />

          <group position-y={-0.325}>
            <Label text="password" />
            <Input type="password" name="password" />
          </group>

          <Submit
            position={[0, -0.55, 0]}
            value="Login"
            backgroundColor="#AA99FF"
          />
        </Form>
      </group>
    </Scene>
  );
});

const Btn = () => {
  const btnRef = React.useRef<Group>(null);

  const [hovered, setHovered] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  useFrame((s, delta) => {
    if (btnRef.current) {
      let low = submitting ? 0.2 : 0.8;

      let y = hovered ? low : 1;
      btnRef.current.scale.y = damp(btnRef.current.scale.y, y, 12, delta);

      if (btnRef.current.scale.y === 0.2) {
        setSubmitting(false);
      }
    }
  });

  return (
    <group
      ref={btnRef}
      position={[0, -1, 0.25]}
      onPointerOver={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setSubmitting(false);
      }}
      onClick={() => setSubmitting(true)}
    >
      <Text
        color="#aa5566"
        renderOrder={5}
        fontSize={0.185}
        font="fonts/Montserrat-Bold.ttf"
        rotation-x={-Math.PI / 2}
        position-y={0.105}
      >
        Submit
      </Text>
      <mesh position={[0, 0.05, 0]} renderOrder={4}>
        <boxGeometry args={[1, 0.1, 0.5]} />
        <meshStandardMaterial color={"#ff7777"} />
      </mesh>
    </group>
  );
};

stories.add("Custom Submit Button", () => {
  const ref = React.useRef<HTMLFormElement>(null);

  return (
    <Scene lightColor="blue">
      <group position-z={-0.5}>
        <Form ref={ref} onSubmit={(e) => handleSubmit(e, ref)}>
          <Label text="Username" />
          <Input name="username" />

          <group position-y={-0.325}>
            <Label text="Password" />
            <Input type="password" name="password" />
          </group>

          <Submit value="submit" position={[0, 0, -0.5]}>
            <Btn />
          </Submit>
        </Form>
      </group>
    </Scene>
  );
});

stories.add("With Textarea", () => {
  const ref = React.useRef<HTMLFormElement>(null);

  return (
    <Scene lightColor="yellow">
      <group position={[0, 0.45, -0.2]}>
        <Form ref={ref} onSubmit={(e) => handleSubmit(e, ref)}>
          <Label text="First Name" />
          <Input name="fname" />

          <group position-y={-0.3}>
            <Label text="Last Name" />
            <Input name="lname" />
          </group>

          <group position-y={-0.6}>
            <Label text="Feedback" />
            <Textarea name="feedback" />
          </group>

          <Submit
            position={[0, -1.1, 0]}
            value="submit"
            backgroundColor="#DDFFAA"
          />
        </Form>
      </group>
    </Scene>
  );
});
