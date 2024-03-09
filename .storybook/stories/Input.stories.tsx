import * as React from "react";
import { Input, Label } from "../../src";
import { Text as InputText } from "../../src/Input";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Input> = {
  component: Default,
  title: "Input",
};

export default meta;
type Story = StoryObj<typeof Input>;

function Default() {
  return <Input />;
}

function WithLabel() {
  return (
    <group>
      <Label text="Username" position-y={0.1} />
      <Input />
    </group>
  );
}

function WithPlaceholder() {
  return <Input placeholder="Username" />;
}

function WithColor() {
  return (
    <group>
      <Label text="Username" position-y={0.1} color="blue" />
      <Input backgroundColor={"red"}>
        <InputText color="white" />
      </Input>
    </group>
  );
}

function WithCustomFont() {
  return (
    <group>
      <Label text="Username" position-y={0.1} font="fonts/PlayfairDisplay-Regular.ttf" />
      <Input>
        <InputText font="fonts/MajorMonoDisplay.ttf" />
      </Input>
    </group>
  );
}

export const DefaultStory: Story = {
  name: "Default",
  render: () => <Default />,
};

export const WithLabelStory: Story = {
  name: "With Label",
  render: () => <WithLabel />,
};

export const WithPlaceholderStory: Story = {
  name: "With Placeholder",
  render: () => <WithPlaceholder />,
};

export const WithColorStory: Story = {
  name: "With Color",
  render: () => <WithColor />,
};

export const WithCustomFontStory: Story = {
  name: "With Custom Font",
  render: () => <WithCustomFont />,
};
