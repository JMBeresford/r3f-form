import * as React from "react";
import { Form, Input, Textarea, Label, Submit } from "../../src";
import { Text as InputText } from "../../src/Input";
import { Text as TextAreaText } from "../../src/Textarea";
import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Group } from "three";
import { damp } from "../../src/utils";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const meta: Meta<typeof Form> = {
  component: Default,
  title: "Form",
};

export default meta;
type Story = StoryObj<typeof Form>;

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const data = new FormData(e.target as HTMLFormElement);

  let res = "";

  for (let [k, v] of data.entries()) {
    if (!v) return;
    res += `${k}: ${v}\n`;
  }

  window.alert(res);
  return res;
};

const submitAction = (event) => {
  action("form submitted")(handleSubmit(event));
};

function Default() {
  const ref = React.useRef<HTMLFormElement>(null);

  return (
    <group position-y={0.2}>
      <Form ref={ref} onSubmit={(e) => submitAction(e)}>
        <Label position-y={0.1} text="Username" />
        <Input name="username" />

        <group position-y={-0.325}>
          <Label position-y={0.1} text="Password" />
          <Input type="password" name="password" />
        </group>

        <Submit position={[0, -0.55, 0]} value="Login" backgroundColor="#AA99FF" />
      </Form>
    </group>
  );
}

function Button() {
  const btnRef = React.useRef<Group>(null);

  const [hovered, setHovered] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  useFrame((_, delta) => {
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
      onPointerDown={() => setSubmitting(true)}
      onPointerUp={() => setSubmitting(false)}
    >
      <Text
        color="#aa5566"
        renderOrder={5}
        fontSize={0.185}
        font="fonts/Poppins-Bold.ttf"
        rotation-x={-Math.PI / 2}
        position-y={0.105}
      >
        Login
      </Text>
      <mesh position={[0, 0.05, 0]} renderOrder={4}>
        <boxGeometry args={[1, 0.1, 0.5]} />
        <meshStandardMaterial color={"#ff7777"} />
      </mesh>
    </group>
  );
}

function WithCustomButton() {
  const ref = React.useRef<HTMLFormElement>(null);

  return (
    <group position-z={-0.5}>
      <Form ref={ref} onSubmit={(e) => submitAction(e)}>
        <Label position-y={0.1} text="Username" />
        <Input name="username" defaultValue={"jim"}>
          <InputText color="red" />
        </Input>

        <group position-y={-0.325}>
          <Label position-y={0.1} text="Password" />
          <Input type="password" name="password" />
        </group>

        <Submit value="submit" position={[0, 0, -0.5]}>
          <Button />
        </Submit>
      </Form>
    </group>
  );
}

function WithTextArea() {
  const ref = React.useRef<HTMLFormElement>(null);

  return (
    <group position-z={-0.5}>
      <Form ref={ref} onSubmit={(e) => submitAction(e)}>
        <group position-y={0.35}>
          <Label position-y={0.1} text="Username" />
          <Input name="username" />
        </group>

        <group position-y={0.05}>
          <Label position-y={0.1} text="Password" />
          <Input type="password" name="password" />
        </group>

        <group position-y={-0.25}>
          <Label position-y={0.1} text="Message" />
          <Textarea name="message" rows={2} />
        </group>
        <Submit value="submit" position={[0, 0, -0.5]}>
          <Button />
        </Submit>
      </Form>
    </group>
  );
}

export const DefaultStory: Story = {
  name: "Default",
  render: () => <Default />,
};

export const CustomButtonStory: Story = {
  name: "With Custom Button",
  render: () => <WithCustomButton />,
};

export const WithTextAreaStory: Story = {
  name: "With TextArea",
  render: () => <WithTextArea />,
};
