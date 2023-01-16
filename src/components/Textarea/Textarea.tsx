import * as React from "react";
import { TroikaTextProps } from "types";
import { Color, Vector2 } from "@react-three/fiber";
import { Vector2 as Vector2Impl } from "three";
import Label from "./Label";
import Text from "./Text";

type GroupProps = Omit<JSX.IntrinsicElements["group"], "ref" | "type">;

type TextareaProps = {
  /**
   * Optional ChangeEventHandler that is called when the <input> element changes.
   * Usually used to get the input's text value for form submission.
   *
   * @example
   * // log out the input's text value
   * <Input onChange={(e: ChangeEvent) => { console.log(e.target.value) }} />
   */
  onChange?: (e: React.ChangeEvent) => void;

  /**
   * vertical size of container in rows that are of height `fontSize`
   *
   * @default 4
   */
  rows?: number;

  label?: string;
  name?: string;

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
  cursorWidth?: number;
};

type Props = TextareaProps & GroupProps;

const Textarea = React.forwardRef(
  (props: Props, ref: React.Ref<HTMLTextAreaElement>) => {
    const {
      onChange,
      rows = 4,
      label,
      name,
      textProps,
      labelProps,
      width = 1.5,
      backgroundColor = "lightgrey",
      backgroundOpacity = 0.3,
      padding,
      cursorWidth,
      ...restProps
    } = props;

    const fontSize = textProps?.fontSize || 0.0825;
    let _padding = React.useMemo(() => new Vector2Impl(0.02, 0.05), []);

    if (padding && (Array.isArray(padding) || ArrayBuffer.isView(padding))) {
      _padding.set(padding[0], padding[1]);
    } else {
      _padding.set(0.02, 0.05);
    }

    const height = rows * fontSize + _padding.y * 2;

    return (
      <group {...restProps}>
        <group position={[-width / 2, (fontSize + _padding.y * 2) / 2, 0]}>
          <Label {...labelProps}>{label}</Label>
        </group>

        <Text
          ref={ref}
          width={width}
          name={name}
          padding={_padding}
          height={height}
          onChange={onChange}
          fontSize={fontSize}
          rows={rows}
          cursorWidth={cursorWidth}
          backgroundColor={backgroundColor}
          backgroundOpacity={backgroundOpacity}
          {...textProps}
        />
      </group>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
