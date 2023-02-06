# r3f-form

### [View examples](https://jmberesford.github.io/r3f-form/?path=/story/form--default-submit-button)

> ## WARNING: UNDER HEAVY DEVELOPMENT
>
> Each release will aim to be a fully functional and usable release,
> but breaking API changes WILL be likely for the forseeable future.

## A webGL form component for use with React Three Fiber

![image](https://user-images.githubusercontent.com/1373954/210024281-c735f61a-1a69-45e5-a5d3-147ed57a6c30.png)

This package aims to create a fully-functional and **accessible** `<Input />`
component that can be used within the [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
ecosystem. Ultimately, the goal is to have fully functioning HTML `<form>`s -- with all viable input types -- rendered in webGL.

Current implementation binds webGL elements to the existing state and event systems of respective
hidden HTML DOM elements. There is a heavy reliance on
[troika-three-text](https://github.com/protectwise/troika/tree/main/packages/troika-three-text)
for text-rendering and selection/caret logic.

> Note that `r3f-form` will only work within a React-Three-Fiber Canvas element.
> You **must** be using
>
> - [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
> - [@react-three/drei](https://github.com/pmndrs/drei)
> - [troika-three-text](https://github.com/protectwise/troika/tree/main/packages/troika-three-text)
>
> as dependencies in your project to use `r3f-form`.

### Install

```sh
npm install r3f-form
# or, if using yarn
yarn install r3f-form
```

# How to use

## Forms

In order to create a form, just wrap any relevant elements in a `<Form>`:
#TODO: Update image of form with correct form layout and information (Submit value)

```tsx
import { Form, Input, Label, Submit } from "r3f-form";

export function MyForm() {
  return (
    <Form>
      <Label text="Username" />
      <Input name="username" />

      <Label text="Password" />
      <Input name="password" type="password" />

      <Submit value="Login" />
    </Form>
  );
}
```

The relevant inputs will be bound to respective DOM elements under the hood, and be rendered into the 3D scene like so:
![image](https://user-images.githubusercontent.com/1373954/212585376-295872dc-4da7-46d8-a2c8-3e2096a98923.png)

You can define submission behavior just like with any old HTML `<form>`:

```tsx
// redirect to a login script
<Form action="/login.php"></Form>

// or handle it with a callback
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();

  const data = new FormData(e.target);

  . . .
}

<Form onSubmit={handleSubmit}></Form>
```

## Inputs

### Text/Password

#TODO: Update the prop list (Also remove troika props)?

```ts
type InputTextProps = {
  onChange?: (e: React.ChangeEvent) => void;
  label?: string;
  name?: string;

  /**
   * Props to pass to the underlying troika-three-text instance
   *
   * Most -- but not all -- of the props for troika-three-text are supported:
   * https://github.com/protectwise/troika/tree/master/packages/troika-3d-text
   */
  textProps?: TroikaTextProps;
  labelProps?: TroikaTextProps; // Same as `textProps` -- but for the label
  width?: number;
  backgroundColor?: Color;
  backgroundOpacity?: number;
  padding?: Vector2; // [left/right , top/bottom] in THREE units, respectively
};
```

Create a basic input field like so:

```tsx
import { Input, Label } from "r3f-form";

export function App() {
  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Label text="Test Input" />
      <Input />
    </Canvas>
  );
}
```

![image](https://user-images.githubusercontent.com/1373954/210022351-c5675ed3-bcf4-4b2c-bcf1-1963a0c030b7.png)

You can access the value of the input via the `onChange` callback prop:

> The callback is passed the `ChangeEvent` object from the underlying HTML `<input>`s
> change event on every change.
>
> Read more about this event [here](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event)

```tsx
import { Input, Label } from "r3f-form";

export function App() {
  const [username, setUsername] = React.useState("");

  // username will always contain the current value

  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Label text="Test Input" />
      <Input onChange={(ev) => setUsername(ev.target.value)} />
    </Canvas>
  );
}
```

You can also create password inputs:

```tsx
import { Input, Label } from "r3f-form";

export function App() {
  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Label text="Test Password" />
      <Input type="password" />
    </Canvas>
  );
}
```

![image](https://user-images.githubusercontent.com/1373954/210022360-63ba745e-f4fa-49bc-b23d-623429c17809.png)

Add custom padding to the text container:

```tsx
import { Input, Label } from "r3f-form";

/*
 * padding=[0.05, 0.5] -> 5% of width is used to pad left and right, 50% of height for top/bottom
 */

export function App() {
  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Label text="Test Padding" />
      <Input padding={[0.05, 0.5]} />
    </Canvas>
  );
}
```

![image](https://user-images.githubusercontent.com/1373954/210022684-93ebfa22-a93f-46e3-bdc6-44451a22578d.png)

Change color and background opacity:

```tsx
import { Input, Label } from "r3f-form";
import { Text } from "r3f-form/Input";

/*
 * backgroundOpacity defaults to 0.1
 */

export function App() {
  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Label text="Test Color/Opacity" />
      <Input backgroundOpacity={0.6} backgroundColor="black">
        <Text color="#cfcfff" />
      </Input>
    </Canvas>
  );
}
```

![image](https://user-images.githubusercontent.com/1373954/210023633-448bcb2b-aff7-4108-b3c2-ccc5514fe59f.png)
#TODO: Remove this bit about the underlying troika props?

> NOTE: The `textProps` and `labelProps` props can take _almost_ all of the properties that are supported
> by the underlying [troika-three-text](https://github.com/protectwise/troika/tree/main/packages/troika-three-text) mesh.

### Submit

#TODO: Update the prop list?

```ts
type SubmitProps = {
  value?: string;
  fontSize?: number;
  width?: number;
  height?: number;
  color?: Color;
  backgroundColor?: Color;

  // and any attributes that an HTML <input> takes
};
```

Add a simple submit button to your forms like so:
#TODO: Update image of form with correct form layout and information (Submit value)

```tsx
<Form>
  <Label text="Username" />
  <Input name="username" />

  <Label text="Password" />
  <Input name="password" type="password" />

  <Submit value="Submit" />
</Form>
```

![image](https://user-images.githubusercontent.com/1373954/212585376-295872dc-4da7-46d8-a2c8-3e2096a98923.png)

While this provides a somewhat-customizable default button, the main purpose of this component
is to provide a simple interface to use 3D elements to submit your forms. Any children passed in
will submit the form on click. For example:

```tsx
<Form>
  . . .
  <Submit value="submit">
    <MySubmitButton />
  </Submit>
</Form>
```

![image](https://user-images.githubusercontent.com/1373954/212590757-ef068ad0-bcb6-4db3-90e0-1bef3a279f9b.png)

Clicking on the big red button would submit the `<Form>`

---

## Textarea

#TODO: Update the prop list (Also remove troika props)?

```ts
type TextareaProps = {
  onChange?: (e: React.ChangeEvent) => void; // e.target.value contains the textarea's value
  rows?: number; // height of container in # of rows of text
  label?: string;
  name?: string;

  /**
   * Props to pass to the underlying troika-three-text instance
   *
   * Most -- but not all -- of the props for troika-three-text are supported:
   * https://github.com/protectwise/troika/tree/master/packages/troika-3d-text
   */
  textProps?: TroikaTextProps;
  labelProps?: TroikaTextProps; // Same as `textProps` -- but for the label
  width?: number; // width of the container in THREE units
  backgroundColor?: Color;
  backgroundOpacity?: number;
  padding?: Vector2; // [left/right , top/bottom] in THREE units, respectively
};
```

Similar to the `<Input />` component, you can also create a `<Textarea />` like so:

```tsx
import { Textarea, Label } from "r3f-form";

export function App() {
  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Label text="Default Textarea:" />
      <Textarea />
    </Canvas>
  );
}
```

![image](https://user-images.githubusercontent.com/1373954/210699887-e0a5c165-d58b-4755-ae79-761d4ecf7f4e.png)
