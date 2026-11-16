"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  Environment,
  Float,
  Lightformer,
  OrbitControls,
  PerformanceMonitor,
  Sparkles,
} from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";

type Pointer = { x: number; y: number };

const CYAN = new THREE.Color("#06b6d4");
const VIOLET = new THREE.Color("#8b5cf6");
const { damp } = THREE.MathUtils;

/** Small seeded PRNG (mulberry32) so geometry is a pure function of the seed. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- Split an icosahedron into 20 congruent triangular shards ---------- */

type Shard = { center: THREE.Vector3; axis: THREE.Vector3; orient: THREE.Quaternion };
type ShardSet = { geometry: THREE.BufferGeometry; shards: Shard[] };

/** Orthonormal frame for a face: first edge, in-plane perpendicular, outward normal. */
function faceBasis(v0: THREE.Vector3, v1: THREE.Vector3, center: THREE.Vector3) {
  const n = center.clone().normalize();
  const e1 = v1.clone().sub(v0).normalize();
  const e2 = new THREE.Vector3().crossVectors(n, e1).normalize();
  const e1b = new THREE.Vector3().crossVectors(e2, n).normalize();
  return new THREE.Matrix4().makeBasis(e1b, e2, n);
}

/**
 * Every face of a regular icosahedron is the same equilateral triangle, so the
 * shards share one geometry (face 0, centred) and differ only by a rigid
 * transform. That lets all 20 render as a single InstancedMesh.
 */
function buildShards(radius: number): ShardSet {
  const base = new THREE.IcosahedronGeometry(radius, 0); // non-indexed: 20 faces × 3 verts
  const pos = base.getAttribute("position") as THREE.BufferAttribute;
  const rand = mulberry32(7);
  const shards: Shard[] = [];
  let geometry: THREE.BufferGeometry | null = null;
  let basis0Inv: THREE.Matrix4 | null = null;

  for (let f = 0; f < pos.count / 3; f++) {
    const v = [0, 1, 2].map((i) => new THREE.Vector3().fromBufferAttribute(pos, f * 3 + i));
    const center = new THREE.Vector3().add(v[0]).add(v[1]).add(v[2]).divideScalar(3);
    const basis = faceBasis(v[0], v[1], center);

    if (f === 0) {
      const arr = new Float32Array(9);
      v.forEach((p, i) => {
        arr[i * 3] = p.x - center.x;
        arr[i * 3 + 1] = p.y - center.y;
        arr[i * 3 + 2] = p.z - center.z;
      });
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(arr, 3));
      geometry.computeVertexNormals();
      basis0Inv = basis.clone().transpose(); // rotation inverse
    }

    // Maps face 0's centred triangle onto face f.
    const rot = basis.clone().multiply(basis0Inv!);
    const orient = new THREE.Quaternion().setFromRotationMatrix(rot);
    const axis = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize();
    shards.push({ center, axis, orient });
  }
  base.dispose();
  return { geometry: geometry!, shards };
}

/* ---------- Centerpiece: shattering glass icosahedron + wire shell + glowing core ---------- */

function Centerpiece({
  pointer,
  onInteract,
}: {
  pointer: RefObject<Pointer>;
  onInteract?: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const inst = useRef<THREE.InstancedMesh>(null);
  const glass = useRef<THREE.MeshPhysicalMaterial>(null);
  const wire = useRef<THREE.Mesh>(null);
  const wireMat = useRef<THREE.MeshBasicMaterial>(null);
  const core = useRef<THREE.Mesh>(null);
  const coreMat = useRef<THREE.MeshBasicMaterial>(null);
  const spin = useRef(0);
  const burst = useRef(0);
  const burstTarget = useRef(0);
  const [hovered, setHovered] = useState(false);

  const { geometry, shards } = useMemo(() => buildShards(1.05), []);
  // Scratch objects reused every frame (never recreated, never shared with React).
  const tmp = useRef({
    m: new THREE.Matrix4(),
    q: new THREE.Quaternion(),
    qb: new THREE.Quaternion(),
    p: new THREE.Vector3(),
    one: new THREE.Vector3(1, 1, 1),
  });

  useEffect(() => () => geometry.dispose(), [geometry]);

  const shatter = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    burstTarget.current = 1;
    window.setTimeout(() => {
      burstTarget.current = 0;
    }, 700);
    onInteract?.();
  };

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const p = pointer.current;

    // Slow idle spin plus a damped "look at cursor" tilt.
    spin.current += delta * 0.18;
    g.rotation.x = damp(g.rotation.x, -p.y * 0.45, 3.5, delta);
    g.rotation.y = damp(g.rotation.y, p.x * 0.6 + spin.current, 3.5, delta);

    // Hover: gentle pulse.
    const targetScale = hovered ? 1.06 + Math.sin(t * 5) * 0.015 : 1;
    g.scale.setScalar(damp(g.scale.x, targetScale, 6, delta));

    // Shatter: shards fly outward along their face normals and tumble, then reassemble.
    burst.current = damp(burst.current, burstTarget.current, burstTarget.current ? 9 : 4, delta);
    const b = burst.current;
    const im = inst.current;
    if (im) {
      const { m, q, qb, p: pos, one } = tmp.current;
      for (let i = 0; i < shards.length; i++) {
        const s = shards[i];
        pos.copy(s.center).multiplyScalar(1 + b * 1.9);
        qb.setFromAxisAngle(s.axis, b * Math.PI * 0.85);
        q.copy(qb).multiply(s.orient);
        m.compose(pos, q, one);
        im.setMatrixAt(i, m);
      }
      im.instanceMatrix.needsUpdate = true;
    }

    // Accent shift cyan -> violet on hover; everything glows harder mid-burst.
    const k = 1 - Math.exp(-4 * delta);
    const gm = glass.current;
    if (gm) {
      gm.emissive.lerp(hovered ? VIOLET : CYAN, k);
      gm.emissiveIntensity = damp(gm.emissiveIntensity, (hovered ? 0.4 : 0.12) + b * 1.4, 5, delta);
    }
    const wm = wireMat.current;
    if (wm) {
      wm.color.lerp(hovered ? VIOLET : CYAN, k);
      wm.opacity = 0.22 + b * 0.4;
    }
    const cm = coreMat.current;
    if (cm) {
      cm.color.lerp(hovered ? CYAN : VIOLET, k);
      cm.opacity = 0.7 - b * 0.35; // the core thins out as it swells
    }
    if (wire.current) wire.current.scale.setScalar(1.32 + b * 0.5);
    if (core.current) core.current.scale.setScalar(0.5 + b * 0.35);
  });

  return (
    <group
      ref={group}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={shatter}
    >
      <instancedMesh ref={inst} args={[geometry, undefined, shards.length]}>
        <meshPhysicalMaterial
          ref={glass}
          color="#d4d4d8"
          metalness={0.15}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.08}
          iridescence={1}
          iridescenceIOR={1.5}
          iridescenceThicknessMinimum={100}
          iridescenceThicknessMaximum={800}
          transparent
          opacity={0.9}
          flatShading
          envMapIntensity={1.6}
          emissive="#06b6d4"
          emissiveIntensity={0.12}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
      <mesh ref={wire} scale={1.32}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial ref={wireMat} wireframe color="#06b6d4" transparent opacity={0.22} />
      </mesh>
      <mesh ref={core} scale={0.5}>
        <icosahedronGeometry args={[1, 3]} />
        <meshBasicMaterial ref={coreMat} color="#8b5cf6" transparent opacity={0.7} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ---------- Orbiting wireframe rings ---------- */

function Rings() {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const c = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (a.current) a.current.rotation.z += delta * 0.25;
    if (b.current) {
      b.current.rotation.z -= delta * 0.18;
      b.current.rotation.x += delta * 0.04;
    }
    if (c.current) c.current.rotation.y += delta * 0.12;
  });

  return (
    <group>
      <mesh ref={a} rotation={[Math.PI / 2.2, 0.4, 0]}>
        <torusGeometry args={[1.85, 0.012, 8, 128]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <mesh ref={b} rotation={[Math.PI / 3, -0.6, 0.4]}>
        <torusGeometry args={[2.2, 0.05, 3, 72]} />
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.3} />
      </mesh>
      <mesh ref={c} rotation={[0.2, 0, Math.PI / 2.6]}>
        <torusGeometry args={[2.55, 0.03, 3, 96]} />
        <meshBasicMaterial color="#fafafa" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

/* ---------- Floating micro-particles with counter-parallax for depth ---------- */

function Particles({
  pointer,
  count = 320,
  seed = 1337,
  spread = 1,
}: {
  pointer: RefObject<Pointer>;
  count?: number;
  seed?: number;
  /** Horizontal stretch of the shell; >1 turns the sphere into a wide band. */
  spread?: number;
}) {
  const ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const rand = mulberry32(seed);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [CYAN, VIOLET, new THREE.Color("#fafafa")];
    for (let i = 0; i < count; i++) {
      const r = 2.4 + rand() * 1.8;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta) * spread;
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(rand() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count, seed, spread]);

  useFrame((state, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const p = pointer.current;
    pts.rotation.y += delta * 0.03;
    pts.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.12;
    pts.position.x = damp(pts.position.x, -p.x * 0.35, 2, delta);
    pts.position.y = damp(pts.position.y, -p.y * 0.25, 2, delta);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ---------- Keep rendering when the canvas re-enters the viewport ---------- */

function FrameloopSync({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate]);
  return null;
}

/* ---------- Camera framing for a full-bleed canvas ---------- */

export type HeroLayout = "wide" | "stacked";

/**
 * The canvas spans the whole viewport width, so the camera decides where the
 * object sits. "wide": object pushed right of the text column via a projection
 * view offset (orbiting still pivots on the object). "stacked": object centred,
 * camera pulled back far enough that it fits narrow portrait screens.
 */
function CameraRig({ layout }: { layout: HeroLayout }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);

  useEffect(() => {
    const halfTan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const aspect = width / height;
    let dist: number;
    if (layout === "wide") {
      dist = 6.9;
      camera.setViewOffset(width, height, -width * 0.24, 0, width, height);
    } else {
      // Keep ~3 units of object inside both the visible width and height.
      dist = Math.max(6.4 / (2 * halfTan), 4.2 / (2 * halfTan * aspect));
      camera.clearViewOffset();
    }
    camera.position.setLength(dist);
    camera.updateProjectionMatrix();
  }, [camera, width, height, layout]);

  return null;
}

/* ---------- Scene ---------- */

function Scene({
  pointer,
  onInteract,
  layout,
  touch,
}: {
  pointer: RefObject<Pointer>;
  onInteract?: () => void;
  layout: HeroLayout;
  touch: boolean;
}) {
  const wide = layout === "wide";
  return (
    <>
      <CameraRig layout={layout} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 4, 5]} intensity={1.2} />
      <pointLight position={[3, 2, 3]} color="#06b6d4" intensity={40} distance={14} />
      <pointLight position={[-3, -2, 2]} color="#8b5cf6" intensity={40} distance={14} />

      {/* Procedural environment map: no network fetch, rendered once. */}
      <Environment resolution={64}>
        <Lightformer
          form="rect"
          intensity={3}
          color="#06b6d4"
          position={[4, 2, -3]}
          scale={[5, 3, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={3}
          color="#8b5cf6"
          position={[-4, -2, -3]}
          scale={[5, 3, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer form="ring" intensity={2} color="#ffffff" position={[0, 5, 3]} scale={3} />
      </Environment>

      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.9}>
        <Centerpiece pointer={pointer} onInteract={onInteract} />
        <Rings />
      </Float>
      <Particles pointer={pointer} count={touch ? 220 : 320} />
      {/* A wide, sparse dust field so the scene reaches across the whole screen. */}
      <Particles pointer={pointer} count={touch ? 160 : 260} seed={4242} spread={wide ? 3.4 : 1.6} />
      <Sparkles
        count={touch ? 50 : 90}
        scale={wide ? [16, 6, 4] : [7, 9, 4]}
        size={2.5}
        speed={0.25}
        opacity={0.5}
        color="#67e8f9"
        noise={0.6}
      />

      {/* OrbitControls forces `touch-action: none` on the canvas, which would
          block page scrolling on phones. Touch devices get tap-to-shatter only. */}
      {touch ? null : (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.5}
        />
      )}

      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.7}
          luminanceSmoothing={0.25}
          mipmapBlur
          intensity={1.15}
          radius={0.7}
        />
      </EffectComposer>
    </>
  );
}

/* ---------- Canvas wrapper ---------- */

export default function Hero3D({
  active = true,
  onInteract,
  layout = "wide",
  touch = false,
}: {
  active?: boolean;
  onInteract?: () => void;
  layout?: HeroLayout;
  touch?: boolean;
}) {
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const hi = touch ? 1.25 : 1.5;
  const [dpr, setDpr] = useState(hi);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      style={{ touchAction: "pan-y" }}
    >
      {/* Drop to 1x when frames get slow, climb back when they recover. */}
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(hi)}
        onFallback={() => setDpr(1)}
        flipflops={3}
      />
      <FrameloopSync active={active} />
      <Scene pointer={pointer} onInteract={onInteract} layout={layout} touch={touch} />
    </Canvas>
  );
}
