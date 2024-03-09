import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Text, useCursor } from "@react-three/drei";
import { Color, ThreeEvent, useThree } from "@react-three/fiber";
import { useFormContext } from "../Form";

type ButtonProps = {
  value?: string;
  fontSize?: number;
  width?: number;
  height?: number;
  color?: Color;
  backgroundColor?: Color;
};

export type Props = ButtonProps &
  Pick<JSX.IntrinsicElements["group"], "position" | "rotation" | "scale"> &
  Omit<JSX.IntrinsicElements["input"], "ref">;

const Button = (props: ButtonProps) => {
  const {
    backgroundColor,
    width = 1.5,
    height = 0.1325,
    fontSize = 0.0825,
    color = "black",
    value,
  } = props;

  return (
    <group>
      <Text fontSize={fontSize} color={color} renderOrder={3} anchorY={"middle"}>
        {value}
      </Text>
      <mesh renderOrder={1}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={backgroundColor} depthWrite={false} transparent />
      </mesh>
    </group>
  );
};

const Submit = React.forwardRef((props: Props, ref: React.ForwardedRef<HTMLInputElement>) => {
  const { value, children, position, rotation, scale, ...restProps } = props;

  const root = React.useRef<ReactDOM.Root | null>(null);
  const formNode = useFormContext();
  const events = useThree((s) => s.events);
  const gl = useThree((s) => s.gl);
  const target = (formNode?.current || events.connected || gl.domElement.parentNode) as HTMLElement;

  const [domEl] = React.useState(() => document.createElement("div"));
  const [hovered, setHovered] = React.useState<boolean>(false);

  useCursor(hovered);

  const handleClick = React.useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();

      if (formNode.current?.requestSubmit) {
        formNode.current.requestSubmit();
      } else {
        formNode.current?.submit();
      }
    },
    [formNode]
  );

  React.useLayoutEffect(() => {
    root.current = ReactDOM.createRoot(domEl);
    const curRoot = root.current;

    target?.appendChild(domEl);

    return () => {
      target?.removeChild(domEl);
      curRoot.unmount();
    };
  }, [domEl, target]);

  React.useLayoutEffect(() => {
    root.current?.render(
      <input
        ref={ref}
        type="submit"
        value={value}
        style={{
          position: "absolute",
          left: "-1000vw",
          touchAction: "none",
          pointerEvents: "none",
          opacity: 0,
        }}
        {...restProps}
      />
    );
  });

  return (
    <>
      <group
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        {children ? children : <Button {...(props as ButtonProps)} />}
      </group>
    </>
  );
});

Submit.displayName = "InputSubmit";

export { Submit };
