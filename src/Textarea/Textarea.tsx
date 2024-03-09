import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BufferGeometry, Group, Material, Mesh, Vector2 as Vector2Impl } from "three";
import { Color, ThreeEvent, Vector2, useFrame, useThree } from "@react-three/fiber";
import {
  TextRenderInfo,
  getCaretAtPoint as getCaretAtPointBuiltIn,
  getSelectionRects,
} from "troika-three-text";
import { TextareaText } from "./Text";
import { useFormContext } from "../Form";
import { Mask, useMask } from "@react-three/drei";
import Container from "./Container";
import { damp } from "../utils";

type Props = {
  /** width of the container */
  width?: number;

  backgroundColor?: Color;
  backgroundOpacity?: number;
  selectionColor?: Color;

  /** [left/right , top/bottom] in THREE units, respectively
   *
   * note that height is implicitly defined by the capHeight of the rendered
   * text. The cap height is dependant on both the `textProps.font` being used and the
   * `textProps.fontSize` value
   */
  padding?: Vector2;
  cursorWidth?: number;
} & Pick<JSX.IntrinsicElements["group"], "position" | "rotation" | "scale"> &
  Omit<JSX.IntrinsicElements["textarea"], "ref">;

type CaretPosition = {
  x: number;
  y: number;
};

const Textarea = React.forwardRef((props: Props, ref: React.ForwardedRef<HTMLTextAreaElement>) => {
  const {
    position,
    rows = 4,
    rotation,
    scale,
    width = 1.5,
    backgroundColor = "lightgrey",
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
  const domRef = React.useRef<HTMLTextAreaElement>(null!);
  React.useImperativeHandle(ref, () => domRef.current, [domRef]);
  const groupRef = React.useRef<Group>(null);
  const caretRef = React.useRef<Mesh<BufferGeometry, Material>>(null);
  const time = React.useRef<number>(0);
  const textRef = React.useRef<Mesh<BufferGeometry, Material>>();
  const formNode = useFormContext();
  const clock = useThree((s) => s.clock);
  const events = useThree((s) => s.events);
  const gl = useThree((s) => s.gl);
  const stencil = useMask(2);
  const root = React.useRef<ReactDOM.Root | null>(null);
  const target = (formNode?.current || events.connected || gl.domElement.parentNode) as HTMLElement;

  // STATE
  const [content, setContent] = React.useState<string>((props.defaultValue as string) ?? "");
  const [active, setActive] = React.useState<boolean>(false);
  const [renderInfo, setRenderInfo] = React.useState<TextRenderInfo | null>(null);
  const [caret, setCaret] = React.useState<number>(0);
  const [selection, setSelection] = React.useState<[number, number]>([0, 0]);
  const [domEl] = React.useState(() => document.createElement("div"));
  const _padding = React.useMemo(() => new Vector2Impl(), []);

  const fontSize = React.useMemo(() => {
    return renderInfo?.parameters?.fontSize ?? 0.07;
  }, [renderInfo]);

  if (padding && Array.isArray(padding)) {
    _padding.set(padding[0], padding[1]);
  } else {
    _padding.set(0.02, 0.02);
  }

  const caretPositions: CaretPosition[] = React.useMemo(() => {
    if (!renderInfo?.caretPositions) return [{ x: 0, y: 0 }];

    const { parameters } = renderInfo;

    if (!parameters?.text) return [{ x: 0, y: 0 }];

    const rawPositions: number[] = Array.from(renderInfo.caretPositions);
    const _caretPositions: CaretPosition[] = [];

    /**
     * use RHS caret position of last character as 'last LHS caret position'
     * the rawPositions array is in sets of 4 numbers as such:
     *
     * - ith character's left caret x pos (for left to right text)
     * - ith character's right caret x pos (for right to left text)
     * - ith character's caret bottom y position
     * - ith character's caret top y position
     *
     * as we are manually adding this final caret, we must handle newlines
     * ourselves
     */
    const isNewLine = parameters.text[parameters.text.length - 1] === "\n";
    const lastCaretYTop = rawPositions[rawPositions.length - 1];
    const lastCaretYBottom = rawPositions[rawPositions.length - 2];
    const lastCaretY = (lastCaretYTop + lastCaretYBottom) / 2 - (isNewLine ? fontSize : 0);
    const lastCaretX = isNewLine ? 0 : rawPositions[rawPositions.length - 3];

    for (let i = 0; i < rawPositions.length - 1; i += 4) {
      const x = rawPositions[i];
      const ytop = rawPositions[i + 3];
      const ybottom = rawPositions[i + 2];

      _caretPositions.push({ x, y: (ytop + ybottom) / 2 });
    }

    return [..._caretPositions, { x: lastCaretX, y: lastCaretY }];
  }, [renderInfo, fontSize]);

  const caretPosition: CaretPosition = React.useMemo(() => {
    if (content) {
      return caretPositions[Math.min(caret, caretPositions.length - 1) || 0];
    } else {
      return { x: 0, y: 0 };
    }
  }, [caret, caretPositions, content]);

  const selectionRects = React.useMemo(
    () => (renderInfo ? getSelectionRects(renderInfo, selection[0], selection[1]) : undefined),
    [renderInfo, selection]
  );

  const height = rows * fontSize + _padding.y * 2;

  // EVENTS
  const handleSync = (text: { textRenderInfo: TextRenderInfo }) => {
    if (!text) return;

    setRenderInfo(text.textRenderInfo);
  };

  const handleFocus = React.useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      setActive(true);
      onFocus && onFocus(e);
    },
    [onFocus]
  );

  const handleBlur = React.useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setSelection([0, 0]);
      setActive(false);
      onBlur && onBlur(e);
    },
    [onBlur]
  );

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (e.target.value === null || e.target.value === undefined) return;
      setContent(e.target.value);
      time.current = clock.elapsedTime;
      onChange && onChange(e);
    },
    [onChange, clock]
  );

  const handleSelect = React.useCallback(
    (e: React.SyntheticEvent<HTMLTextAreaElement, Event>) => {
      if (e.target instanceof HTMLTextAreaElement) {
        const { selectionStart, selectionEnd, selectionDirection } = e.target;

        if (selectionStart === selectionEnd) {
          setCaret(selectionStart);
        } else {
          setCaret(selectionDirection === "backward" ? selectionStart : selectionEnd);
        }

        setSelection([selectionStart, selectionEnd]);
        time.current = clock.elapsedTime;
      }

      onSelect && onSelect(e);
    },
    [clock, onSelect]
  );

  const handleClick = React.useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (!active) {
        domRef.current.focus();
      }

      if (e.detail === 3) {
        domRef.current.select();
      }
    },
    [active, domRef]
  );

  const handleDoubleClick = React.useCallback(() => {
    function isWhitespace(str?: string): boolean {
      return str !== undefined && str.trim() === "";
    }

    let start = 0,
      end: number = content.length;

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

    domRef.current.setSelectionRange(start, end, "none");
  }, [caret, content, domRef]);

  const handlePointerDown = React.useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      time.current = clock.elapsedTime;

      if (!renderInfo || !textRef.current) {
        return;
      }

      const point = textRef.current.worldToLocal(e.point);
      const idx = getCaretAtPointBuiltIn(renderInfo, point.x, point.y).charIndex;
      domRef.current.setSelectionRange(idx, idx, "none");
      setSelection([idx, idx]);
      setCaret(idx);
    },
    [domRef, renderInfo, clock]
  );

  const handlePointerMove = React.useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      const buttons = e.buttons;

      // left click not held (i.e. not dragging)
      const dragging = buttons === 1 || buttons === 3;
      if (!dragging || !renderInfo || !content || !textRef.current) return;

      const point = textRef.current.worldToLocal(e.point);
      const idx = getCaretAtPointBuiltIn(renderInfo, point.x, point.y).charIndex;
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
      <textarea
        {...restProps}
        ref={domRef}
        rows={rows}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        onSelect={handleSelect}
        wrap="hard"
        style={{
          position: "absolute",
          touchAction: "none",
          pointerEvents: "none",
          fontFamily: "r3f-input",
          fontSize: `${fontSize * 500}px`,
          width: `${(width - _padding.x * 2) * 500}px`,
          left: "-1000vw",
          opacity: 0,
        }}
      />
    );
  });

  React.useEffect(() => {
    if (!renderInfo?.parameters?.font) return;

    // TODO: figure out how to get proper font-name
    const f = new FontFace("r3f-input", `url(${renderInfo?.parameters.font})`);
    document.fonts.add(f);
  }, [renderInfo]);

  React.useEffect(() => {
    if (!caretPosition || !groupRef.current) return;

    const pos = caretPosition.y + groupRef.current.position.y;
    const top = 0;
    const bottom = -(height - fontSize) + _padding.y * 2;

    if (pos > top) {
      const dy = pos - top;
      groupRef.current.position.y -= dy;
    } else if (pos < bottom) {
      const dy = bottom - pos;
      groupRef.current.position.y += dy;
    }
  }, [caretPosition, _padding, height, fontSize]);

  // BLACK MAGIC
  const CustomText: React.ReactElement | undefined = React.useMemo(() => {
    const childrenProper = React.Children.toArray(children);

    for (const child of childrenProper) {
      if ((child as React.ReactElement).type === TextareaText) {
        return React.cloneElement(child as React.ReactElement, {
          ref: textRef,
          onSync: handleSync,
          text: content || props.placeholder,
          maxWidth: width - _padding.x * 2,
        });
      }
    }
  }, [children, content, width, _padding, props.placeholder]);

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
      <group position-y={-height / 2 + fontSize / 2 + _padding.y}>
        <Mask
          id={2}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        >
          <planeGeometry args={[width - _padding.x, height - _padding.y]} />
        </Mask>

        <Container
          width={width}
          height={height}
          backgroundColor={backgroundColor}
          backgroundOpacity={backgroundOpacity}
        />
      </group>

      <group ref={groupRef}>
        <group position={[-width / 2 + _padding.x, 0, 0]}>
          <group renderOrder={3} position={[0, -(renderInfo?.capHeight ?? 0) / 2, 0]}>
            {CustomText ? (
              CustomText
            ) : (
              <TextareaText
                ref={textRef}
                onSync={handleSync as (troika: unknown) => void}
                color={color}
                text={content || props.placeholder}
                maxWidth={width - _padding.x * 2}
              />
            )}
          </group>

          <group position-x={cursorWidth / 2}>
            <mesh
              ref={caretRef}
              position={[caretPosition?.x, caretPosition?.y, 0]}
              visible={active && caret !== null}
              renderOrder={3}
              scale-x={cursorWidth}
            >
              <planeGeometry args={[1, fontSize]} />
              <meshBasicMaterial color={color} transparent toneMapped={false} depthWrite={false} />
            </mesh>
          </group>

          <group position-y={renderInfo?.descender}>
            {selectionRects?.map((rect, idx: number) => {
              const w = rect.right - rect.left;
              const h = rect.top - rect.bottom;

              const x = (rect.right + rect.left) / 2;
              const y = (rect.top + rect.bottom) / 2;
              return (
                <mesh key={idx} position={[x, y, 0]} renderOrder={2}>
                  <planeGeometry args={[w, h]} />
                  <meshBasicMaterial
                    color="#7777ff"
                    transparent
                    toneMapped={false}
                    opacity={1}
                    depthWrite={false}
                    {...stencil}
                  />
                </mesh>
              );
            })}
          </group>
        </group>
      </group>
    </group>
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
