import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Color, ThreeEvent, Vector2, useFrame, useThree } from "@react-three/fiber";
import { BufferGeometry, Group, Material, Mesh, Vector2 as Vector2Impl } from "three";
import { Mask, useCursor, useMask } from "@react-three/drei";
import { InputText } from "./Text";
import { useFormContext } from "../Form";
import { getCaretAtPoint, TextRenderInfo } from "troika-three-text";
import { damp } from "../utils";

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
} & Pick<JSX.IntrinsicElements["group"], "position" | "rotation" | "scale"> &
  Omit<JSX.IntrinsicElements["input"], "type" | "ref">;

/**
 * An Input field that is rendered in the canvas and bound
 * to a hidden HTML <\input\> element.
 */
const Input = React.forwardRef((props: Props, ref?: React.ForwardedRef<HTMLInputElement>) => {
  const {
    type = "text",
    position,
    rotation,
    scale,
    width = 1.5,
    backgroundColor = "lightgrey",
    selectionColor = "#7777ff",
    backgroundOpacity = 0.3,
    padding,
    cursorWidth = 0.005,
    children,
    onChange,
    onFocus,
    onBlur,
    onSelect,
    ...restProps
  } = props;

  // REFS etc
  const domRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => domRef.current as HTMLInputElement);
  const textRef = React.useRef<Mesh<BufferGeometry, Material>>(null);
  const groupRef = React.useRef<Group>(null);
  const caretRef = React.useRef<Mesh<BufferGeometry, Material>>(null);
  const stencil = useMask(1);
  const events = useThree((s) => s.events);
  const gl = useThree((s) => s.gl);
  const formNode = useFormContext();
  const root = React.useRef<ReactDOM.Root | null>(null);
  const target = formNode?.current || (events.connected as HTMLElement) || gl.domElement.parentNode;

  // STATE
  const clock = useThree((s) => s.clock);
  const time = React.useRef<number>(0);
  const [domEl] = React.useState(() => document.createElement("div"));
  const [active, setActive] = React.useState<boolean>(false);
  const defaultVal = Array.isArray(props.defaultValue)
    ? props.defaultValue.join("")
    : props.defaultValue?.toString() ?? "";

  const [content, setContent] = React.useState<string>(defaultVal);
  const [caret, setCaret] = React.useState<number | null>(0);
  const [selection, setSelection] = React.useState<[number, number]>([0, 0]);
  const [renderInfo, setRenderInfo] = React.useState<TextRenderInfo | null>(null);
  const [hovered, setHovered] = React.useState<boolean>(false);

  const _padding = React.useMemo(() => new Vector2Impl(), []);
  if (padding && Array.isArray(padding)) {
    _padding.set(padding[0], padding[1]);
  } else {
    _padding.set(0.02, 0.02);
  }

  const fontSize: number = React.useMemo(() => {
    return renderInfo?.parameters?.fontSize ?? 0.07;
  }, [renderInfo]);

  const height = fontSize + _padding.y * 2;
  const caretPositions: number[] = React.useMemo(() => {
    if (!renderInfo?.caretPositions) return [0];

    const lastCaret = renderInfo.caretPositions[renderInfo.caretPositions.length - 3];

    const caretPositions = renderInfo.caretPositions.filter((_, i) => i % 4 === 0);

    return [...caretPositions, lastCaret];
  }, [renderInfo]);

  const caretPosition = React.useMemo(() => {
    if (content && caret !== null) {
      return caretPositions[Math.min(caret, caretPositions.length - 1) || 0];
    } else {
      return 0;
    }
  }, [caret, caretPositions, content]);

  const renderedContent = React.useMemo(() => {
    if (type === "password") {
      return "•".repeat(content.length);
    }
    if (content) {
      return content;
    }
    return props.placeholder ?? "";
  }, [content, type, props.placeholder]);

  // EVENTS
  useCursor(hovered, "text");

  const handleSync = (text: { textRenderInfo: TextRenderInfo }) => {
    if (text) setRenderInfo(text.textRenderInfo);
  };

  const handleFocus = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      e.nativeEvent.preventDefault();
      setActive(true);
      onFocus && onFocus(e);
    },
    [onFocus]
  );

  const handleBlur = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setSelection([0, 0]);
      setActive(false);
      onBlur && onBlur(e);
    },
    [onBlur]
  );

  const handleSelect = React.useCallback(
    (e: React.SyntheticEvent<HTMLInputElement, Event>) => {
      if (e.target instanceof HTMLInputElement) {
        const { selectionStart, selectionEnd } = e.target;

        if (selectionStart === selectionEnd) {
          setCaret(selectionStart);
        } else {
          setCaret(null);
        }

        setSelection([selectionStart ?? 0, selectionEnd ?? 0]);
        time.current = clock.elapsedTime;
      }

      onSelect && onSelect(e);
    },
    [clock, onSelect]
  );

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setContent(e.target.value);
      time.current = clock.elapsedTime;
      onChange && onChange(e);
    },
    [onChange, clock]
  );

  const handleClick = React.useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (!active) {
        domRef.current?.focus();
      }

      if (e.detail === 3) {
        domRef.current?.select();
      }
    },
    [active, domRef]
  );

  const handleDoubleClick = React.useCallback(() => {
    function isWhitespace(str?: string): boolean {
      return str !== undefined && str.trim() === "";
    }

    let start = 0;
    let end = content.length;

    if (type === "password" || caret === null) {
      domRef.current?.select();
      return;
    }

    for (let i = caret; i < content.length; i++) {
      if (isWhitespace(content[i])) {
        end = i;
        break;
      }
    }

    for (let i = caret; i > 0; i--) {
      if (isWhitespace(content[i])) {
        start = i > 0 ? i + 1 : i;
        break;
      }
    }

    domRef.current?.setSelectionRange(start, end, "none");
  }, [caret, content, type, domRef]);

  const handlePointerDown = React.useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      time.current = clock.elapsedTime;

      if (!renderInfo || !content || !textRef.current || !domRef.current) {
        return;
      }

      const point = textRef.current.worldToLocal(e.point);
      const idx = getCaretAtPoint(renderInfo, point.x, point.y).charIndex;
      setSelection([idx, idx]);
      setCaret(idx);
      domRef.current.setSelectionRange(idx, idx, "none");
    },
    [domRef, renderInfo, clock, content]
  );

  const handlePointerMove = React.useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      const buttons = e.buttons;

      // left click not held (i.e. not dragging)
      const dragging = buttons === 1 || buttons === 3;
      if (!dragging || !renderInfo || !content || !textRef.current || !domRef.current || caret === null) {
        return;
      }

      const point = textRef.current.worldToLocal(e.point);
      const idx = getCaretAtPoint(renderInfo, point.x, point.y).charIndex;
      let start: number, end: number, dir: "forward" | "backward" | "none";

      if (idx < caret) {
        start = idx;
        end = caret;
        dir = "backward";
      } else if (idx > caret) {
        start = caret;
        end = idx;
        dir = "forward";
      } else {
        start = end = idx;
        dir = "none";
      }

      setSelection([start, end]);
      domRef.current.setSelectionRange(start, end, dir);
    },
    [domRef, renderInfo, caret, content]
  );

  // EFFECTS
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
        ref={domRef}
        {...restProps}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        onSelect={handleSelect}
        style={{
          position: "absolute",
          left: "-1000vw",
          transform: "translateX(-50%)",
          width: `${10 * width}em`,
          touchAction: "none",
          pointerEvents: "none",
          opacity: 0,
        }}
      />
    );
  });

  React.useEffect(() => {
    if (!groupRef.current || !domRef.current) {
      return;
    }

    let pos: number | undefined = undefined;
    const innerWidth = width - _padding.x * 2;
    const [selectionStart, selectionEnd] = [
      caretPositions[selection[0]] + groupRef.current.position.x,
      caretPositions[selection[1]] + groupRef.current.position.x,
    ];

    let left = 0;
    const right = innerWidth;

    if (caret !== null) {
      pos = caretPositions[caret] + groupRef.current.position.x;
      if (caret > 0) {
        // ensure there is always a character visible on the left
        left += caretPositions[caret] - caretPositions[caret - 1];
      }
      if (pos === undefined || Number.isNaN(pos)) return;
    } else {
      const dir = domRef.current.selectionDirection;
      if (selectionStart < left && dir === "backward") {
        pos = selectionStart;
      } else if (selectionEnd > right && dir === "forward") {
        pos = selectionEnd;
      }
    }

    if (pos === undefined) return;

    if (pos > right) {
      const dx = pos - right;
      groupRef.current.position.x -= dx;
    } else if (pos < left) {
      const dx = left - pos;
      groupRef.current.position.x += dx;
    }
  }, [_padding, width, padding, caret, caretPositions, selection, domRef]);

  // BLACK MAGIC
  const CustomText: React.ReactElement | undefined = React.useMemo(() => {
    const childrenProper = React.Children.toArray(children);
    for (const child of childrenProper) {
      if (typeof child === "string" || typeof child === "number") return;

      if ((child as React.ReactElement).type === InputText) {
        const t = React.cloneElement(child as React.ReactElement, {
          ref: textRef,
          onSync: handleSync,
          text: renderedContent,
        });

        return t;
      }
    }
  }, [children, renderedContent]);

  const color = React.useMemo(() => {
    if (CustomText && CustomText.props.color) {
      return CustomText.props.color;
    }

    return "black";
  }, [CustomText]);

  useFrame((_, delta) => {
    if (!caretRef.current) return;

    const t = (clock.elapsedTime - time.current) % 2;
    const opacity = t <= 1.25 ? 1 : 0;

    caretRef.current.material.opacity = damp(caretRef.current.material.opacity, opacity, 24, delta);
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Mask
        id={1}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <planeGeometry args={[width - _padding.x, height]} />
      </Mask>

      <group position={[-width / 2 + _padding.x, 0, 0]}>
        <group ref={groupRef}>
          <group renderOrder={3} position={[0, -(renderInfo?.capHeight ?? 0) / 2, 0]}>
            <React.Suspense fallback={null}>
              {CustomText ? (
                CustomText
              ) : (
                <InputText ref={textRef} onSync={handleSync}>
                  {renderedContent}
                </InputText>
              )}
            </React.Suspense>
          </group>

          <group position-x={cursorWidth / 2}>
            <mesh
              ref={caretRef}
              position={[caretPosition, 0, 0]}
              visible={active && caret !== null}
              renderOrder={3}
              scale={[cursorWidth, fontSize, 1]}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial color={color} transparent toneMapped={false} depthWrite={false} />
            </mesh>
          </group>

          <group position={[(caretPositions[selection[0]] + caretPositions[selection[1]]) / 2, 0, 0]}>
            <mesh scale-x={Math.abs(caretPositions[selection[0]] - caretPositions[selection[1]])} renderOrder={2}>
              <planeGeometry args={[1, fontSize]} />
              <meshBasicMaterial
                color={selectionColor}
                transparent
                toneMapped={false}
                opacity={1}
                depthWrite={false}
                {...stencil}
              />
            </mesh>
          </group>
        </group>
      </group>

      <mesh onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} renderOrder={1}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={backgroundColor} transparent opacity={backgroundOpacity} depthWrite={false} />
      </mesh>
    </group>
  );
});

Input.displayName = "Input";

export { Input };
