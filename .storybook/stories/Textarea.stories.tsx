import * as React from "react";
import { Textarea, Label } from "../../src";
import { Text as TextareaText } from "../../src/Textarea";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Textarea> = {
  component: Default,
  title: "Textarea",
};

export default meta;
type Story = StoryObj<typeof Textarea>;

function Default() {
  return <Textarea />;
}

function WithLabel() {
  return (
    <group>
      <Label text="Username" position-y={0.1} />
      <Textarea />
    </group>
  );
}

function WithPlaceholder() {
  return <Textarea placeholder="What is your life story?" />;
}

function WithColor() {
  return (
    <group>
      <Label text="Username" position-y={0.1} color="blue" />
      <Textarea backgroundColor={"red"}>
        <TextareaText color="white" />
      </Textarea>
    </group>
  );
}

function WithCustomFont() {
  return (
    <group>
      <Label text="Username" position-y={0.1} font="fonts/PlayfairDisplay-Regular.ttf" />
      <Textarea>
        <TextareaText font="fonts/MajorMonoDisplay.ttf" />
      </Textarea>
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
