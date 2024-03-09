import { useThree } from "@react-three/fiber";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { FormContext } from "./FormContext";

type Props = Omit<React.HTMLAttributes<HTMLFormElement>, "ref">;

const Form = React.forwardRef((props: Props, ref: React.ForwardedRef<HTMLFormElement>) => {
  const { children, ...restProps } = props;
  const events = useThree((s) => s.events);
  const gl = useThree((s) => s.gl);
  const root = React.useRef<ReactDOM.Root | null>(null);
  const domRef = React.useRef<HTMLFormElement>(null!);
  const target = (events.connected || gl.domElement.parentNode) as HTMLElement;
  React.useImperativeHandle(ref, () => domRef.current);

  const [domEl] = React.useState(() => document.createElement("div"));

  React.useLayoutEffect(() => {
    root.current = ReactDOM.createRoot(domEl);
    const curRoot = root.current;

    target?.appendChild(domEl);

    return () => {
      target?.removeChild(domEl);
      curRoot.unmount();
    };
  }, [target, domEl]);

  React.useLayoutEffect(() => {
    root.current?.render(
      <form
        ref={domRef}
        id="_r3f-input-form"
        style={{ opacity: 0, pointerEvents: "none", touchAction: "none" }}
        {...restProps}
      ></form>
    );
  });

  return <FormContext.Provider value={domRef}>{children}</FormContext.Provider>;
});

Form.displayName = "Form";

export { Form };
