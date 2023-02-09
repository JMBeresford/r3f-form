# r3f-form

### [View examples](https://jmberesford.github.io/r3f-form/?path=/story/form--default-submit-button)

> ## WARNING: UNDER HEAVY DEVELOPMENT
>
> Each release will aim to be a fully functional and usable release,
> but breaking API changes WILL be likely for the forseeable future.

## A webGL form component for use with React Three Fiber

![image](https://user-images.githubusercontent.com/1373954/210024281-c735f61a-1a69-45e5-a5d3-147ed57a6c30.png)

This package aims to create a fully-functional and **accessible** `<Form />`
components that can be used within the [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
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

> Note that each element in the form will require a `name` prop in order to be picked up in submission, just like in a normal DOM form element

The relevant inputs will be bound to respective DOM elements under the hood, and be rendered into the 3D scene like so:

![image](https://user-images.githubusercontent.com/1373954/212585376-295872dc-4da7-46d8-a2c8-3e2096a98923.png)

You can define submission behavior just like with any old HTML `<form>`:

```tsx
// redirect to a login script
<Form action="/login.php"></Form>;

// or handle it with a callback
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();

  const data = new FormData(e.target);

  for (let [name, value] of data.values()) {
    console.log(`${name}: ${value}`);
  }
};

<Form onSubmit={handleSubmit}></Form>;
```

## Inputs

An editable text-box bound to an DOM `<input>` and represented in the webGL canvas.

```ts
type Props = {
  type?: "text" | "password";

  /** width of the container */
  width?: number;
  backgroundColor?: Color;
  selectionColor?: Color;
  backgroundOpacity?: number;

  /** [left/right , top/bottom] in THREE units, respectively
   *
   * note that height is implicitly defined by the capHeight of the rendered
   * text. The cap height is dependant on both the `textProps.font` being used and the
   * `textProps.fontSize` value
   */
  padding?: Vector2;
  cursorWidth?: number;

  /** 3D transformations */
  position: Vector3;
  rotation: Euler;
  scale: Vector3;

  // And ALL props available to DOM <input>s
};
```

Create a basic input field like so:

```tsx
import { Input, Label } from "r3f-form";

export function MyInput() {
  return (
    <>
      <Label text="Test Input" />
      <Input />
    </>
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

export function MyInput() {
  const [username, setUsername] = React.useState("");
  // username will always contain the current value

  function handleChange(e) {
    setUsername(ev.target.value);
  }

  return (
    <>
      <Label text="Test Input" />
      <Input onChange={handleChange} />
    </>
  );
}
```

You can also create password inputs:

```tsx
import { Input, Label } from "r3f-form";

export function MyPassword() {
  return (
    <>
      <Label text="Test Password" />
      <Input type="password" />
    </>
  );
}
```

![image](https://user-images.githubusercontent.com/1373954/210022360-63ba745e-f4fa-49bc-b23d-623429c17809.png)

Add custom padding to the text container:

```tsx
import { Input, Label } from "r3f-form";

/*
 * padding: [horizontal padding, vertical padding] in THREE units
 */

export function MyInput() {
  return (
    <>
      <Label text="Test Padding" />
      <Input padding={[0.05, 0.5]} />
    </>
  );
}
```

![image](https://user-images.githubusercontent.com/1373954/210022684-93ebfa22-a93f-46e3-bdc6-44451a22578d.png)

---

## Textarea

```ts
type Props = {
  /** width of the container */
  width?: number;

  backgroundColor?: Color;
  backgroundOpacity?: number;
  selectionColor?: Color;

  /** [left/right , top/bottom] in THREE units, respectively
   *
   * note that height is implicitly defined by the capHeight of the rendered
   * text. The cap height is dependant on both the `textProps.font` being used
   * and the `textProps.fontSize` value
   */
  padding?: Vector2;
  cursorWidth?: number;

  /** 3D transformations */
  position: Vector3;
  rotation: Euler;
  scale: Vector3;

  // And ALL props available to DOM <textarea>s
};
```

Similar to the `<Input />` component, you can also create a `<Textarea />` like so:

```tsx
import { Textarea, Label } from "r3f-form";

export function App() {
  return (
    <>
      <Label text="Default Textarea:" />
      <Textarea />
    </>
  );
}
```

![image](https://user-images.githubusercontent.com/1373954/210699887-e0a5c165-d58b-4755-ae79-761d4ecf7f4e.png)

---

## Text

In order to configure the underlying `troika-three-text` instance
that is responsible for rendering the actual text, you can use the
`<Text />` component.

There is a respective `<Text />` component for both `<Input />`s and
`<Textarea />`s.

For all configuration options, check out the [troika docs](https://github.com/protectwise/troika/tree/main/packages/troika-three-text).

> Note that **not all** of troika's props are exposed on these `<Text />`
> components

Change color and background opacity:

```tsx
import { Input, Label } from "r3f-form";
import { Text } from "r3f-form/Input";

export function App() {
  return (
    <>
      <Label text="Test Color/Opacity" />
      <Input backgroundOpacity={0.6} backgroundColor="black">
        <Text color="#cfcfff" />
      </Input>
    </>
  );
}
```

![image](https://user-images.githubusercontent.com/1373954/210023633-448bcb2b-aff7-4108-b3c2-ccc5514fe59f.png)

If you wanted to alter both an `<Input />` and a
`<Textarea />` via their respective `<Text />` components
you could do the following:

```tsx
import { Input, Textarea, Label } from "r3f-form";
import { Text as InputText } from "r3f-form/Input";
import { Text as TextareaText } from "r3f-form/Textarea";

export function App() {
  return (
    <>
      <Label text="Test Color/Opacity" />
      <Input>
        <InputText color="#red" />
      </Input>

      <Label text="Test Textarea" />
      <Textarea>
        <TextareaText color="red" />
      </Textarea>
    </>
  );
}
```

---

## Submit

Equivalent to a DOM `<input type="submit" />`, exposed as
an independent component. By default it renders a button
using the following props:

```ts
type Props = {
  value?: string;
  fontSize?: number;
  width?: number;
  height?: number;
  color?: Color;
  backgroundColor?: Color;

  /** 3D transformations */
  position: Vector3;
  rotation: Euler;
  scale: Vector3;

  // And ALL props available to DOM <input>s
};
```

Add a simple submit button to your forms like so:

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
