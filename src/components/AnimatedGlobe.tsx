import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const CONTINENT_COLORS = {
  green: "#22c55e",   // South America
  blue: "#3b82f6",    // North America
  orange: "#f97316",  // Europe
  yellow: "#eab308",  // Africa
  purple: "#a855f7",  // Asia
  red: "#ef4444",     // Oceania
};

// Simple colored patches to simulate continents
const ContinentPatch = ({
  position,
  color,
  scale = 0.3,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[scale, 16, 16]} />
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
    </mesh>
  );
};

const Globe = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ocean sphere */}
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color="#e8e8e8"
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>

      {/* Continents as colored bumps on the sphere surface */}
      {/* North America */}
      <ContinentPatch position={[-0.8, 0.9, 0.9]} color={CONTINENT_COLORS.blue} scale={0.45} />
      <ContinentPatch position={[-0.6, 0.7, 1.1]} color={CONTINENT_COLORS.blue} scale={0.3} />
      <ContinentPatch position={[-1.0, 0.6, 0.8]} color={CONTINENT_COLORS.blue} scale={0.25} />

      {/* South America */}
      <ContinentPatch position={[-0.5, -0.3, 1.2]} color={CONTINENT_COLORS.green} scale={0.35} />
      <ContinentPatch position={[-0.4, -0.7, 1.1]} color={CONTINENT_COLORS.green} scale={0.3} />
      <ContinentPatch position={[-0.3, -1.0, 0.9]} color={CONTINENT_COLORS.green} scale={0.25} />

      {/* Europe */}
      <ContinentPatch position={[0.3, 1.0, 1.0]} color={CONTINENT_COLORS.orange} scale={0.3} />
      <ContinentPatch position={[0.5, 0.9, 0.95]} color={CONTINENT_COLORS.orange} scale={0.25} />
      <ContinentPatch position={[0.15, 1.15, 0.7]} color={CONTINENT_COLORS.orange} scale={0.2} />

      {/* Africa */}
      <ContinentPatch position={[0.4, 0.2, 1.3]} color={CONTINENT_COLORS.yellow} scale={0.4} />
      <ContinentPatch position={[0.5, -0.3, 1.25]} color={CONTINENT_COLORS.yellow} scale={0.35} />
      <ContinentPatch position={[0.3, -0.6, 1.15]} color={CONTINENT_COLORS.yellow} scale={0.25} />

      {/* Asia */}
      <ContinentPatch position={[1.0, 0.7, 0.7]} color={CONTINENT_COLORS.purple} scale={0.45} />
      <ContinentPatch position={[1.2, 0.4, 0.6]} color={CONTINENT_COLORS.purple} scale={0.35} />
      <ContinentPatch position={[0.9, 0.3, 1.0]} color={CONTINENT_COLORS.purple} scale={0.3} />
      <ContinentPatch position={[1.1, 0.9, 0.5]} color={CONTINENT_COLORS.purple} scale={0.25} />

      {/* Oceania */}
      <ContinentPatch position={[1.2, -0.5, 0.5]} color={CONTINENT_COLORS.red} scale={0.25} />
      <ContinentPatch position={[1.1, -0.7, 0.6]} color={CONTINENT_COLORS.red} scale={0.2} />
    </group>
  );
};

const AnimatedGlobe = () => {
  return (
    <div className="w-36 h-36 shrink-0 -mt-2">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <directionalLight position={[-3, -1, -3]} intensity={0.3} />
        <Globe />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default AnimatedGlobe;
