import * as React from "react";
import { useCursor } from "@react-three/drei";
import { Color, Vector2 } from "@react-three/fiber";
import { useState, Ref, ChangeEvent, forwardRef } from "react";
import Label from "./Label";
import Text from "./Text";
import { Vector2 as Vector2Impl } from "three";
import { TroikaTextProps } from "types";

export type Props = {
  /**
   * Optional ChangeEventHandler that is called when the <input> element changes.
   * Usually used to get the input's text value for form submission.
   *
   * @example
   * // log out the input's text value
   * <Input onChange={(e: ChangeEvent) => { console.log(e.target.value) }} />
   */
  onChange?: (e: ChangeEvent) => void;

  label?: string;

  /** setting this to password will mask the characters with dots */
  type?: "text" | "password";

  /**
   * Props to pass to the underlying troika-three-text instance
   *
   * Most -- but not all -- of the props for troika-three-text are supported:
   * https://github.com/protectwise/troika/tree/master/packages/troika-3d-text
   */
  textProps?: TroikaTextProps;

  /** Same as `textProps` -- but the text content is explicitly set here */
  labelProps?: TroikaTextProps;

  /** width of the container */
  width?: number;

  backgroundColor?: Color;
  backgroundOpacity?: number;

  /** [left/right , top/bottom] in THREE units, respectively
   *
   * note that height is implicitly defined by the capHeight of the rendered
   * text. The cap height is dependant on both the `textProps.font` being used and the
   * `textProps.fontSize` value
   */
  padding?: Vector2;
} & Omit<JSX.IntrinsicElements["group"], "ref" | "type">;

/**
 * An Input field that is rendered in the canvas and bound
 * to a hidden HTML <\input\> element.
 */
const Input = forwardRef((props: Props, ref: Ref<HTMLInputElement>) => {
  const {
    onChange,
    type = "text",
    label,
    textProps,
    labelProps,
    width = 1.5,
    backgroundColor = "lightgrey",
    backgroundOpacity = 0.3,
    padding,
    ...restProps
  } = props;

  const [hovered, setHovered] = useState(false);
  useCursor(hovered, "text");

  // handle text defaults
  const fontSize = textProps?.fontSize || 0.0825;
  const fontColor = textProps?.color || "black";

  let _padding = React.useMemo(() => new Vector2Impl(0.02, 0.05), []);

  if (padding && (Array.isArray(padding) || ArrayBuffer.isView(padding))) {
    _padding.set(padding[0], padding[1]);
  } else {
    _padding.set(0.02, 0.05);
  }
  const height = fontSize + _padding.y;

  // handle label defaults
  const labelSize = labelProps?.fontSize || 0.07;
  const labelColor = labelProps?.color || "black";

  return (
    <group {...restProps}>
      <group position={[-width / 2, height / 1.8, 0]}>
        <Label color={labelColor} fontSize={labelSize} {...labelProps}>
          {label}
        </Label>
      </group>
      <Text
        ref={ref}
        width={width}
        padding={_padding}
        height={height}
        onChange={onChange}
        type={type}
        fontSize={fontSize}
        color={fontColor}
        {...textProps}
      />

      <mesh
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        renderOrder={1}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          color={backgroundColor}
          transparent
          opacity={backgroundOpacity}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
});

Input.displayName = "Input";

export { Input };
