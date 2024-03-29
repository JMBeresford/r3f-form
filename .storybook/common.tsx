import * as React from "react";
import { Canvas, Color, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { damp, randFloat, randInt, seededRandom } from "three/src/math/MathUtils";
import { Group } from "three";

const Shapes = () => {
  let n = 7;
  const ref = React.useRef<Group>(null);

  useFrame((_, delta) => {
    if (ref.current && ref.current.rotation.y) {
      ref.current.rotation.y += delta * 10;
    }
  });

  return (
    <>
      <group ref={ref}>
        {Array.from({ length: n }).map((_, idx) => {
          const r = randFloat(0.35, 0.8);
          const b = randFloat(0.35, 0.8);
          const g = randFloat(0.35, 0.8);
          const color: Color = [r, g, b];

          const pos: [number, number, number] = [
            randFloat(0.2, 1.2) * (Math.random() < 0.5 ? 1 : -1),
            randFloat(0.2, 0.8) * (Math.random() < 0.5 ? 1 : -1),
            randFloat(0.2, 0.5) * (Math.random() < 0.5 ? 1 : -1),
          ];

          const rot: [number, number, number] = [
            randFloat(-Math.PI * 2, Math.PI * 2),
            randFloat(-Math.PI * 2, Math.PI * 2),
            randFloat(-Math.PI * 2, Math.PI * 2),
          ];

          const geometries = [
            <sphereGeometry args={[0.075, 20, 20]} />,
            <coneGeometry args={[0.075, 0.15, 15, 10]} />,
            <boxGeometry args={[0.15, 0.15, 0.15]} />,
          ];

          return (
            <Float key={idx} speed={seededRandom(idx) + 0.5}>
              <mesh position={pos} rotation={rot}>
                {geometries[randInt(0, geometries.length - 1)]}
                <meshStandardMaterial color={color} toneMapped={true} />
              </mesh>
            </Float>
          );
        })}
      </group>
    </>
  );
};

const Rig = () => {
  const camera = useThree((s) => s.camera);

  useFrame(({ mouse }, delta) => {
    let x = mouse.x * 0.1;
    let y = mouse.y * 0.1;

    camera.rotation.x = damp(camera.rotation.x, y, 12, delta);
    camera.rotation.y = damp(camera.rotation.y, -x, 12, delta);
  });
  return <></>;
};

const Scene = ({ lightColor = "red", children }) => (
  <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 1.125], fov: 65 }}>
    <Environment background preset="sunset" blur={0.85} />
    <hemisphereLight args={["#ffffff", lightColor]} />
    {/* <ContactShadows position-y={-1} opacity={0.85} blur={1} /> */}
    <Shapes />

    {children}
    <Rig />
  </Canvas>
);

export { Scene };
