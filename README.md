# r3f-input

> ## WARNING: UNDER HEAVY DEVELOPMENT
> Each release will aim to be a fully functional and usable release,
> but breaking API changes WILL be likely for the forseeable future.

## A webGL input field component for use with React Three Fiber

This package aims to create a fully-functional and **accessible** `<Input />`
component that can be used within the [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
ecosystem. Ultimately, the goal is fully support the entirety of the existing HTML `<form>` spec.

Current implementation of `<Input />` binds webGL elements to the existing state and event systems of a
hidden HTML `<input>` element. There is a heavy reliance on
[troika-three-text](https://github.com/protectwise/troika/tree/main/packages/troika-three-text)
for text-rendering and selection/caret logic.

> Note that `r3f-input` will only work within a React-Three-Fiber Canvas element.
> You **must** be using
> - [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
> - [@react-three/drei](https://github.com/pmndrs/drei)
> - [troika-three-text](https://github.com/protectwise/troika/tree/main/packages/troika-three-text)
>
> as dependencies in your project to use `r3f-input`.

### Install
```sh
npm install @jberesford/r3f-input
# or, if using yarn
yarn install @jberesford/r3f-input
```

## How to use

Create a basic input field like so:

```jsx
import { Input } from '@jberesford/r3f-input';

export function App() {
  return (
    <Canvas camera={{position: [0,0,1]}}>
      <Input labelParams={{label: "Test Input"}} />
    </Canvas>
  )
}
```
![image](https://user-images.githubusercontent.com/1373954/210022351-c5675ed3-bcf4-4b2c-bcf1-1963a0c030b7.png)

You can access the value of the input via the `onChange` callback prop:

> The callback is passed the `ChangeEvent` object from the underlying HTML `<input>`s
> change event on every change.
>
> Read more about this event [here](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event)


```jsx
import { Input } from '@jberesford/r3f-input';

export function App() {

  const [username, setUsername] = React.useState("");
  
  // username will always contain the current value

  return (
    <Canvas camera={{position: [0,0,1]}}>
      <Input
        onChange={(ev) => setUsername(ev.target.value)}
        labelParams={{label: "Test Input"}}
      />
    </Canvas>
  )
}
```

You can also create password inputs:

```jsx
import { Input } from '@jberesford/r3f-input';

export function App() {
  return (
    <Canvas camera={{position: [0,0,1]}}>
      <Input type="password" labelParams={{label: "Test Password"}} />
    </Canvas>
  )
}
```
![image](https://user-images.githubusercontent.com/1373954/210022360-63ba745e-f4fa-49bc-b23d-623429c17809.png)

Add custom padding to the text container:
```jsx
import { Input } from '@jberesford/r3f-input';

/*
* padding=[0.05, 0.5] -> 5% of width is used to pad left and right, 50% of height for top/bottom
*/

export function App() {
  return (
    <Canvas camera={{position: [0,0,1]}}>
      <Input padding={[0.05, 0.5]} labelParams={{label: "Test Password"}} />
    </Canvas>
  )
}
```
![image](https://user-images.githubusercontent.com/1373954/210022684-93ebfa22-a93f-46e3-bdc6-44451a22578d.png)

Change color and background opacity:
```jsx
import { Input } from '@jberesford/r3f-input';

/*
* backgroundOpacity defaults to 0.1
*/

export function App() {
  return (
    <Canvas camera={{position: [0,0,1]}}>
      <Input
        backgroundOpacity={0.6}
        backgroundColor="black"
        textProps={{ color: "#cfcfff" }}
        labelProps={{ label: "Test Color/Opacity" }}
      />
    </Canvas>
  )
}
```
![image](https://user-images.githubusercontent.com/1373954/210023633-448bcb2b-aff7-4108-b3c2-ccc5514fe59f.png)

> NOTE: The `textProps` and `labelProps` props can take *almost* all of the properties that are supported
> by the underlying [troika-three-text](https://github.com/protectwise/troika/tree/main/packages/troika-three-text) mesh.
