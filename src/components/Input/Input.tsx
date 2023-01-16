import * as React from "react";
import { InputSubmit, InputSubmitProps } from "./type/InputSubmit";
import { InputText, InputTextProps } from "./type/InputText";

type GroupProps = Omit<JSX.IntrinsicElements["group"], "type">;

type Props = Omit<InputTextProps, "type"> &
  InputSubmitProps & {
    type?: "text" | "password" | "submit";
  } & GroupProps;

/**
 * An Input field that is rendered in the canvas and bound
 * to a hidden HTML <\input\> element.
 */
const Input = React.forwardRef(
  (props: Props, ref: React.ForwardedRef<HTMLInputElement>) => {
    const { type = "text", ...restProps } = props;

    return (
      <group {...(restProps as GroupProps)}>
        {["text", "password"].includes(type) && (
          <InputText ref={ref} {...(props as InputTextProps)} />
        )}

        {type === "submit" && (
          <InputSubmit ref={ref} {...(props as InputSubmitProps)} />
        )}
      </group>
    );
  }
);

Input.displayName = "Input";

export { Input };
