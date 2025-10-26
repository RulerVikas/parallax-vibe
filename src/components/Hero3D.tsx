import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Box } from "@react-three/drei";
import * as THREE from "three";

function FloatingShape({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Box ref={meshRef} args={[1, 1, 1]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0}
          metalness={0.8}
        />
      </Box>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#a855f7" />
      
      <FloatingShape position={[0, 0, 0]} color="#a855f7" />
      <FloatingShape position={[2, 1, -1]} color="#ec4899" />
      <FloatingShape position={[-2, -1, -1]} color="#06b6d4" />
      
      <Sphere args={[0.5, 32, 32]} position={[3, -2, 0]}>
        <MeshDistortMaterial
          color="#f59e0b"
          attach="material"
          distort={0.5}
          speed={3}
          roughness={0.2}
          metalness={0.5}
        />
      </Sphere>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  );
}

export const Hero3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};
